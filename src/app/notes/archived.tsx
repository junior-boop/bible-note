import { useCallback, useEffect, useState } from "react";
import { FluentSearch32Filled, LineMdCloseSmall } from "../../lib/icons";
import Title from "../../communs/ui/title";
import Subtitle from "../../communs/ui/subtitle";

import Noteliste from "../../communs/ui/NotesListe";
import { Notes } from "../../lib/database/db";
import { useDatabase } from "../../communs/context/databaseprovide";

export default function ArchivePages() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { notesQuery } = useDatabase();


    const notes = notesQuery?.where(note => note.archived === 1);


    const handlesearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 0) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }
    }

    return (
        <div className="w-full h-dvh px-4 py-3">
            <div className="flex items-center gap-4 p-4 bg-blue-50 w-full rounded-full">
                {
                    isSearching ? (
                        <button onClick={() => { setIsSearching(false); setSearchQuery("") }}><LineMdCloseSmall className="h-6 w-6" /></button>
                    ) : (
                        <FluentSearch32Filled className="h-5 w-5" />
                    )
                }
                <input type="text" placeholder="Search notes..." className="focus:outline-none focus:ring-0" onChange={handlesearchChange} value={searchQuery} />
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100dvh-64px)]">
                <Title title="Archives" />
                <div>
                    La liste des notes archivées ici.
                </div>

                {
                    notes && notes.length > 0 && (<>
                        <div className="mt-8"></div>
                        <div className="px-2">
                            <Noteliste data={notes as Notes[]} />
                        </div>
                    </>)
                }

            </div>
        </div>
    )
}