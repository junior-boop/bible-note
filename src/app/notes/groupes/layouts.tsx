import { Outlet, NavLink } from "react-router-dom"
import Title from "../../../communs/ui/title";
import { FluentAdd32Regular, FluentCheckmark32Regular, FluentDelete32Regular, FluentEdit32Regular } from "../../../lib/icons";
import { useEffect, useState } from "react";
import { useStore } from '@livestore/react'
import { groupes, events, type Groupes, tables } from "../../../lib/livestore/schema";
import { queryDb } from '@livestore/livestore'

export default function GroupeLayouts() {
    const [isHome, setIsHome] = useState(false)
    const location = useLocation()

    useEffect(() => {

    })

    return (
        <div className="flex h-full w-full">
            <AsideList />
            <div>
                <Outlet />
            </div>
        </div>
    )
}

const HomeGroupPage = () => {
    return (
        <div>

        </div>
    )
}


export function AsideList() {
    const [groupName, setGroupName] = useState<string | null>("")
    const { store } = useStore()
    const handleNewGroup = () => {
        store.commit(events.createGroup({
            id: crypto.randomUUID(),
            name: groupName as string,
            created: new Date(),
            modified: new Date()
        }))

        setGroupName("")
    }

    const handleGroupeList = store.useQuery(queryDb(tables.groupes.orderBy("modified", "desc")))

    useEffect(() => {
        console.log(handleGroupeList)
    }, [handleGroupeList])
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
                    <div className=" text-sm text-gray-200">Liste des Dossiers</div>
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
    const { store } = useStore()
    const handleDelete = () => {
        store.commit(events.deleteGroup({
            id: data.id
        }))
    }
    return (
        <div className="dossierItem px-4 py-3 hover:bg-slate-200 relative flex items-center">
            <NavLink to={`/groupes/${data.id}`}>{data.name}</NavLink>

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