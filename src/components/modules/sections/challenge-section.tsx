import type { ReactNode } from 'react';
import { Gauge } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';

interface SharedChallengeSectionProps {
    description: string;
    children: ReactNode;
}

export function SharedChallengeSection({ description, children }: SharedChallengeSectionProps) {
    return (
        <section id="challenge" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Test your understanding" icon={Gauge} />

            <p className="text-muted-foreground text-sm leading-6">{description}</p>

            {children}
        </section>
    );
}
