import { SimpleEditor } from "../../../@/components/tiptap-templates/simple/simple-editor"

import { useStore } from '@livestore/react'
import { tables, events, type Notes, notes } from '../../lib/livestore/schema';
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"

export default function EditorPage() {
    const [content, setContent] = useState<string>("")
    const { store } = useStore()
    const { id } = useParams()
    const location = useLocation()



    useEffect(() => {
        const contentBody = location.state.note.body
        if (contentBody) {
            setContent(contentBody)
        }

        const d = store.query(tables.notes.select().where({ id: id as string }))
        console.log("EditorPage content loaded", d)
    }, [content])

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         store.commit(events.modifiedNote({
    //             id: id as string,
    //             body: content,
    //             modified: new Date(),
    //         }))
    //         // console.log("EditorPage content saved", content)
    //     }, 5000)

    //     return () => clearTimeout(timer);
    // }, [content])

    return (
        <div className="flex-1 overflow-hidden w-full h-full">
            {
                content.length > 0 && (
                    <SimpleEditor content={content} onChange={(data) => {
                        setContent(data)
                        console.log("EditorPage content changed", data)
                        store.commit(events.modifiedNote({
                            id: id as string,
                            body: data,
                            modified: new Date(),
                        }))
                    }} />
                )
            }
        </div>
    )
}