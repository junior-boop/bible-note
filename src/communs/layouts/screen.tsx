import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, } from 'react-router-dom';
import { FluentArchive32Filled, FluentArchive32Regular, FluentDocumentFolder32Filled, FluentDocumentFolder32Regular, FluentHome32Filled, FluentHome32Regular, FluentNoteAdd28Regular, FluentPerson32Filled, FluentPerson32Regular, FluentSettings32Filled, FluentSettings32Regular } from '../../lib/icons';
import { useNavigate } from 'react-router-dom';
import { events, type Notes } from '../../lib/livestore/schema';

import { useStore } from '@livestore/react'
export default function Screen() {
    const [onNote, setOnNote] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setOnNote(location.pathname.includes("note"))
    }, [location])
    return (
        <div className="flex w-full h-dvh relative ">
            <div className='w-[62px] h-full bg-gray-100 border-r border-gray-300 relative'>
                <div>
                    <div className='h-[72px]'></div>
                    <div className='flex flex-col items-center gap-2'>
                        <NavItems icon={(actives) => actives ? <FluentHome32Filled className=" h-6 w-6 text-slate-800" /> : <FluentHome32Regular className='h-6 w-6' />} url="/" />
                        <NavItems icon={(actives) => actives ? <FluentDocumentFolder32Filled className=" h-6 w-6 text-slate-800" /> : <FluentDocumentFolder32Regular className='h-6 w-6' />} url="/groupes" />
                        <NavItems icon={(actives) => actives ? <FluentArchive32Filled className=" h-6 w-6 text-slate-800" /> : <FluentArchive32Regular className='h-6 w-6' />} url="/archives" />
                        <NavItems icon={(actives) => actives ? <FluentSettings32Filled className=" h-6 w-6 text-slate-800" /> : <FluentSettings32Regular className='h-6 w-6' />} url="/settings" />
                    </div>
                </div>
                <div className='flex flex-col items-center gap-2 absolute bottom-4 w-full'>
                    <NavItems icon={(actives) => actives ? <FluentPerson32Filled className=" h-6 w-6 text-slate-800" /> : <FluentPerson32Regular className='h-6 w-6' />} url="/profile" />
                </div>
            </div>
            <div className='flex-1 w-full h-full overflow-hidden relative'>
                <Outlet />
            </div>
            {
                onNote ? null : <NewNote />
            }
        </div>
    );
}


function NewNote() {
    const navigate = useNavigate();
    const { store } = useStore();

    const handleNewNote = () => {
        const placeholderText = `{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":null,"level":1},"content":[{"type":"text","text":"Entrez votre titre"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Écrivez votre note et autres ici."}]}]}`
        const newnote: Notes = {
            id: crypto.randomUUID(),
            body: placeholderText,
            pinted: false,
            archived: false,
            grouped: '',
            created: new Date(),
            modified: new Date(),
            deleted: null,
            creator: "00000", // Replace with actual user ID
        }

        store.commit(events.createdNote(newnote));

        navigate(`/note/${newnote.id}`, {
            state: {
                note: newnote
            }
        });
    }


    return (<button onClick={handleNewNote} className='bg-slate-200 text-black h-[50px] px-6 rounded-4xl absolute bottom-4 left-[78px] flex items-center gap-2 hover:bg-slate-800 hover:text-white transition-all ease-in-out duration-300 shadow-md'>
        <FluentNoteAdd28Regular className='h-6 w-6' />
        Ajouter une note</button>

    );
}


function NavItems({ icon, url = "/" }: { icon: (actived: boolean) => React.JSX.Element, url?: string }) {
    const [isActived, setIsActived] = useState(false);
    const navigation = useLocation()

    useEffect(() => {
        setIsActived(window.location.pathname === url);
    }, [navigation]);
    return (
        <NavLink to={url} className="flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors duration-200 w-[80%] aspect-square rounded-full justify-center hover:bg-gray-200">
            {icon(isActived)}
        </NavLink>
    )
}