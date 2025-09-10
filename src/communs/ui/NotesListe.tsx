import { Notes } from "../../lib/database/db";
import NoteColumn from "./notecolumn";
import NoteItems from "./noteitems";

export default function Noteliste({ data }: { data: Notes[] }) {
    return (
        <NoteColumn>
            {
                data.map((el) => <NoteItems key={el.id} data={el as Notes} />)
            }
        </NoteColumn>
    )
}