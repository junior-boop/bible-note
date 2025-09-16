import Database from "better-sqlite3";
import { SyncQueue } from "./src/lib/simpleorm/SyncQueue";
import {
  handleInsertOperation,
  handleUpdateOperation,
  handleDeleteOperation,
} from "./src/lib/simpleorm/database-operations";

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

class SyncManager {
  private orm: any; // Remplacer par le type correct
  private config: SyncConfig;
  private syncStatus: SyncStatus;
  private syncQueue: SyncQueue;
  private websocket: WebSocket | null = null;
  private syncTimer: number | null = null;
  private backoffDelay: number = 1000; // Délai initial de 1 seconde

  constructor(orm: any, config: SyncConfig) {
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

  private isInBrowser(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  private async initializeSyncTables(): Promise<void> {
    try {
      // Créer la table des opérations de synchronisation
      await this.orm.exec(`
        CREATE TABLE IF NOT EXISTS _sync_operations (
          id TEXT PRIMARY KEY,
          operation TEXT NOT NULL,
          table_name TEXT NOT NULL,
          record_id TEXT NOT NULL,
          data TEXT,
          timestamp INTEGER NOT NULL,
          version INTEGER NOT NULL,
          client_id TEXT NOT NULL,
          synced INTEGER DEFAULT 0,
          retry_count INTEGER DEFAULT 0
        )
      `);

      // Créer les index pour améliorer les performances
      await this.orm.exec(`
        CREATE INDEX IF NOT EXISTS idx_sync_ops_synced ON _sync_operations(synced);
        CREATE INDEX IF NOT EXISTS idx_sync_ops_timestamp ON _sync_operations(timestamp);
      `);

      // Table pour les métadonnées de synchronisation
      await this.orm.exec(`
        CREATE TABLE IF NOT EXISTS _sync_metadata (
          table_name TEXT PRIMARY KEY,
          last_sync_timestamp INTEGER,
          last_version INTEGER DEFAULT 0
        )
      `);
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation des tables de synchronisation:",
        error
      );
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (this.isInBrowser()) {
      window.addEventListener("online", this.handleOnline.bind(this));
      window.addEventListener("offline", this.handleOffline.bind(this));
    }
  }

  private handleOnline = (): void => {
    this.syncStatus.isOnline = true;
    this.syncStatus.errors = [];
    this.processPendingOperations();
  };

  private handleOffline = (): void => {
    this.syncStatus.isOnline = false;
  };

  private async connectWebSocket(): Promise<void> {
    if (!this.config.serverUrl || !this.syncStatus.isOnline) return;

    const wsUrl = this.config.serverUrl.replace(/^http/, "ws") + "/realtime";

    try {
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        this.backoffDelay = 1000; // Réinitialiser le délai en cas de succès
        if (this.websocket) {
          this.websocket.send(
            JSON.stringify({
              type: "auth",
              clientId: this.config.clientId,
              apiKey: this.config.apiKey,
            })
          );
        }
      };

      this.websocket.onmessage = this.handleWebSocketMessage.bind(this);
      this.websocket.onclose = this.handleWebSocketClose.bind(this);
      this.websocket.onerror = this.handleWebSocketError.bind(this);
    } catch (error) {
      console.error("Erreur lors de la connexion WebSocket:", error);
      this.scheduleReconnection();
    }
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as RealtimeEvent;
      this.handleRealtimeEvent(data);
    } catch (error) {
      console.error("Erreur lors du traitement du message WebSocket:", error);
    }
  }

  private handleWebSocketClose(): void {
    console.log("WebSocket déconnecté");
    this.scheduleReconnection();
  }

  private async handleRealtimeEvent(event: RealtimeEvent): Promise<void> {
    // Ignorer les événements provenant de ce client
    if (event.clientId === this.config.clientId) {
      return;
    }

    try {
      switch (event.type) {
        case "CREATE":
        case "UPDATE":
          await this.orm.run(`UPDATE ${event.table} SET ? WHERE id = ?`, [
            event.record,
            event.record.id,
          ]);
          break;
        case "DELETE":
          await this.orm.run(`DELETE FROM ${event.table} WHERE id = ?`, [
            event.record.id,
          ]);
          break;
      }
    } catch (error) {
      console.error(
        "Erreur lors du traitement de l'événement temps réel:",
        error
      );
      this.syncStatus.errors.push(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    }
  }

  private startPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      this.processPendingOperations();
    }, this.config.syncInterval || 30000); // Par défaut toutes les 30 secondes
  }

  private handleWebSocketError(error: Event): void {
    console.error("Erreur WebSocket:", error);
    this.scheduleReconnection();
  }

  private scheduleReconnection(): void {
    setTimeout(() => {
      this.connectWebSocket();
      this.backoffDelay = Math.min(this.backoffDelay * 2, 60000); // Max 1 minute
    }, this.backoffDelay);
  }

  public async addOperation(
    operation: Omit<SyncOperation, "id" | "timestamp" | "version">
  ): Promise<void> {
    const syncOp: SyncOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      version: await this.getNextVersion(
        operation.tableName,
        operation.recordId
      ),
      synced: false,
    };

    await this.syncQueue.enqueue(syncOp);
  }

  private async getNextVersion(
    tableName: string,
    recordId: string | number
  ): Promise<number> {
    const result = await this.orm.get(
      "SELECT MAX(version) as currentVersion FROM _sync_operations WHERE table_name = ? AND record_id = ?",
      [tableName, recordId]
    );
    return (result?.currentVersion || 0) + 1;
  }

  private async processPendingOperations(): Promise<void> {
    if (!this.syncStatus.isOnline || this.syncStatus.isSyncing) {
      return;
    }

    this.syncStatus.isSyncing = true;

    try {
      const operations = await this.syncQueue.getQueue();
      for (const operation of operations) {
        await this.syncOperation(operation);
      }
    } catch (error) {
      console.error(
        "Erreur lors du traitement des opérations en attente:",
        error
      );
      this.syncStatus.errors.push(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  private async syncOperation(operation: SyncOperation): Promise<void> {
    try {
      // Gérer l'opération localement d'abord
      switch (operation.operation) {
        case "CREATE": {
          const result = await handleInsertOperation(
            this.orm,
            operation.tableName,
            operation.data
          );
          operation.recordId = result.id;
          break;
        }
        case "UPDATE": {
          await handleUpdateOperation(
            this.orm,
            operation.tableName,
            operation.recordId,
            operation.data
          );
          break;
        }
        case "DELETE": {
          await handleDeleteOperation(
            this.orm,
            operation.tableName,
            operation.recordId
          );
          break;
        }
      }

      // Envoyer au serveur
      const response = await fetch(`${this.config.serverUrl}/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(operation),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Marquer l'opération comme synchronisée
      await this.orm.run(
        "UPDATE _sync_operations SET synced = 1 WHERE id = ?",
        [operation.id]
      );
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      throw error;
    }
  }

  public destroy(): void {
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
