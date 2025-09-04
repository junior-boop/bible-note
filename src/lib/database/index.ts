// @ts-ignore
import { ModelFactory, SimpleORM } from "../simpleorm";
import {
  type Session as SessionType,
  type Notes as NotesType,
  type Groups as GroupeType,
  type User as UserType,
} from "./db";
import { v4 as uuidv4 } from "uuid";
// import Database from "better-sqlite3";

const orm = new SimpleORM("./notes.sqlite");
const db = new ModelFactory(orm);

// Create the notes table if it doesn't exist

const Notes = db.createModel<NotesType>("notes", {
  id: "TEXT PRIMARY KEY",
  body: "TEXT",
  creator: "TEXT",
  pinned: "INTEGER",
  archived: "INTEGER",
  grouped: "TEXT NULL",
  created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
});

const createNotesTable = async () => {
  await Notes.createTable();
};

export async function getNoteById(id: string) {
  try {
    const result = await Notes.findById(id);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getNotes() {
  const result = await Notes.orderBy("modified", "DESC");
}

export async function setNote(noteData: NotesType) {
  try {
    const result = await Notes.upsert({
      id: uuidv4(),
      body: noteData.body,
      grouped: noteData.grouped,
      creator: noteData.creator,
      archived: noteData.archived,
      pinned: noteData.pinned,
    });
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function deleteNote(id: string) {
  try {
    const result = await Notes.delete(id);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Create the group table if it doesn't exist

const Groupe = db.createModel<GroupeType>("groups", {
  id: "TEXT PRIMARY KEY NO NULL",
  name: "TEXT NO NULL",
  created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  modified: "DATETIME DEFAULT CURRENT_TIMESTAMP",
});

const createGroupTable = async () => {
  await Groupe.createTable();
};

// Create the group table if it doesn't exist
const Users = db.createModel<UserType>("users", {
  id: "TEXT PRIMARY KEY NO NULL",
  name: "TEXT NO NULL",
  email: "TEXT NO NULL UNIQUE",
  lastlogin: "TEXT",
  lastlogout: "TEXT",
  created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
});
const createUserTable = async () => {
  await Users.createTable();
};

const Session = db.createModel<SessionType>("session", {
  id: "TEXT PRIMARY KEY NO NULL",
  iduser: "TEXT NO NULL",
  name: "TEXT NULL",
  email: "TEXT NULL",
});

const createSessionTable = async () => {
  await Session.createTable();
};

export async function getSession(): Promise<SessionType | null> {
  try {
    const session = await Session.findById("sessionuser-01");
    return session;
  } catch (e) {
    return null;
  }
}

export async function setSession(data: UserType): Promise<SessionType | null> {
  try {
    const session = await Session.upsert({
      id: "sessionuser-01",
      iduser: data.id,
      email: data.email,
      name: data.name,
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function deleteSession(id: string): Promise<Boolean | null> {
  try {
    const session = await Session.delete(id);
    return session;
  } catch (e) {
    return null;
  }
}

export {
  createNotesTable,
  createGroupTable,
  createUserTable,
  createSessionTable,
};
export default db;

// Exemple d'utilisation avec export des clés et types
/*
// models.ts
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  created_at?: Date;
}

interface Session {
  id: string;
  iduser: number;
  name: string;
  email: string;
}

// setup.ts
import { SimpleORM, ModelFactory } from './SimpleORM';

const orm = new SimpleORM('./database.db');
const factory = new ModelFactory(orm);

// Créer le modèle User avec schéma
export const UserModel = factory.createModel<User>('users', {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE NOT NULL',
  isActive: 'BOOLEAN DEFAULT 1',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
});

// Créer le modèle Session avec données d'exemple
const sampleSession: Session = {
  id: 'session-example',
  iduser: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

export const SessionModel = factory.createModel<Session>('session', {
  id: 'TEXT PRIMARY KEY',
  iduser: 'INTEGER',
  name: 'TEXT',
  email: 'TEXT'
}, sampleSession);

// Maintenant vous pouvez accéder aux métadonnées :
console.log('User keys:', UserModel.keys);
// => { id: 'id', name: 'name', email: 'email', isActive: 'isActive', created_at: 'created_at' }

console.log('User types:', UserModel.types);
// => { id: 'number', name: 'string', email: 'string', isActive: 'boolean', created_at: 'date' }

console.log('Table name:', UserModel.tableName);
// => 'users'

// Usage typé complet
async function example() {
  // Les clés sont disponibles comme constantes typées
  const userNameKey = UserModel.keys.name; // Type: 'name'
  const userEmailType = UserModel.types.email; // Type: 'string'

  // Utilisation normale avec IntelliSense
  const user = await UserModel.create({
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true
  });

  // Les métadonnées peuvent être utilisées pour la validation, formulaires, etc.
  Object.keys(UserModel.keys).forEach(key => {
    console.log(`Column ${key} is of type ${UserModel.types[key]}`);
  });
}
*/
