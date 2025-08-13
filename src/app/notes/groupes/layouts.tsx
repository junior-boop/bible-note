import { Outlet, NavLink, useLocation, useParams, useNavigate } from "react-router-dom"
import Title from "../../../communs/ui/title";
import { FluentAdd32Regular, FluentCheckmark32Regular, FluentDelete32Regular, FluentEdit32Regular, FluentMoreHorizontal32Regular } from "../../../lib/icons";
import { useEffect, useState } from "react";
import { useStore } from '@livestore/react'
import { groupes, events, type Groupes, tables, type Notes } from "../../../lib/livestore/schema";
import { queryDb } from '@livestore/livestore'
import Subtitle from "../../../communs/ui/subtitle";
import NoteColumn, { NoteColumn2 } from "../../../communs/ui/notecolumn";

export default function GroupeLayouts() {
    const [isHome, setIsHome] = useState(false)
    const location = useLocation()
    const { store } = useStore()

    useEffect(() => {
        const checkDossier = location.pathname.includes('/dossier')
        if (checkDossier) setIsHome(false)
        else setIsHome(true)
    }, [location])

    const data = store.useQuery(queryDb(tables.notes.orderBy('modified', "desc").where({ archived: false })))

    return (
        <div className="flex h-full w-full">
            <AsideList />
            {
                isHome
                    ? <HomeGroupPage data={data} />
                    : (
                        <Outlet />)
            }
        </div>
    )
}

const HomeGroupPage = ({ data }: { data: Notes[] }) => {
    return (
        <div className="h-dvh w-full overflow-x-hidden overflow-y-auto">
            <div className="px-4 py-4">
                <div className="mt-8">
                    <Subtitle title="Recents" />
                </div>
                <div className="px-3">
                    <NoteColumn2>
                        {
                            data.map((el, key) => <NoteItems data={el} key={key} />)
                        }

                    </NoteColumn2>
                </div>
            </div>
        </div>
    )
}


export function AsideList() {
    const [groupName, setGroupName] = useState<string | null>("")
    const { store } = useStore()
    const handleNewGroup = () => {
        if (groupName?.length > 0) {
            store.commit(events.createGroup({
                id: crypto.randomUUID(),
                name: groupName as string,
                created: new Date(),
                modified: new Date()
            }))
        }

        setGroupName("")
    }

    const handleGroupeList = store.useQuery(queryDb(tables.groupes.orderBy("modified", "desc")))

    return (
        <div className="w-[250px] h-full border-r border-slate-300 bg-slate-50">
            <div className="h-[56px] px-4 flex items-center border-b border-slate-200">
                <div className="flex w-full">
                    <input value={groupName as string} onChange={({ target }) => setGroupName(target.value)} type="text" className="focus:outline-none flex-1 w-[180px]" placeholder="Ajouter un dossier" />
                    <button onClick={handleNewGroup} className="w-[42px] h-[42px] flex items-center justify-center">
                        <FluentAdd32Regular className="h-6 w-6" />
                    </button>
                </div>
            </div>
            <div className="h-[92px] flex items-center px-4">
                <div>
                    <Title title="Dossiers" />
                    <div className=" text-sm text-gray-200">Liste de Dossiers</div>
                </div>
            </div>
            <div>
                {
                    handleGroupeList.map((el, key) => <GroupeItems data={el} key={key} />)
                }
            </div>
        </div>
    )
}


const GroupeItems = ({ data }: { data: Groupes }) => {
    const [isEdit, setIsEdit] = useState(false)

    return (
        // <GroupeUpdate data={data} />
        <>{!isEdit ? <Items data={data} onClick={() => setIsEdit(true)} /> : <GroupeUpdate data={data} onClick={() => setIsEdit(false)} />}</>

    )
}

const GroupeUpdate = ({ data, onClick }: { data: Groupes, onClick: () => void }) => {
    const [change, setChange] = useState(data.name)
    const { store } = useStore()

    const handleUpdateGroup = () => {
        store.commit(events.modifyGroup({
            id: data.id,
            name: change as string,
            modified: new Date()
        }))

        onClick()
    }

    return (
        <div className="px-4 py-3 hover:bg-slate-200 flex items-center">
            <input multiple value={change} onChange={({ target }) => setChange(target.value)} className="focus:outline-none border-b" />
            <button onClick={handleUpdateGroup}>
                <FluentCheckmark32Regular className="h-5 w-5" />
            </button>
        </div>
    )
}

const Items = ({ data, onClick }: { data: Groupes, onClick: () => void }) => {
    const [isLocate, setIsLocate] = useState(false)
    const { store } = useStore()
    const { id } = useParams()
    const location = useLocation()
    const handleDelete = () => {
        store.commit(events.deleteGroup({
            id: data.id
        }))
    }

    useEffect(() => {
        setIsLocate(false)
    }, [])

    useEffect(() => {
        if (id === data.id) {
            setIsLocate(true)
        } else setIsLocate(false)
    }, [location, id])
    return (
        <div className="dossierItem px-4 py-3 hover:bg-slate-200 relative flex items-center">
            <NavLink to={`/groupes/dossier/${data.id}`} state={data} className='flex items-center gap-2 justify-between w-full'>
                <span className={`flex-1 ${isLocate ? "font-bold" : ""}`}>
                    {data.name}
                </span>

                {isLocate && <span className="w-[12px] h-[12px] rounded-full bg-slate-800"></span>}

            </NavLink>

            <div className="itemsMenu absolute right-0 flex gap-3 px-3 py-2 bg-slate-200">
                <button onClick={onClick}>
                    <FluentEdit32Regular className="h-5 w-5" />
                </button>
                <button onClick={handleDelete}>
                    <FluentDelete32Regular className="h-5 w-5" />
                </button>
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
        <div className="noteitems text-[14px] bg-slate-50 mb-4 w-full rounded-xl max-h-[425px]  relative">

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