// @ts-ignore
import { ModelFactory, SimpleORM } from "../simpleorm";
import {
  type Session as SessionType,
  type Notes as NotesType,
  type Groups as GroupeType,
  type User as UserType,
} from "./db";
import { v4 as uuidv4 } from "uuid";
import Database from "better-sqlite3";

export function checkDatabase() {
  const db = new Database("./notes.sqlite");
  const stml = db.prepare("SELECT 1+1 AS result");
  const result = stml.run();
  return result;
}

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

export async function getAllNotes() {
  const result = await Notes.orderBy("modified", "DESC")
    .where({ pinned: 0 })
    .where({ archived: 0 })
    .findAll();
  return result;
}

export function getNotesArchived() {
  try {
    const result = Notes.where({ archived: 1 })
      .orderBy("modified", "DESC")
      .findAll();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function setNotesArchived(data: NotesType) {
  console.log(data);
  return Notes.update(data.id as string, {
    archived: data.archived ? 1 : 0,
    modified: new Date(),
  });
}

export function getNotesPinned() {
  const result = Notes.where({ pinned: 1 })
    .orderBy("modified", "DESC")
    .findAll();
  return result;
}

export function setNotePinned(data: NotesType) {
  return Notes.update(data.id as string, {
    pinned: data.pinned ? 1 : 0,
    modified: new Date(),
  });
}

export function createNote(data: NotesType) {
  try {
    const result = Notes.upsert({
      id: uuidv4(),
      body: data.body,
      grouped: data.grouped,
      creator: data.creator,
      archived: data.archived,
      pinned: data.pinned,
      created: new Date(),
      modified: new Date(),
    });
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function setNote(noteData: NotesType) {
  try {
    const result = Notes.upsert({
      id: uuidv4(),
      body: noteData.body,
      grouped: noteData.grouped,
      creator: noteData.creator,
      archived: noteData.archived,
      pinned: noteData.pinned,
      created: new Date(),
      modified: new Date(),
    });
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateNote(data: NotesType) {
  try {
    // const result = Notes.findById(data.id as string);
    const result = Notes.update(data.id as string, {
      body: data.body,
      modified: new Date(),
    });
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function deleteNote(id: string) {
  try {
    const result = Notes.delete(id);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Create the group table if it doesn't exist

const Groupe = db.createModel<GroupeType>("groups", {
  id: "TEXT PRIMARY KEY NOT NULL",
  name: "TEXT NOT NULL",
  created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  modified: "DATETIME DEFAULT CURRENT_TIMESTAMP",
});

const createGroupTable = async () => {
  await Groupe.createTable();
};

// Create the group table if it doesn't exist
const Users = db.createModel<UserType>("users", {
  id: "TEXT PRIMARY KEY NOT NULL",
  name: "TEXT NOT NULL",
  email: "TEXT NOT NULL UNIQUE",
  lastlogin: "TEXT",
  lastlogout: "TEXT",
  created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
});
const createUserTable = async () => {
  await Users.createTable();
};

export function setUser(user: UserType): UserType | null {
  try {
    const check = Users.findOne({ where: { email: user.email } });

    if (check) {
      return check;
    }
    const result = Users.create({
      id: user.id,
      name: user.name,
      email: user.email,
      lastlogin: user.lastlogin,
      lastlogout: user.lastlogout,
    });
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllUser() {
  try {
    const result = await Users.orderBy("modified", "DESC").findAll();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUser(id: string): Promise<UserType | null> {
  try {
    const result = await Users.findById(id);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateUser(user: UserType): Promise<UserType | null> {
  try {
    const result = await Users.update(user.id, user);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function deleteUser(id: string): Promise<boolean | null> {
  try {
    const result = await Users.delete(id);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

const Session = db.createModel<SessionType>("session", {
  id: "TEXT PRIMARY KEY NOT NULL",
  iduser: "TEXT NOT NULL",
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

export function setSession(data: UserType): SessionType | null {
  const session = Session.upsertWithCoalesce({
    id: "sessionuser-01",
    iduser: data.id,
    email: data.email,
    name: data.name,
  });

  return session;
}

export function deleteSession(id: string): Boolean | null {
  const session = Session.delete(id);
  return session;
}

export {
  createNotesTable,
  createGroupTable,
  createUserTable,
  createSessionTable,
};

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
