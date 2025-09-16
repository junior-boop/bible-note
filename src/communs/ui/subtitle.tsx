import { cn } from "../../../src/lib/utils";

export default function Subtitle({ title, className }: { title: string, className?: string }) {
    return (
        <div className={cn("flex items-center justify-between mb-2", className)}>
            <h2 className="text-sm font-bold uppercase">{title}</h2>
        </div>
    );
}