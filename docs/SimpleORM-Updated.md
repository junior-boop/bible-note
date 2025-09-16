# Documentation SimpleORM

SimpleORM est un ORM (Object-Relational Mapping) léger et puissant pour TypeScript et SQLite, avec des fonctionnalités de synchronisation intégrées.

## Table des matières

1. [Installation](#installation)
2. [Configuration de base](#configuration-de-base)
3. [Les modèles](#les-modèles)
4. [Opérations CRUD](#opérations-crud)
5. [Requêtes avancées](#requêtes-avancées)
6. [Synchronisation](#synchronisation)
7. [Transactions](#transactions)
8. [Utilitaires](#utilitaires)

## Installation

```bash
npm install better-sqlite3 @types/better-sqlite3
```

## Configuration de base

### Initialisation de l'ORM

```typescript
import { SimpleORM } from './simpleorm-sync';

const orm = new SimpleORM('database.sqlite');
```

### Création d'un modèle

```typescript
// Définition du type
interface User {
  id?: number;
  name: string;
  email: string;
  age?: number;
  isActive: boolean;
  createdAt: Date;
}

// Définition du schéma
const userSchema = {
  id: "INTEGER PRIMARY KEY AUTOINCREMENT",
  name: "TEXT NOT NULL",
  email: "TEXT UNIQUE",
  age: "INTEGER",
  isActive: "INTEGER DEFAULT 1",
  createdAt: "TEXT"
};

// Création du modèle
const UserModel = orm.createModel<User>('users', userSchema);
```

## Les modèles

### Création d'une table

```typescript
// Création automatique de la table
await UserModel.createTable();

// Ou manuellement via l'ORM
orm.createTable('users', userSchema);
```

### Factory de modèles

La classe ModelFactory permet de créer des modèles avec un typage fort :

```typescript
const factory = new ModelFactory(orm);
const UserModel = factory.createModel<User>('users', userSchema);
```

## Opérations CRUD

### Création

```typescript
// Création d'un enregistrement
const user = await UserModel.create({
  name: "Jean Dupont",
  email: "jean@example.com",
  age: 30,
  isActive: true,
  createdAt: new Date()
});

// Création multiple
const users = await UserModel.bulkCreate([
  { name: "User 1", email: "user1@example.com" },
  { name: "User 2", email: "user2@example.com" }
]);
```

### Lecture

```typescript
// Récupération par ID
const user = await UserModel.findById(1);

// Recherche avec conditions
const users = await UserModel.findAll({
  where: { isActive: true, age: { $gt: 18 } },
  orderBy: { column: 'name', direction: 'ASC' },
  limit: 10
});

// Recherche unique
const admin = await UserModel.findOne({
  where: { role: 'admin' }
});
```

### Mise à jour

```typescript
// Mise à jour d'un enregistrement
const updated = await UserModel.update(1, {
  name: "Nouveau nom"
});

// Mise à jour multiple
const updates = await UserModel.bulkUpdate([
  { id: 1, isActive: false },
  { id: 2, isActive: false }
]);
```

### Suppression

```typescript
// Suppression par ID
const deleted = await UserModel.delete(1);
```

## Requêtes avancées

### Query Builder

```typescript
// Chaînage de méthodes
const users = await UserModel
  .where({ age: { $gt: 18 } })
  .orderBy('name', 'ASC')
  .limit(10)
  .offset(20)
  .findAll();
```

### Relations et jointures

```typescript
const posts = await PostModel.findAll({
  include: {
    model: 'users',
    foreignKey: 'userId',
    as: 'author'
  }
});
```

## Transactions

```typescript
// Transaction simple
await orm.transaction(async () => {
  const user = await UserModel.create({ name: "Jean" });
  const profile = await ProfileModel.create({ userId: user.id });
});
```

## Synchronisation

### Configuration

```typescript
orm.enableSync({
  serverUrl: 'https://api.example.com',
  clientId: 'client-unique-id',
  enableRealtime: true,
  syncInterval: 30000, // 30 secondes
  retryAttempts: 3,
  conflictResolution: 'server'
});
```

### Modes de résolution des conflits

- `'server'`: Priorité aux données du serveur
- `'client'`: Priorité aux modifications locales
- `'latest'`: Version la plus récente
- `'custom'`: Logique personnalisée

```typescript
orm.enableSync({
  conflictResolution: 'custom',
  customConflictResolver: (local, remote) => {
    return local.version > remote.version ? local : remote;
  }
});
```

## Gestion des erreurs

### Types d'erreurs

```typescript
try {
  const user = await orm.findById('users', 999);
} catch (error) {
  if (error instanceof DatabaseError) {
    switch (error.code) {
      case ErrorCodes.TABLE_NOT_FOUND:
        console.error('Table inexistante');
        break;
      case ErrorCodes.CONSTRAINT_VIOLATION:
        console.error('Violation de contrainte');
        break;
      case ErrorCodes.COLUMN_NOT_FOUND:
        console.error('Colonne inexistante');
        break;
      case ErrorCodes.INVALID_QUERY:
        console.error('Requête invalide');
        break;
    }
  } else if (error instanceof SyncError) {
    console.error('Erreur de synchronisation');
  } else if (error instanceof ValidationError) {
    console.error('Erreur de validation');
  }
}
```

## Utilitaires

### Sauvegarde

```typescript
await orm.backup('backup.sqlite');
```

### Pragmas SQLite

```typescript
// Configuration
orm.pragma('journal_mode', 'WAL');
orm.pragma('foreign_keys', 1);

// Lecture
const journalMode = orm.pragma('journal_mode');
```

### Cycle de vie

```typescript
// Fermeture propre
orm.close();

// Vérification de l'état
if (orm.isOpen) {
  // La connexion est active
}

// Nom de la base
console.log(orm.name);
```

## Utilitaires

### Gestion des connexions

```typescript
// Fermeture propre
orm.close();

// Vérification de l'état
if (orm.isOpen) {
  console.log("Connexion active");
}
```

### Configuration SQLite

```typescript
// Pragmas
orm.pragma('journal_mode', 'WAL');
orm.pragma('foreign_keys', 1);
```

### Sauvegarde

```typescript
// Sauvegarde de la base
await orm.backup('backup.sqlite');
```

## Bonnes pratiques

1. **Transactions**: Utilisez les transactions pour les opérations multiples
2. **Types**: Définissez toujours des interfaces TypeScript pour vos modèles
3. **Indexation**: Créez des index pour les colonnes fréquemment utilisées
4. **Optimisation**: Utilisez `findOne()` au lieu de `findAll().shift()`
5. **Batch**: Préférez `bulkCreate` et `bulkUpdate` pour les opérations en masse

## Gestion des erreurs

```typescript
try {
  await UserModel.findById(999);
} catch (error) {
  if (error instanceof DatabaseError) {
    console.error('Erreur de base de données:', error.message);
  } else if (error instanceof SyncError) {
    console.error('Erreur de synchronisation:', error.message);
  }
}
```

## Notes de performance

1. Limitez les résultats avec `limit` pour les grandes tables
2. Utilisez les index judicieusement
3. Évitez les requêtes imbriquées inutiles
4. Privilégiez les transactions pour les opérations groupées
5. Utilisez la synchronisation en temps réel avec parcimonie