export default function Title({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between w-[80%]">
            <h1 className="text-2xl">{title}</h1>
        </div>
    );
}