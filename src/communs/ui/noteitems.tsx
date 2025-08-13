import { useEffect, useState } from "react";
import { FluentArchiveArrowBack32Regular, FluentDelete32Regular, FluentMoreHorizontal32Regular, FluentPin32Filled, FluentPin32Regular } from "../../lib/icons";
import { events, type Notes, groupes, tables } from "../../lib/livestore/schema";
import { useStore } from '@livestore/react'
import { useNavigate, useLocation } from 'react-router-dom';
import { queryDb } from '@livestore/livestore'

export default function NoteItems({ data }: { data: Notes }) {
    const [pin, setPin] = useState(false);
    const { id, body } = data;
    const [openMenu, setOpenMenu] = useState(false)
    const content = JSON.parse(body || "{}") as { content: { type: string, content: { type: string, text: string }[] }[] } || {};
    const [isHome, setIshome] = useState(false)



    const heading = (d: { text: string }) => <div className="font-semibold">{d.text}</div>;
    const paragraph = (d: { text: string }) => <p className="mb-0">{d.text}</p>;
    const titre = (d: { text: string }) => <div className="text-base mb-2 font-semibold">{d.text}</div>

    const { store } = useStore();

    const navigate = useNavigate()
    const location = useLocation();

    const groupe = store.useQuery(queryDb(tables.groupes.where({ id: data.grouped as string })))

    const textContent = content.content?.map((item, i) => {
        if (i === 0 && item.type === "heading") {
            return titre(item.content[0])
        }
        if (item.type === "paragraph") {
            if (item.content && item.content.length > 0) {
                return paragraph(item.content[0]);
            }
        }

        if (item.type === "heading") {
            return heading(item.content[0]);
        }



        return null;
    });

    useEffect(() => {
        if (data.pinted) {
            setPin(true);
        }
    }, [data.pinted]);

    const handlePinToggle = () => {
        setPin(!pin);
        // Here you can add logic to handle pinning the note, e.g., updating the store or state
        store.commit(events.pintingNote({
            id,
            pinted: !pin,
        }));
    }

    const handleDelete = () => {
        setOpenMenu(false)
        store.commit(events.deletedNote({
            id,
            deleted: new Date(),
        }));
    }

    const handleOpen = () => {
        setOpenMenu(false)
        navigate(`/note/${id}`, {
            state: {
                note: data
            }
        })
    }

    const handleArchiver = () => {
        setOpenMenu(false)
        store.commit(events.archivedNote({
            id,
            archived: !data.archived
        }))
    }
    // console.log("NoteItems data", textContent);

    useEffect(() => {
        const locationNote = location.pathname === "/"

        if (locationNote) {
            setIshome(true)
        } else setIshome(false)
    }, [])

    return (
        <div className="noteitems text-[14px] bg-slate-50 mb-4 w-full rounded-xl max-h-[425px]  relative">

            <div className="noteovermouse absolute top-0 left-0  w-full z-[5] ">
                <div className="relative h-full w-full bg-slate-50">
                    <div className="absolute flex items-center gap-4 top-3 right-3 p-2 bg-slate-200 rounded-xl">
                        {
                            isHome && (<button onClick={handlePinToggle} className="text-xs text-gray-700">
                                {
                                    pin ? (
                                        <FluentPin32Filled className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <FluentPin32Regular className="w-5 h-5" />
                                    )}
                            </button>)
                        }
                        {
                            isHome
                                ? (<button onClick={() => setOpenMenu(!openMenu)} className="text-xs text-gray-700">
                                    <FluentMoreHorizontal32Regular className="w-5 h-5 rotate-90" />
                                    {
                                        openMenu && (<div className="relative">
                                            <div className=" absolute top-0 right-[-50%] w-[150px] border border-slate-200 bg-white rounded-md shadow-md">
                                                <ul className="py-1 w-full">
                                                    <button onClick={handleArchiver} className="w-full"><li className="text-base px-3 py-2 hover:bg-slate-50">Archiver</li></button>
                                                    <button onClick={handleDelete} className="w-full"><li className="text-base px-3 py-2 hover:bg-slate-50">Supprimer</li></button>

                                                </ul>
                                            </div>
                                        </div>)
                                    }
                                </button>)
                                : (<>
                                    <button onClick={handleDelete} className="text-xs text-gray-700">
                                        <FluentDelete32Regular className="w-5 h-5" />
                                    </button>
                                    <button onClick={handleArchiver} className="text-gray-700">
                                        <FluentArchiveArrowBack32Regular className="w-5 h-5" />
                                    </button></>)
                        }
                    </div>
                </div>
            </div>
            <button onClick={handleOpen} className="absolute h-full w-full z-[4] top-0 left-0"></button>
            <div className="h-full w-full overflow-hidden relative max-h-[393px] z-[1] p-4">
                {textContent}
            </div>
            {
                groupe.length > 0 && <div className="bg-slate-200 px-4 py-2 rounded-b-xl">
                    {
                        groupe[0].name.length > 25 ? `${groupe[0].name.substring(0, 25)}...` : groupe[0].name
                    }
                </div>
            }
        </div>
    )
}