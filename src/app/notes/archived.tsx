import { useCallback, useEffect, useState } from "react";
import { FluentSearch32Filled, LineMdCloseSmall } from "../../lib/icons";
import Title from "../../communs/ui/title";
import Subtitle from "../../communs/ui/subtitle";

import Noteliste from "../../communs/ui/NotesListe";
import { Notes } from "../../lib/database/db";

export default function ArchivePages() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [notes, setNotes] = useState<Notes[] | null>(null)


    const handlesearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 0) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }
    }

    const handleNotes = useCallback(async () => {
        setNotes(await window.api.db.getnotesarchived())
    }, [])



    useEffect(() => {
        (async () => {
            console.log(await window.api.db.getnotesarchived())
        })()
        handleNotes()
    }, [handleNotes])

    return (
        <div className="w-full h-dvh">
            <div className="flex items-center gap-4 p-4 border-b border-gray-200 w-full">
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