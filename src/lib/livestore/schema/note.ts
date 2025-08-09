import { State, Schema } from "@livestore/livestore";

export const notes = State.SQLite.table({
  name: "notes",
  columns: {
    id: State.SQLite.text({ primaryKey: true }),
    body: State.SQLite.text({ default: "" }),
    pinted: State.SQLite.boolean({ default: false }),
    creator: State.SQLite.text({ default: "" }),
    archived: State.SQLite.boolean({ default: false }),
    grouped: State.SQLite.text({ nullable: true }),
    created: State.SQLite.integer({ schema: Schema.DateFromNumber }),
    deleted: State.SQLite.integer({
      nullable: true,
      schema: Schema.DateFromNumber,
    }),
    modified: State.SQLite.integer({ schema: Schema.DateFromNumber }),
  },
  indexes: [
    { name: "note_created", columns: ["created"] },
    { name: "grouped_link", columns: ["grouped"] },
  ],
  deriveEvents: true,
});

export type Notes = typeof notes.Type;
