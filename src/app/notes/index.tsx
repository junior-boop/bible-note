import { useState } from "react";
import { FluentSearch32Filled, LineMdCloseSmall } from "../../lib/icons";
import Title from "../../communs/ui/title";
import Subtitle from "../../communs/ui/subtitle";
import Noteliste from "../../communs/ui/NotesListe";

export default function NotesPages() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");



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
                <Title title="Notes" />
                <div>
                    La liste des notes sera affichée ici.
                </div>




                {/* {notes.length === 0 && (<div className="mt-8 h-[100px] w-full flex items-center px-10 border-dashed border rounded-xl">
                    <div>Cliquez sur le bouton <b>"Ajouter une note"</b> pour commencer a écrire les notes</div>
                </div>)} */}
            </div>
        </div>
    )
}