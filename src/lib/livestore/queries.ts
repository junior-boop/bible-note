import { tables } from "./schema";
import { queryDb } from "@livestore/livestore";

// export const useFilterState = () => useClientDocument(tables.filterState);

// Requêtes pour les notes
export const notesCount$ = queryDb(
  tables.notes.count().where({ deleted: null }),
  { label: "global.notesCount" }
);

export const notesSelectById = queryDb(
  tables.notes
    .select("id")
    .orderBy("modified", "desc")
    .first({ fallback: () => 0 }),
  { label: "global.NotesSelectionById" }
);

export const AfficheAllNotes = queryDb(
  tables.notes.orderBy("modified", "desc"),
  {
    label: "global.notesSelection",
  }
);

export const activeNotes$ = queryDb(
  tables.notes
    .where({ deleted: null, archived: false })
    .orderBy("created", "desc"),
  { label: "notes.active" }
);

export const archivedNotes$ = queryDb(
  tables.notes
    .where({ deleted: null, archived: true })
    .orderBy("modified", "desc"),
  { label: "notes.archived" }
);

// export const groupedNotes$ = queryDb(
//   tables.notes
//     .where({ deleted: null, group : true })
//     .orderBy("modified", "desc"),
//   { label: "notes.grouped" }
// );
