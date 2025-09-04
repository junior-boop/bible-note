import {
  ArchivedNote,
  ModifiedNote,
  Notes,
  PinningNote,
  GroupedLink,
  User,
} from "./db";
import db from "./index";
import { v4 as uuidv4 } from "uuid";
import { ModelFactory, SimpleORM } from "../simpleorm";

export function checkDatabase(callback: (T: any) => string) {
  db.serialize(() => {
    const stml = db.prepare("SELECT 1+1 AS result");
    stml.get((err, row) => {
      if (err) throw new Error(JSON.stringify(err));
      callback(row);
    });
  });
}

export function getNoteById(id: string, callback: (T: any) => Notes) {
  const stmt = db.prepare("SELECT * FROM notes WHERE id = ?");
  stmt.get(id, (err, row) => {
    if (err) return null;
    callback(row);
  });
}

export function setNote(noteData: Notes, callback: (T: any) => Notes) {
  db.serialize(() => {
    const sql = `
    INSERT OR REPLACE INTO notes (id, body, creator, pinned, archived, grouped, created, modified) 
     VALUES (COALESCE((SELECT id FROM notes WHERE id = ?), ?), ?, ?, ?, ?, ?, ?, ?)
  `;
    const id = uuidv4();
    const obj = [
      id,
      id,
      noteData.body.trim(),
      noteData.creator.trim(),
      noteData.pinned,
      noteData.archived,
      noteData.grouped ? noteData.grouped : null,
      new Date().toISOString(),
      new Date().toISOString(),
    ];

    const stml = db.prepare(sql);
    stml.run(obj);
    stml.finalize();

    getNoteById(id, callback);
  });
}

export function deleteNote(id: string) {
  const stmt = db.prepare("DELETE FROM notes WHERE id = ?");
  stmt.run(id);
  console.log(`Note with ID ${id} deleted.`);
}

/**
 * Updates the body and modified timestamp of a note.
 * @param {object} data
 */
export function modifyNote(data: ModifiedNote, callback: (T: any) => Notes) {
  db.serialize(() => {
    const stmt = db.prepare(
      "UPDATE notes SET body = ?, modified = ? WHERE id = ?"
    );
    const obj = [data.body, new Date().toISOString(), data.id];
    stmt.run(obj);
    stmt.finalize();

    getNoteById(data.id, callback);
  });
}

/**
 * Toggles the archived status of a note.
 * @param {object} data
 */
export function archiveNote(data: ArchivedNote) {
  const stmt = db.prepare(
    "UPDATE notes SET archived = ?, modified = ? WHERE id = ?"
  );
  stmt.run(data.archived ? 1 : 0, new Date().toISOString(), data.id);
  console.log(
    `Note with ID ${data.id} archived status set to ${data.archived}.`
  );
}

export function groupNote(data: GroupedLink) {
  const stmt = db.prepare(
    "UPDATE notes SET grouped = ?, modified = ? WHERE id = ?"
  );
  stmt.run(data.grouped, new Date().toISOString(), data.id);
  console.log(`Note with ID ${data.id} grouped with ID ${data.grouped}.`);
}

export function pinNote(data: PinningNote) {
  const stmt = db.prepare(
    "UPDATE notes SET pinned = ?, modified = ? WHERE id = ?"
  );
  stmt.run(data.pinned ? 1 : 0, new Date().toISOString(), data.id);
  console.log(`Note with ID ${data.id} pinned status set to ${data.pinned}.`);
}

/* 

    USER

*/
export function getUser(id: string, callback: (T: any) => string) {
  db.serialize(() => {
    const stml = db.prepare("SELECT * FROM users WHERE id=?");
    stml.get(id, (err, row) => {
      if (err) return null;
      callback(row);
    });
  });
}

export function getAllUser(callback: (T: any) => string) {
  db.serialize(() => {
    const stml = db.prepare("SELECT * FROM users ORDER BY modified DESC");
    stml.all((err, data) => {
      if (err) return null;
      callback(data);
    });
  });
}

export function setUser(data: User, callback: (T: any) => string) {
  db.serialize(() => {
    const sql =
      "INSERT INTO users (id, name, email, created, modified, lastlogin, lastlogout) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const obj = [
      data.id,
      data.name,
      data.email,
      data.created,
      data.modified,
      data.lastlogin,
      data.lastlogout,
    ];

    const stml = db.prepare(sql);
    stml.run(obj);
    stml.finalize();

    getUser(data.id, callback);
  });
}

/*

    SESSIONS

*/
export function getSession(callback: (T: any) => string) {
  db.serialize(() => {
    const stml = db.prepare("SELECT * FROM session");
    stml.all((err, data) => {
      if (err) {
        return null;
      }
      callback(data);
    });
  });
}

export function setSession(data: User, callback: (T: any) => string) {
  db.serialize(() => {
    const sql = `
      INSERT OR REPLACE INTO session (id, iduser, name, email) 
      VALUES (COALESCE((SELECT id FROM session WHERE id = ?), ?), ?, ?, ?)
    `;

    const obj = [
      "sessionuser-01",
      "sessionuser-01",
      data.id,
      data.name,
      data.email,
    ];

    const stml = db.prepare(sql);
    stml.run(obj);
    stml.finalize();

    getSession(callback);
  });
}

export function deletedSession(callback: (T: any) => string) {
  db.serialize(() => {
    const stmt = db.prepare("DELETE FROM session WHERE id=?");
    stmt.run("sessionuser-01");
    stmt.finalize();
    getSession(callback);
  });
}

// INSERT OR REPLACE INTO notes (id,note) VALUES ((SELECT id FROM notes WHERE id = ?),?)

/* 

    groupe

*/

const orm = new SimpleORM("./notes.sqlite");
const db_teste = new ModelFactory(orm);

const Groupe = db_teste.createModel("groupe", {
  id: "TEXT PRIMARY KEY",
  name: "TEXT UNIQUE",
  created: "TEXT",
});

async function createdGroupe() {
  await Groupe.createTable();
}

export { createdGroupe, Groupe };

// Exemple d'utilisation :
/*
const { SimpleORM, ModelFactory } = require('./SimpleORM');

// Initialiser l'ORM
const orm = new SimpleORM('./database.db');
const factory = new ModelFactory(orm);

// Créer des modèles
const User = factory.createModel('users', {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE NOT NULL',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
});

const Session = factory.createModel('session', {
  id: 'TEXT PRIMARY KEY',
  iduser: 'INTEGER',
  name: 'TEXT',
  email: 'TEXT'
});

// Utilisation
async function example() {
  // Créer les tables
  await User.createTable();
  await Session.createTable();
  
  // Créer un utilisateur
  const user = await User.create({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // Trouver tous les utilisateurs
  const users = await User.findAll();
  
  // Trouver un utilisateur par ID
  const foundUser = await User.findById(1);
  
  // Mettre à jour un utilisateur
  const updatedUser = await User.update(1, { name: 'Jane Doe' });
  
  // Upsert pour la session (comme votre exemple)
  const session = await Session.upsert({
    id: 'sessionuser-01',
    iduser: user.id,
    name: user.name,
    email: user.email
  });
  
  // Supprimer un utilisateur
  await User.delete(1);
  
  // Fermer la connexion
  await orm.close();
}
*/
