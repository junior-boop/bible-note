export default function Subtitle({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold uppercase">{title}</h2>
        </div>
    );
}