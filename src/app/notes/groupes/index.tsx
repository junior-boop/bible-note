import { useEffect, useState } from "react";
import NoteColumn, { NoteColumn2 } from "../../../communs/ui/notecolumn";
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { useStore } from '@livestore/react'
import { events, tables, type Notes } from "../../../lib/livestore/schema";
import { queryDb } from '@livestore/livestore'
import Title from "../../../communs/ui/title";
import { FluentMoreHorizontal32Regular } from "../../../lib/icons";

export default function DossierPage() {
    const { id } = useParams()
    const location = useLocation()
    const { store } = useStore()

    const d = store.useQuery(queryDb(tables.notes.where({ grouped: id as string }).where({ archived: false })))

    useEffect(() => {
        console.log(id, location.state, d)
    }, [location])
    return (
        <div className="h-dvh w-full overflow-x-hidden overflow-y-auto">
            <div className="px-4 py-4">
                <div className="mt-8 mb-4">
                    <Title title={location.state.name} />
                </div>
                <div className="px-3">
                    <NoteColumn2>
                        {
                            d.map((el, key) => <NoteItems data={el} key={key} />)
                        }
                    </NoteColumn2>
                </div>
            </div>
        </div>
    )
}


function NoteItems({ data }: { data: Notes }) {
    const { id, body } = data;
    const [openMenu, setOpenMenu] = useState(false)
    const content = JSON.parse(body || "{}") as { content: { type: string, content: { type: string, text: string }[] }[] } || {};


    const heading = (d: { text: string }) => <div className="font-semibold">{d.text}</div>;
    const paragraph = (d: { text: string }) => <p className="mb-0">{d.text}</p>;
    const titre = (d: { text: string }) => <div className="text-base mb-2 font-semibold">{d.text}</div>

    const { store } = useStore();

    const navigate = useNavigate()
    // const location = useLocation();

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

    return (
        <div className="noteitems p-4 text-[14px] bg-slate-50 mb-4 w-full rounded-xl max-h-[425px]  relative">

            <div className="noteovermouse absolute top-0 left-0  w-full z-[5] ">
                <div className="relative h-full w-full bg-slate-50">
                    <div className="absolute flex items-center gap-4 top-3 right-3 p-2 bg-slate-200 rounded-xl">

                        <button onClick={() => setOpenMenu(!openMenu)} className="text-xs text-gray-700">
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
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={handleOpen} className="absolute h-full w-full z-[4] top-0 left-0"></button>
            <div className="h-full w-full overflow-hidden relative max-h-[393px] z-[1]">
                {textContent}
            </div>
        </div>
    )
}