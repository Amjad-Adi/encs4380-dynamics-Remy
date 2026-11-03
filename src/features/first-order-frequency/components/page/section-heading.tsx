import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
    title: string;
    icon?: LucideIcon;
}

export function SectionHeading({ title, icon: Icon }: SectionHeadingProps) {
    return (
        <div className="flex items-center gap-2">
            {Icon && <Icon size={18} className="text-primary" aria-hidden="true" />}
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>
    );
}
