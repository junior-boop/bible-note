import { Events, Schema } from "@livestore/livestore";

export const createdNote = Events.synced({
  name: "v1.CreatedNote",
  schema: Schema.Struct({
    id: Schema.String,
    body: Schema.String,
    creator: Schema.String,
    pinted: Schema.Boolean,
    archived: Schema.Boolean,
    grouped: Schema.String,
    created: Schema.DateFromNumber,
    modified: Schema.DateFromNumber,
  }),
});

export const deletedNote = Events.synced({
  name: "v1.DeletedNote",
  schema: Schema.Struct({
    id: Schema.String,
    deleted: Schema.DateFromNumber,
  }),
});

export const modifiedNote = Events.synced({
  name: "v1.ModifiedNote",
  schema: Schema.Struct({
    id: Schema.String,
    body: Schema.String,
    modified: Schema.DateFromNumber,
  }),
});

export const archivedNote = Events.synced({
  name: "v1.ArchivedNote",
  schema: Schema.Struct({
    id: Schema.String,
    archived: Schema.Boolean,
  }),
});

export const groupedLink = Events.synced({
  name: "v1.GroupeLink",
  schema: Schema.Struct({
    id: Schema.String,
    grouped: Schema.String,
  }),
});

export const pintingNote = Events.synced({
  name: "v1.pintingNote",
  schema: Schema.Struct({
    id: Schema.String,
    pinted: Schema.Boolean,
  }),
});
