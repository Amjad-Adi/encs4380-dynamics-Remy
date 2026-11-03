import type { LucideIcon } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

interface SectionHeadingProps {
    title: string;
    icon: LucideIcon;
}

export function SectionHeading({
                                   title,
                                   icon: Icon,
                               }: SectionHeadingProps) {
    return (
        <div className="flex items-center gap-2">
            <Icon
                size={16}
                className="shrink-0 text-primary"
            />

            <h2 className="text-sm font-semibold tracking-tight">
                {title}
            </h2>

            <Separator className="flex-1" />
        </div>
    );
}