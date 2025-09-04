import { SimpleEditor } from "../../../@/components/tiptap-templates/simple/simple-editor"


import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"

export default function EditorPage() {
    const [content, setContent] = useState<string>("")
    const { id } = useParams()
    const location = useLocation()
    const [isTyping, setIsTyping] = useState(false)
    const [savingState, setSavingState] = useState('Enregistrement...')




    useEffect(() => {
        const contentBody = location.state.note.body
        if (contentBody) {
            setContent(contentBody)
        }
    }, [])


    useEffect(() => {

        const t1 = setTimeout(() => {
            console.log("active")

            setSavingState("Enregistré!")
            setIsTyping(false)
        }, 3000)


        const t2 = setTimeout(() => {
            console.log("desactive")
            setSavingState("Enregistrement...")
        }, 500)


        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }

    }, [content])

    return (
        <div className="flex-1 overflow-hidden w-full h-full">
            {
                content.length > 0 && (
                    <SimpleEditor content={content} onChange={(data) => {
                        setIsTyping(true)
                        setContent(data)
                    }} />
                )
            }
        </div>
    )
}

