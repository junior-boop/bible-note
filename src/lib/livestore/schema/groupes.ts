import { State, Schema } from "@livestore/livestore";

export const groupes = State.SQLite.table({
  name: "groupes",
  columns: {
    id: State.SQLite.text({ primaryKey: true }),
    name: State.SQLite.text({ default: "" }),
    created: State.SQLite.integer({ schema: Schema.DateFromNumber }),
    modified: State.SQLite.integer({ schema: Schema.DateFromNumber }),
  },
  indexes: [{ name: "grouped_link", columns: ["grouped"] }],
  deriveEvents: true,
});

export type Groupes = typeof groupes.Type;
