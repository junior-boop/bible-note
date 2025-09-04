// types.ts
export interface QueryResult {
  lastID?: number;
  changes: number;
}

export interface DatabaseRow {
  [key: string]: any;
}

export interface WhereConditions {
  [key: string]: any;
}

export interface TableSchema {
  [columnName: string]: string;
}

// SimpleORM.ts
import { Database } from "sqlite3";

export class SimpleORM {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  // Méthode pour exécuter des requêtes SQL brutes
  query<T = DatabaseRow>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows: T[]) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // Méthode pour exécuter des requêtes qui ne retournent pas de données
  run(sql: string, params: any[] = []): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  // Fermer la connexion
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Model.ts
export abstract class Model {
  protected tableName: string;
  protected orm: SimpleORM;

  constructor(tableName: string, orm: SimpleORM) {
    this.tableName = tableName;
    this.orm = orm;
  }

  // Créer la table
  static async createTable(
    tableName: string,
    columns: TableSchema,
    orm: SimpleORM
  ): Promise<QueryResult> {
    const columnDefs = Object.entries(columns)
      .map(([name, type]) => `${name} ${type}`)
      .join(", ");

    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`;
    return orm.run(sql);
  }

  // Insérer un nouvel enregistrement
  static async create<T extends DatabaseRow>(
    tableName: string,
    data: Partial<T>,
    orm: SimpleORM
  ): Promise<T> {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const values = Object.values(data);

    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const result = await orm.run(sql, values);

    return { id: result.lastID, ...data } as T;
  }

  // Trouver tous les enregistrements
  static async findAll<T extends DatabaseRow>(
    tableName: string,
    orm: SimpleORM,
    conditions: WhereConditions = {}
  ): Promise<T[]> {
    let sql = `SELECT * FROM ${tableName}`;
    let params: any[] = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      sql += ` WHERE ${whereClause}`;
      params = Object.values(conditions);
    }

    return await orm.query<T>(sql, params);
  }

  // Trouver un enregistrement par ID
  static async findById<T extends DatabaseRow>(
    tableName: string,
    id: string | number,
    orm: SimpleORM
  ): Promise<T | null> {
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    const rows = await orm.query<T>(sql, [id]);
    return rows[0] || null;
  }

  // Trouver un seul enregistrement
  static async findOne<T extends DatabaseRow>(
    tableName: string,
    conditions: WhereConditions,
    orm: SimpleORM
  ): Promise<T | null> {
    const whereClause = Object.keys(conditions)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const sql = `SELECT * FROM ${tableName} WHERE ${whereClause} LIMIT 1`;
    const params = Object.values(conditions);

    const rows = await orm.query<T>(sql, params);
    return rows[0] || null;
  }

  // Mettre à jour un enregistrement
  static async update<T extends DatabaseRow>(
    tableName: string,
    id: string | number,
    data: Partial<T>,
    orm: SimpleORM
  ): Promise<T | null> {
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    const params = [...Object.values(data), id];

    await orm.run(sql, params);
    return await this.findById<T>(tableName, id, orm);
  }

  // Supprimer un enregistrement
  static async delete(
    tableName: string,
    id: string | number,
    orm: SimpleORM
  ): Promise<boolean> {
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    const result = await orm.run(sql, [id]);
    return result.changes > 0;
  }

  // Supprimer avec conditions
  static async deleteWhere(
    tableName: string,
    conditions: WhereConditions,
    orm: SimpleORM
  ): Promise<number> {
    const whereClause = Object.keys(conditions)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const params = Object.values(conditions);

    const result = await orm.run(sql, params);
    return result.changes;
  }

  // INSERT OR REPLACE
  static async upsert<T extends DatabaseRow>(
    tableName: string,
    data: Partial<T>,
    orm: SimpleORM
  ): Promise<T> {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const values = Object.values(data);

    const sql = `INSERT OR REPLACE INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const result = await orm.run(sql, values);

    return { id: result.lastID || (data as any).id, ...data } as T;
  }
}

// ModelFactory.ts
export interface ModelClass<T extends DatabaseRow> {
  new (data?: Partial<T>): ModelInstance<T>;
  createTable(): Promise<QueryResult>;
  create(data: Partial<T>): Promise<T>;
  findAll(conditions?: WhereConditions): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  findOne(conditions: WhereConditions): Promise<T | null>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
  deleteWhere(conditions: WhereConditions): Promise<number>;
  upsert(data: Partial<T>): Promise<T>;
  orm: SimpleORM;
}

export interface ModelInstance<T extends DatabaseRow> extends Partial<T> {
  save(): Promise<T>;
  delete(): Promise<boolean>;
}

export class ModelFactory {
  private orm: SimpleORM;

  constructor(orm: SimpleORM) {
    this.orm = orm;
  }

  createModel<T extends DatabaseRow>(
    tableName: string,
    schema: TableSchema = {}
  ): ModelClass<T> {
    const orm = this.orm;

    class GeneratedModel implements ModelInstance<T> {
      [key: string]: any;

      constructor(data: Partial<T> = {}) {
        Object.assign(this, data);
      }

      // Méthodes d'instance
      async save(): Promise<T> {
        if (this.id) {
          const result = await Model.update<T>(
            tableName,
            this.id,
            this as Partial<T>,
            orm
          );
          return result!;
        } else {
          const result = await Model.create<T>(
            tableName,
            this as Partial<T>,
            orm
          );
          this.id = result.id;
          return result;
        }
      }

      async delete(): Promise<boolean> {
        if (this.id) {
          return await Model.delete(tableName, this.id, orm);
        }
        return false;
      }

      // Méthodes statiques
      static async createTable(): Promise<QueryResult> {
        return await Model.createTable(tableName, schema, orm);
      }

      static async create(data: Partial<T>): Promise<T> {
        return await Model.create<T>(tableName, data, orm);
      }

      static async findAll(conditions: WhereConditions = {}): Promise<T[]> {
        return await Model.findAll<T>(tableName, orm, conditions);
      }

      static async findById(id: string | number): Promise<T | null> {
        return await Model.findById<T>(tableName, id, orm);
      }

      static async findOne(conditions: WhereConditions): Promise<T | null> {
        return await Model.findOne<T>(tableName, conditions, orm);
      }

      static async update(
        id: string | number,
        data: Partial<T>
      ): Promise<T | null> {
        return await Model.update<T>(tableName, id, data, orm);
      }

      static async delete(id: string | number): Promise<boolean> {
        return await Model.delete(tableName, id, orm);
      }

      static async deleteWhere(conditions: WhereConditions): Promise<number> {
        return await Model.deleteWhere(tableName, conditions, orm);
      }

      static async upsert(data: Partial<T>): Promise<T> {
        return await Model.upsert<T>(tableName, data, orm);
      }

      static orm = orm;
    }

    return GeneratedModel as any;
  }
}

// Export all
export { SimpleORM, Model };

// usage.ts
/*
import { SimpleORM, ModelFactory } from './SimpleORM';
import { User } from './models/User';
import { Session } from './models/Session';

// Initialiser l'ORM
const orm = new SimpleORM('./database.db');
const factory = new ModelFactory(orm);

// Créer des modèles typés
const UserModel = factory.createModel<User>('users', {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE NOT NULL',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
});

const SessionModel = factory.createModel<Session>('session', {
  id: 'TEXT PRIMARY KEY',
  iduser: 'INTEGER',
  name: 'TEXT',
  email: 'TEXT'
});

// Utilisation avec intellisense complet
async function example() {
  // Créer les tables
  await UserModel.createTable();
  await SessionModel.createTable();
  
  // Créer un utilisateur (typé)
  const user: User = await UserModel.create({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // TypeScript vérifie les types
  const users: User[] = await UserModel.findAll();
  const foundUser: User | null = await UserModel.findById(1);
  
  // Upsert pour la session avec autocomplétion
  const session: Session = await SessionModel.upsert({
    id: 'sessionuser-01',
    iduser: user.id,
    name: user.name,
    email: user.email
  });
  
  // Fermer la connexion
  await orm.close();
}

// Vos fonctions avec typage
export async function setSession(data: User): Promise<Session | null> {
  try {
    await SessionModel.createTable();
    
    const session = await SessionModel.upsert({
      id: 'sessionuser-01',
      iduser: data.id,
      name: data.name,
      email: data.email
    });
    
    return session;
  } catch (error) {
    console.error('Erreur setSession:', error);
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    return await SessionModel.findById('sessionuser-01');
  } catch (error) {
    console.error('Erreur getSession:', error);
    return null;
  }
}
*/

declare namespace global {
  (SimpleORM, Model);
}
