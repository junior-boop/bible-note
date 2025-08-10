import { useEffect, useState } from "react";
import { FluentMoreHorizontal32Regular, FluentPin32Filled, FluentPin32Regular } from "../../lib/icons";
import { events, type Notes } from "../../lib/livestore/schema";
import { useStore } from '@livestore/react'
import { useNavigate } from 'react-router-dom';

export default function NoteItems({ data }: { data: Notes }) {
    const [pin, setPin] = useState(false);
    const { id, body } = data;
    const [openMenu, setOpenMenu] = useState(false)
    const content = JSON.parse(body || "{}") as { content: { type: string, content: { type: string, text: string }[] }[] } || {};

    const heading = (d: { text: string }) => <div className="font-semibold">{d.text}</div>;
    const paragraph = (d: { text: string }) => <p className="mb-0">{d.text}</p>;
    const titre = (d: { text: string }) => <div className="text-base mb-2">{d.text}</div>

    const { store } = useStore();

    const navigate = useNavigate()

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

    return (
        <div className="noteitems p-4 text-[14px] bg-slate-50 mb-4 w-[256px] rounded-xl max-h-[425px]  relative">

            <div className="noteovermouse absolute top-0 left-0  w-full z-[5] ">
                <div className="relative h-full w-full bg-slate-50">
                    <button onClick={handlePinToggle} className="absolute top-4 right-12 text-xs text-gray-500">
                        {
                            pin ? (
                                <FluentPin32Filled className="w-5 h-5 text-blue-500" />
                            ) : (
                                <FluentPin32Regular className="w-5 h-5" />
                            )}
                    </button>
                    <button onClick={() => setOpenMenu(!openMenu)} className="absolute top-4 right-4 text-xs text-gray-500">
                        <FluentMoreHorizontal32Regular className="w-5 h-5 rotate-90" />
                        <div className="relative">
                            <div className=" absolute top-0 right-[-50%] w-[150px] border border-slate-200 bg-white rounded-md shadow-md">
                                <ul className="py-1 w-full">
                                    <button onClick={handleArchiver} className="w-full"><li className="text-base px-3 py-2 hover:bg-slate-50">Archiver</li></button>
                                    <button onClick={handleDelete} className="w-full"><li className="text-base px-3 py-2 hover:bg-slate-50">Supprimer</li></button>

                                </ul>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <button onClick={handleOpen} className="absolute h-full w-full z-[4] top-0 left-0"></button>
            <div className="h-full w-full overflow-hidden border relative max-h-[393px] z-[1]">
                {textContent}
            </div>
        </div>
    )
}