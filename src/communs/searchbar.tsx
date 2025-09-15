import { useState } from "react";
import { FluentSearch32Filled, LineMdCloseSmall } from "../lib/icons";

export default function SearchBar() {
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
        <div className="px-4 pt-4">
            <div className="flex items-center gap-4 px-5 py-4 w-full bg-blue-50 rounded-full ">
                {
                    isSearching ? (
                        <button onClick={() => { setIsSearching(false); setSearchQuery("") }}><LineMdCloseSmall className="h-6 w-6" /></button>
                    ) : (
                        <FluentSearch32Filled className="h-5 w-5" />
                    )
                }
                <input type="text" placeholder="Search notes..." className="focus:outline-none focus:ring-0" onChange={handlesearchChange} value={searchQuery} />
            </div>
        </div>
    )
}