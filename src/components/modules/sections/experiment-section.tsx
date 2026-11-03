
import type { ReactNode } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading.tsx';

interface SharedExperimentSectionProps {
    description: string;
    controls: ReactNode;
    analysis: ReactNode;
}

export function SharedExperimentSection({
                                      description,
                                      controls,
                                      analysis,
                                  }: SharedExperimentSectionProps) {
    return (
        <section
            id="experiment"
            className="scroll-mt-24 space-y-3"
        >
            <SectionHeading
                title="Interactive experiment"
                icon={SlidersHorizontal}
            />

            <p className="text-sm leading-6 text-muted-foreground">
                {description}
            </p>

            <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="min-w-0">
                    {controls}
                </div>

                <div className="min-w-0">
                    {analysis}
                </div>
            </div>
        </section>
    );
}
