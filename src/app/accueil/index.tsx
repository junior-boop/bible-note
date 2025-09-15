import { useCallback, useEffect, useState } from "react";
import { FluentSearch32Filled, LineMdCloseSmall } from "../../lib/icons";
import Title from "../../communs/ui/title";
import Subtitle from "../../communs/ui/subtitle";
import Noteliste from "../../communs/ui/NotesListe";
import type { Notes as NotesType } from "../../lib/database/db";
import { useDatabase } from "../../communs/context/databaseprovide";
import SearchBar from "../../../src/communs/searchbar";

export default function Accueil() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { notesQuery } = useDatabase();

    const notes = notesQuery?.where(note => note.archived === 0 && note.pinned === 0);
    const notepinned = notesQuery?.where(note => note.archived === 0 && note.pinned === 1);

    const handlesearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 0) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }
    }

    return (
        <div className="w-full h-dvh">
            <SearchBar />
            <div className="py-4 overflow-y-scroll h-[calc(100dvh-64px)] pl-8 pr-3">
                <Title title="Articles" />
                <div>
                    La liste des notes sera affichée ici.
                </div>

                {
                    notes && notes.length > 0 && (<>
                        {notes.length >= 1 ? <div className="mt-8"><Subtitle title="Toutes les notes" /></div> : <div className="mt-8"><Subtitle title="Autres" /></div>}
                        <div className="px-2">
                            <Noteliste data={notes as NotesType[]} />
                        </div>
                    </>)
                }


                {(notes?.length === 0 && notepinned?.length === 0) && (<div className="mt-8 h-[100px] w-full flex items-center px-10 border-dashed border rounded-xl">
                    <div>Cliquez sur le bouton <b>"Ajouter une note"</b> pour commencer a écrire les notes</div>
                </div>)}
            </div>
        </div>
    )
}



