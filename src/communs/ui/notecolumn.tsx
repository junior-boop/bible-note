import Masonry from "react-masonry-css";
export default function NoteColumn({ children }: { children: React.ReactNode }) {
    const breakpointCols = {
        default: 4,
        1100: 3,
        800: 2,
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