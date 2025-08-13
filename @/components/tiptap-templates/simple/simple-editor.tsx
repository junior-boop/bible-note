import * as React from "react"
import { Editor, EditorContent, EditorContext, useEditor, } from "@tiptap/react"
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus"
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "../../tiptap-ui-primitive/button"
import { Spacer } from "../../tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "../../tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "../../tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "../../tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "../../tiptap-node/blockquote-node/blockquote-node.scss"
import "../../tiptap-node/code-block-node/code-block-node.scss"
import "../../tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "../../tiptap-node/list-node/list-node.scss"
import "../../tiptap-node/image-node/image-node.scss"
import "../../tiptap-node/heading-node/heading-node.scss"
import "../../tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "../../tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "../../tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "../../tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "../../tiptap-ui/blockquote-button"
import { CodeBlockButton } from "../../tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "../../tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "../../tiptap-ui/link-popover"
import { MarkButton } from "../../tiptap-ui/mark-button"
import { TextAlignButton } from "../../tiptap-ui/text-align-button"

// --- Icons ---
import { ArrowLeftIcon } from "../../tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "../../tiptap-icons/highlighter-icon"
import { LinkIcon } from "../../tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "../../../hooks/use-mobile"
import { useWindowSize } from "../../../hooks/use-window-size"
import { useCursorVisibility } from "../../../hooks/use-cursor-visibility"

// --- Components ---
// import { ThemeToggle } from "../../tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "../../../lib/tiptap-utils"

// --- Styles ---
import "../../tiptap-templates/simple/simple-editor.scss"
import { BibleButton } from "../../../../src/communs/ui/bible_component/Bibleverset"
import { FluentArrowLeft32Filled } from "../../../../src/lib/icons"

import { useNavigate } from "react-router-dom"

const MainToolbarContent = ({
  onHighlighterClick,
  // onLinkClick,
  isMobile,
  editor
}: {
  editor?: Editor,
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {

  const [openVerset, setOpenVerset] = React.useState(false)
  const [inputValue, setInputValue] = React.useState<string>("")

  const handleBibleVerset = () => {
    editor?.commands.setVerset({ entry: inputValue })
    setOpenVerset(false)
    setInputValue('')
  }
  const navigate = useNavigate()
  const handleBack = () => navigate(-1)
  return (
    <>
      <div className="pl-2"></div>
      <button onClick={handleBack} className="hover:bg-slate-100 w-[34px] h-[34px] rounded-xl flex justify-center items-center">
        <FluentArrowLeft32Filled className="h-5 w-5" />
      </button>
      <Spacer />

      {/* <ToolbarGroup> */}
      {/* <UndoRedoButton action="undo" /> */}
      {/* <UndoRedoButton action="redo" /> */}
      {/* </ToolbarGroup> */}

      {/* <ToolbarSeparator /> */}

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        {/* <CodeBlockButton /> */}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        {/* <MarkButton type="strike" /> */}
        {/* <MarkButton type="code" /> */}
        {/* <MarkButton type="underline" /> */}
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {/* {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />} */}
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup> */}

      {/* <ToolbarSeparator /> */}

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>
      <ToolbarGroup>
        {/* <ImageUploadButton text="Add" /> */}
        <BibleButton />
      </ToolbarGroup>
      {/* <ToolbarGroup>
        <div className={`h-[52px] absolute w-full bg-slate-200 flex transition-all duration-300 z-[-1] ${openVerset ? "top-[-52px]" : "top-[0]"}`}>
          <input value={inputValue} onChange={({ target }) => setInputValue(target.value)} type="text" className='flex-1 h-full px-4 outline-none' placeholder='Votre verset' />
          <button onClick={handleBibleVerset} className=' aspect-square flex items-center justify-center actived:bg-slate-300' style={{ height: 52, aspectRatio: 1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13 7.828V20h-2V7.828l-5.364 5.364l-1.414-1.414L12 4l7.778 7.778l-1.414 1.414z" /></svg>
          </button>
        </div>
      </ToolbarGroup> */}

      {isMobile && <ToolbarSeparator />}

      {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}
      <Spacer />

      <button className="hover:bg-slate-100 w-[34px] h-[34px] rounded-xl flex justify-center items-center">
        {/* <FluentArrowLeft32Filled className="h-5 w-5" /> */}
      </button>
      <div className="pr-2"></div>
    </>
  )
}

const MenuFlottant = ({ editor, onHighlighterClick, onLinkClick, isMobile }: { editor: Editor, isMobile: boolean, onHighlighterClick: () => void, onLinkClick: () => void }) => {
  return (
    <BubbleMenu editor={editor} className="flex items-center px-1 bg-white border-slate-100 border rounded-xl shadow-md" >
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>
      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>
    </BubbleMenu>
  )
}

const StartingMenu = ({ editor, isMobile }: { editor: Editor, isMobile: boolean }) => {
  return (
    <FloatingMenu editor={editor} className="border-slate-200 border rounded-lg realtive">
      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup></FloatingMenu>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({ onChange, content }: { content: string, onChange: (data: string) => void }) {
  const isMobile = useIsMobile()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: JSON.parse(content),
    onUpdate: (data) => {
      onChange(JSON.stringify(data.editor.getJSON()))
    }
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  // console.log("Editor content:", content)

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              editor={editor}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />

        <MenuFlottant editor={editor} />
        <StartingMenu editor={editor} isMobile={isMobile} />
        <div className="h-[100px]"></div>
      </EditorContext.Provider>
    </div>
  )
}
