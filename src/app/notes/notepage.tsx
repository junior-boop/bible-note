import { SimpleEditor } from "../../../@/components/tiptap-templates/simple/simple-editor"


import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"
import { useDatabase } from "../../communs/context/databaseprovide";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../../components/ui/sheet";
import { Button } from "../../../@/components/tiptap-ui-primitive/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { FluentSlideTextSparkle32Regular } from "../../lib/icons";

export default function EditorPage() {
    const [content, setContent] = useState<string>("")
    const { id } = useParams()
    const location = useLocation()
    const [isTyping, setIsTyping] = useState(false)
    const [savingState, setSavingState] = useState('Enregistrement...')
    const { updateNote } = useDatabase()


    useEffect(() => {
        const contentBody = location.state.note.body
        if (contentBody) {
            setContent(contentBody)
        }
    }, [])


    useEffect(() => {

        const t1 = setTimeout(() => {
            console.log("active")
            updateNote({
                id: id,
                body: content,
            })
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

    const handlegoback = () => {
        console.log("active")
        updateNote({
            id: id,
            body: content,
        })
    }

    return (
        <div className="flex-1 overflow-hidden w-full h-full relative">
            {
                content.length > 0 && (
                    <SimpleEditor
                        content={content}
                        onChange={(data) => {
                            setIsTyping(true)
                            setContent(data)
                        }}
                        onBack={handlegoback}
                    />
                )
            }
            <SheetDemo />
        </div>
    )
}

export function SheetDemo() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="absolute bottom-8 right-8 bg-blue-500 hover:bg-blue-600 flex items-center justify-center w-[52px] aspect-square rounded-full text-white shadow-lg">
                    <FluentSlideTextSparkle32Regular className="w-6 h-6" />
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Assistant Intelligent</SheetTitle>
                    <SheetDescription>
                        Assistant aide a redaction selon le contexte :
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                        <Label htmlFor="sheet-demo-name">Name</Label>
                        {/* <Input id="sheet-demo-name" defaultValue="Pedro Duarte" /> */}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="sheet-demo-username">Username</Label>
                        {/* <Input id="sheet-demo-username" defaultValue="@peduarte" /> */}
                    </div>
                </div>
                <SheetFooter>
                    <div>
                        <p className="text-sm text-muted-foreground">Powered by GPT-4</p>
                    </div>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}