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
import "../../tiptap-node/blockquote-node/blockquote-node.css"
import "../../tiptap-node/code-block-node/code-block-node.css"
import "../../tiptap-node/horizontal-rule-node/horizontal-rule-node.css"
import "../../tiptap-node/list-node/list-node.css"
import "../../tiptap-node/image-node/image-node.css"
import "../../tiptap-node/heading-node/heading-node.css"
import "../../tiptap-node/paragraph-node/paragraph-node.css"

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
import "../../tiptap-templates/simple/simple-editor.css"
import { BibleVersetIcon, FluentArrowLeft32Filled, FluentArrowUp32Filled, FluentFolderLink32Regular, FluentImageAdd32Regular } from "../../../../src/lib/icons"

import BibleVerset from "../../../../src/communs/ui/bible_component/extension"


import { useLocation, useNavigate } from "react-router-dom"


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

  const navigate = useNavigate()
  const handleBack = () => navigate(-1)
  const addVersetSection = () => {
    // Logic to add a new verse section
    const Box = document.createElement("div");
    Box.className = "bible-verset";
    Box.contentEditable = "false";
    Box.innerHTML = `<input type="text" placeholder='Votre verset' /><button class="add-verset-button">Add</button>`;
    editor?.view.dom.append(Box);
  }
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
        <AddImage editor={editor as Editor} />
      </ToolbarGroup>
      <ToolbarGroup>
        <AddBibleVerset editor={editor as Editor} />
      </ToolbarGroup>

      {isMobile && <ToolbarSeparator />}

      {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}
      <Spacer />

      {/* <button className="hover:bg-slate-100 w-[34px] h-[34px] rounded-xl flex justify-center items-center">
        <FluentFolderLink32Regular className="h-5 w-5" />
      </button> */}
      <DossierButton editor={editor as Editor} />
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
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      BibleVerset,
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
              editor={editor as Editor}
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

        <MenuFlottant editor={editor as Editor} />
        <StartingMenu editor={editor as Editor} isMobile={isMobile} />
        <div className="h-[100px]"></div>
      </EditorContext.Provider>
    </div>
  )
}


const AddBibleVerset = ({ editor }: { editor: Editor }) => {
  const [openVerset, setOpenVerset] = React.useState(false)
  const [isActive, setIsActived] = React.useState(false)

  const InputVerset = ({ onBlur }: { onBlur: () => void }) => {
    const [verse, setVerse] = React.useState<string>("")

    const handleVerse = () => {
      console.log("je suis dans la place")
      if (verse.trim() !== "") {
        editor?.commands.setVerset({ entry: verse })
        handleOpen()
        setVerse("")
      }
    }
    return (
      <div className="absolute top-[30px] left-[-100px] w-[210px] bg-white border border-slate-200 rounded-lg p-1 flex items-center gap-2 shadow-md">
        <input autoFocus={true} type="text" placeholder='Votre verset' value={verse} onChange={(e) => setVerse(e.target.value)} className="w-[155px] h-full px-1 focus:outline-none" />
        <button onClick={handleVerse} className="hover:bg-slate-100 rounded-xl w-[35px] aspect-square flex items-center justify-center">
          <FluentArrowUp32Filled className="h-5 w-5 text-slate-500 rotate-180" />
        </button>

      </div>
    )
  }

  const handleOpen = () => {
    setOpenVerset(!openVerset)
    setIsActived(!isActive)
  }
  return (
    <div className="relative">
      {/* <button onClick={() => setOpenVerset(!openVerset)} className="hover:bg-slate-100 w-[34px] h-[34px] rounded-xl flex justify-center items-center">
        
      </button> */}
      <Button
        type="button"
        disabled={false}
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={false}
        role="button"
        tabIndex={-1}
        aria-label={"verset biblique"}
        aria-pressed={isActive}
        tooltip={"Verset Biblique"}
        onClick={handleOpen}

      >
        <BibleVersetIcon className="h-4 w-4" />
      </Button>
      {openVerset && <InputVerset onBlur={handleOpen} />}
    </div>
  )
}

const AddImage = ({ editor, text }: { editor: Editor, text?: boolean }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !editor) return;

    try {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor
            .chain()
            .focus()
            .setImage({ src: reader.result })
            .run();
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <Button
        type="button"
        data-style="ghost"
        onClick={handleClick}
        aria-label="Ajouter une image"
        tooltip="Ajouter une image"
      >
        <FluentImageAdd32Regular className="h-[18px] w-[18px]" />
        {!text && <span className="tiptap-button-text">Ajouter</span>}
      </Button>
    </div>
  );
}


const DossierButton = ({ editor }: { editor: Editor }) => {
  const [openVerset, setOpenVerset] = React.useState(false)
  const [isActive, setIsActived] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state.note
  const [note, setNote] = React.useState(state)

  const InputVerset = ({ onBlur }: { onBlur: () => void }) => {
    const [verse, setVerse] = React.useState<string>("")


    // console.log(location.pathname)

    const handleNewState = (groupId: string) => {
      setNote({ ...note, grouped: groupId })

      setTimeout(() => {
        handleOpen()
      }, 1000)

    }

    const handleNoGroup = () => {
      setNote({ ...note, grouped: "" })

      setTimeout(() => {
        handleOpen()
      }, 1000)

    }

    return (
      <div onBlur={onBlur} className="absolute top-[30px] right-[-12px] w-[210px] bg-white border border-slate-200 rounded-lg px-1 py-2 gap-2 shadow-md">
        <span className="text-[14px] font-semibold inline-block mb-2 px-2 mb-1">Liste des Dossiers</span>
        <button onClick={handleNoGroup} className={`flex items-center gap-2 justify-between w-full py-1 px-2 ${note.grouped === "" ? "bg-gray-50" : ""} rounded-md`}>
          <span className={`flex-1 ${note.grouped === "" ? "font-semibold" : ""} text-[14px]`}>Aucun Dossier</span>
          {note.grouped === "" && <span className="w-[8px] h-[8px] rounded-full bg-slate-700"></span>}
        </button>
        {
          // d.map((el, key) => (
          //   <button onClick={() => handleNewState(el.id)} className={`flex items-center gap-2 justify-between w-full py-1 ${note.grouped === el.id ? "bg-gray-50" : ""} px-2 rounded-md mb-1`} key={key}>
          //     <span className={`flex-1 ${note.grouped === el.id ? "font-semibold" : ""} text-[14px]`}>{el.name}</span>
          //     {note.grouped === el.id && <span className="w-[8px] h-[8px] rounded-full bg-slate-700"></span>}
          //   </button>
          // ))
        }
      </div>
    )
  }

  const handleOpen = () => {
    setOpenVerset(!openVerset)
    setIsActived(!isActive)
  }
  return (
    <div className="relative">

      <Button
        type="button"
        disabled={false}
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={false}
        role="button"
        tabIndex={-1}
        aria-label={"Dossier"}
        aria-pressed={isActive}
        tooltip={"Dossier"}
        onClick={handleOpen}

      >
        <FluentFolderLink32Regular className="h-5 w-5" />
      </Button>
      {openVerset && <InputVerset onBlur={handleOpen} />}
    </div>
  )
}