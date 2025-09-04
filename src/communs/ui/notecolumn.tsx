import Masonry from "react-masonry-css";
export default function NoteColumn({ children }: { children: React.ReactNode }) {
    const breakpointCols = {
        default: 4,
        1080: 3,
        752: 2,
        500: 1
    };
    return (
        <Masonry
            breakpointCols={breakpointCols}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {children}
        </Masonry>
    )
}

export function NoteColumn2({ children }: { children: React.ReactNode }) {
    const breakpointCols = {
        default: 3,
        1080: 2,
        752: 1,
    };
    return (
        <Masonry
            breakpointCols={breakpointCols}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {children}
        </Masonry>
    )
}