import { useCallback, useEffect, useState } from "react";
import { FluentSearch32Filled, LineMdCloseSmall } from "../../lib/icons";
import Title from "../../communs/ui/title";
import Subtitle from "../../communs/ui/subtitle";
import Noteliste from "../../communs/ui/NotesListe";
import type { Notes as NotesType } from "../../lib/database/db";
import { useDatabase } from "../../communs/context/databaseprovide";

export default function Settings() {
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

            <div className="py-4 overflow-y-scroll h-dvh pl-8 pr-3">
                <Title title="Paramètres" />
                <div>
                    La liste des notes sera affichée ici.
                </div>
                <div className="mt-6 w-[70%] bg-amber-500 h-full">
                    <div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}



