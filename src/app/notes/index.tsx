import { useState } from "react";
import { FluentSearch32Filled, LineMdCloseSmall } from "../../lib/icons";
import Title from "../../communs/ui/title";
import Subtitle from "../../communs/ui/subtitle";

import { queryDb } from '@livestore/livestore'
import { useStore } from '@livestore/react'
import { tables, type Notes } from "../../lib/livestore/schema";
import Noteliste from "../../communs/ui/NotesListe";

export default function NotesPages() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { store } = useStore()
    const notes = store.useQuery(
        queryDb(tables.notes.orderBy('modified', 'desc').where('archived', false)),
    )

    const handlesearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 0) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }
    }

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
            <div className="p-4">
                <Title title="Notes" />
                <div>
                    La liste des notes sera affichée ici.
                </div>

                <div className="mt-8"><Subtitle title="Notes épinglés" /></div>

                <div className="mt-8"><Subtitle title="Autres" /></div>
                <div>
                    <Noteliste data={notes as Notes[]} />
                </div>
            </div>
        </div>
    )
}