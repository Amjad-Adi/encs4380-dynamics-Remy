
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';

interface SharedAnalysisSectionProps {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    description?: string;
    className?: string;
}

export function SharedAnalysisSection({
                                    title,
                                    icon,
                                    children,
                                    description,
                                    className = 'space-y-3',
                                }: SharedAnalysisSectionProps) {
    return (
        <section
            id="analysis"
            className={`scroll-mt-24 ${className}`}
        >
            <SectionHeading title={title} icon={icon} />

            {description && (
                <p className="text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            )}

            {children}
        </section>
    );
}
