import { makeSchema, State } from "@livestore/livestore";

import * as EventsNote from "../events";
import { type Notes, notes } from "./note";
import { groupes, type Groupes } from "./groupes";

export { notes, groupes, type Notes, type Groupes };

export const events = {
  ...EventsNote,
};

export const tables = { notes, groupes };

const materializers = State.SQLite.materializers(events, {
  "v1.CreatedNote": (data) =>
    tables.notes.insert({
      id: data.id,
      body: data.body,
      created: data.created,
      archived: data.archived,
      creator: data.creator,
      modified: data.modified,
      grouped: data.grouped,
    }),
  "v1.DeletedNote": (data) => tables.notes.delete().where({ id: data.id }),
  "v1.ModifiedNote": (data) =>
    tables.notes
      .update({
        body: data.body,
        modified: data.modified,
      })
      .where({
        id: data.id,
      }),
  "v1.ArchivedNote": ({ id, archived }) =>
    tables.notes.update({ archived: archived }).where({ id }),
  "v1.GroupeLink": ({ id, grouped }) =>
    tables.notes.update({ grouped }).where({ id }),
  "v1.pintingNote": ({ id, pinted }) =>
    tables.notes.update({ pinted }).where({ id }),
  "v1.createGroup": ({ id, created, modified, name }) =>
    tables.groupes.insert({
      id: id,
      name,
      created,
      modified,
    }),
  "v1.modifyGroup": ({ id, modified, name }) =>
    tables.groupes.update({ name, modified }).where({ id }),
  "v1.deleteGroup": ({ id }) => tables.groupes.delete().where({ id }),
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
