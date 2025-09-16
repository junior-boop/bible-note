import Database from "better-sqlite3";
import { SyncQueue } from "./SyncQueue";
import {
  handleInsertOperation,
  handleUpdateOperation,
  handleDeleteOperation,
} from "./database-operations";
import {
  DatabaseError,
  ErrorCodes,
  SyncError,
  ValidationError,
} from "./errors";

// Types de base partagés
export interface QueryResult {
  lastInsertRowid?: number;
  changes: number;
}

export interface DatabaseRow {
  [key: string]: any;
}

export interface WhereConditions {
  [key: string]: any;
}

export interface OrderByOptions {
  column: string;
  direction?: "ASC" | "DESC";
}

export interface IncludeOptions {
  model: string;
  foreignKey: string;
  localKey?: string;
  as?: string;
}

export interface QueryOptions {
  where?: WhereConditions;
  orderBy?: OrderByOptions | OrderByOptions[];
  limit?: number;
  offset?: number;
  include?: IncludeOptions | IncludeOptions[];
}

export interface TableSchema {
  [columnName: string]: string;
}

// Types pour la synchronisation
export interface SyncOperation {
  id: string;
  operation: "CREATE" | "UPDATE" | "DELETE";
  tableName: string;
  recordId: string | number;
  data: Record<string, unknown>;
  timestamp: number;
  version: number;
  clientId: string;
  synced: boolean;
  retryCount?: number;
}

export interface SyncConfig {
  serverUrl: string;
  apiKey?: string;
  clientId: string;
  syncInterval?: number;
  retryAttempts?: number;
  enableRealtime?: boolean;
  conflictResolution?: "client" | "server" | "latest" | "custom";
  customConflictResolver?: (local: any, remote: any) => any;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  isSyncing: boolean;
  errors: string[];
}

export interface RealtimeEvent {
  type: "CREATE" | "UPDATE" | "DELETE";
  table: string;
  record: any;
  timestamp: number;
  clientId: string;
}

// ORM de base avec support de la synchronisation
export class SimpleORM {
  private db: Database.Database;
  private prepared: Map<string, Database.Statement> = new Map();
  private syncManager: SyncManager | null = null;

  constructor(dbPath: string, options?: Database.Options) {
    this.db = new Database(dbPath, options);
  }

  // Configuration de la synchronisation
  enableSync(config: SyncConfig): void {
    this.syncManager = new SyncManager(this, config);
  }

  disableSync(): void {
    if (this.syncManager) {
      this.syncManager.destroy();
      this.syncManager = null;
    }
  }

  // Méthodes de base de l'ORM
  private getStatement(sql: string): Database.Statement {
    if (!this.prepared.has(sql)) {
      this.prepared.set(sql, this.db.prepare(sql));
    }
    return this.prepared.get(sql)!;
  }

  private sanitizeParams(params: any[]): any[] {
    return params.map((param) => {
      if (param === null || param === undefined) {
        return null;
      }
      if (param instanceof Date) {
        return param.toISOString();
      }
      if (typeof param === "boolean") {
        return param ? 1 : 0;
      }
      if (typeof param === "object" && param !== null) {
        return JSON.stringify(param);
      }
      return param;
    });
  }

  // Méthodes principales avec support de synchronisation
  query<T = DatabaseRow>(sql: string, params: any[] = []): T[] {
    try {
      const sanitizedParams = this.sanitizeParams(params);
      const stmt = this.getStatement(sql);
      return stmt.all(...sanitizedParams);
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes("no such table")) {
          throw new DatabaseError(
            error.message,
            ErrorCodes.TABLE_NOT_FOUND,
            sql,
            params
          );
        }
        if (message.includes("no such column")) {
          throw new DatabaseError(
            error.message,
            ErrorCodes.COLUMN_NOT_FOUND,
            sql,
            params
          );
        }
        if (message.includes("constraint failed")) {
          throw new DatabaseError(
            error.message,
            ErrorCodes.CONSTRAINT_VIOLATION,
            sql,
            params
          );
        }
        if (message.includes("syntax error")) {
          throw new DatabaseError(
            error.message,
            ErrorCodes.INVALID_QUERY,
            sql,
            params
          );
        }
      }
      throw new DatabaseError(
        "Une erreur de base de données est survenue",
        ErrorCodes.INVALID_QUERY,
        sql,
        params
      );
    }
  }

  get<T = DatabaseRow>(sql: string, params: any[] = []): T | null {
    try {
      const sanitizedParams = this.sanitizeParams(params);
      const stmt = this.getStatement(sql);
      return stmt.get(...sanitizedParams) || null;
    } catch (error) {
      console.error("Get error:", error, "SQL:", sql, "Params:", params);
      throw error;
    }
  }

  run(sql: string, params: any[] = []): QueryResult {
    try {
      const sanitizedParams = this.sanitizeParams(params);
      const stmt = this.getStatement(sql);
      const result = stmt.run(...sanitizedParams);

      return {
        lastInsertRowid: result.lastInsertRowid as number,
        changes: result.changes,
      };
    } catch (error) {
      console.error("Run error:", error, "SQL:", sql, "Params:", params);
      throw error;
    }
  }

  exec(sql: string): void {
    try {
      this.db.exec(sql);
    } catch (error) {
      console.error("Exec error:", error);
      throw error;
    }
  }

  // Méthodes pour supporter le ModelFactory
  async create<T extends DatabaseRow>(
    tableName: string,
    data: Partial<T>
  ): Promise<T> {
    const result = await handleInsertOperation(
      this,
      tableName,
      data as Record<string, unknown>
    );
    return { id: result.id, ...data } as T;
  }

  async findAll<T extends DatabaseRow>(
    tableName: string,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const { where = {}, orderBy, limit, offset } = options;
    let sql = `SELECT * FROM ${tableName}`;
    const params: any[] = [];

    if (Object.keys(where).length > 0) {
      const whereClause = Object.entries(where)
        .map(([key]) => `${key} = ?`)
        .join(" AND ");
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(where));
    }

    if (orderBy) {
      const orderClauses = (Array.isArray(orderBy) ? orderBy : [orderBy])
        .map((order) => `${order.column} ${order.direction || "ASC"}`)
        .join(", ");
      sql += ` ORDER BY ${orderClauses}`;
    }

    if (limit) {
      sql += ` LIMIT ${limit}`;
      if (offset) {
        sql += ` OFFSET ${offset}`;
      }
    }

    return this.query<T>(sql, params);
  }

  async findById<T extends DatabaseRow>(
    tableName: string,
    id: string | number
  ): Promise<T | null> {
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    return this.get<T>(sql, [id]);
  }

  async update<T extends DatabaseRow>(
    tableName: string,
    id: string | number,
    data: Partial<T>
  ): Promise<T | null> {
    await handleUpdateOperation(
      this,
      tableName,
      id,
      data as Record<string, unknown>
    );
    return this.findById<T>(tableName, id);
  }

  async delete(tableName: string, id: string | number): Promise<boolean> {
    const result = await handleDeleteOperation(this, tableName, id);
    return result > 0;
  }

  async count(
    tableName: string,
    conditions: WhereConditions = {}
  ): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${tableName}`;
    const params: any[] = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.entries(conditions)
        .map(([key]) => `${key} = ?`)
        .join(" AND ");
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    const result = await this.get<{ count: number }>(sql, params);
    return result?.count || 0;
  }

  async exists(
    tableName: string,
    conditions: WhereConditions
  ): Promise<boolean> {
    const count = await this.count(tableName, conditions);
    return count > 0;
  }

  async findOrCreate<T extends DatabaseRow>(
    tableName: string,
    conditions: WhereConditions,
    defaults: Partial<T> = {}
  ): Promise<{ record: T; created: boolean }> {
    const existing = await this.findOne<T>(tableName, { where: conditions });

    if (existing) {
      return { record: existing, created: false };
    }

    const record = await this.create<T>(tableName, {
      ...conditions,
      ...defaults,
    });
    return { record, created: true };
  }

  async findOne<T extends DatabaseRow>(
    tableName: string,
    options: QueryOptions
  ): Promise<T | null> {
    const results = await this.findAll<T>(tableName, { ...options, limit: 1 });
    return results[0] || null;
  }

  async bulkCreate<T extends DatabaseRow>(
    tableName: string,
    records: Partial<T>[]
  ): Promise<T[]> {
    const results: T[] = [];

    await this.transaction(async () => {
      for (const record of records) {
        const result = await this.create<T>(tableName, record);
        results.push(result);
      }
    });

    return results;
  }

  async bulkUpdate<T extends DatabaseRow>(
    tableName: string,
    records: Array<{ id: string | number } & Partial<T>>
  ): Promise<number> {
    let totalChanges = 0;

    await this.transaction(async () => {
      for (const record of records) {
        const { id, ...data } = record;
        const result = await this.update<T>(tableName, id, data);
        if (result) totalChanges++;
      }
    });

    return totalChanges;
  }

  async increment<T extends DatabaseRow>(
    tableName: string,
    id: string | number,
    field: keyof T,
    value: number = 1
  ): Promise<T | null> {
    const sql = `UPDATE ${tableName} SET ${String(field)} = ${String(field)} + ? WHERE id = ?`;
    await this.run(sql, [value, id]);
    return this.findById<T>(tableName, id);
  }

  async decrement<T extends DatabaseRow>(
    tableName: string,
    id: string | number,
    field: keyof T,
    value: number = 1
  ): Promise<T | null> {
    return this.increment<T>(tableName, id, field, -value);
  }

  // Gestion des transactions
  transaction<T>(fn: () => T): T {
    try {
      this.db.exec("BEGIN TRANSACTION");
      const result = fn();
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  // Méthodes de gestion du cycle de vie
  close(): void {
    this.prepared.clear();
    if (this.syncManager) {
      this.syncManager.destroy();
    }
    this.db.close();
  }

  get isOpen(): boolean {
    return !this.db.readonly;
  }

  get name(): string {
    return this.db.name;
  }

  // Méthodes spécifiques à SQLite
  pragma(name: string, value?: any): any {
    if (value !== undefined) {
      return this.get(`PRAGMA ${name} = ${value}`);
    }
    return this.get(`PRAGMA ${name}`);
  }

  backup(destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.db
          .backup(destination)
          .then(() => resolve())
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Classe de synchronisation intégrée
class SyncManager {
  private orm: SimpleORM;
  private config: SyncConfig;
  private syncStatus: SyncStatus;
  private syncQueue: SyncQueue;
  private websocket: WebSocket | null = null;
  private syncTimer: number | null = null;
  private backoffDelay: number = 1000;

  constructor(orm: SimpleORM, config: SyncConfig) {
    this.orm = orm;
    this.config = config;
    this.syncQueue = new SyncQueue();
    this.syncStatus = {
      isOnline: this.isInBrowser() ? navigator.onLine : true,
      lastSync: null,
      pendingOperations: 0,
      isSyncing: false,
      errors: [],
    };

    this.initializeSyncTables();
    this.setupEventListeners();

    if (config.enableRealtime) {
      this.connectWebSocket();
    }

    if (config.syncInterval && config.syncInterval > 0) {
      this.startPeriodicSync();
    }
  }

  // Le reste de l'implémentation du SyncManager reste identique...
  // [Code du SyncManager précédent]

  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.syncQueue.clear();
  }
}

// Export du ModelFactory
export { ModelFactory } from "./src/lib/model-factory";
