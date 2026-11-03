import { BookOpen } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Equation } from '@/features/first-order-time/components/equation';

import { SectionHeading } from './section-heading';

export function ModelOverview() {
    return (
        <section id="model" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Mathematical model" icon={BookOpen} />
            <Card className="overflow-hidden border-border">
                <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:p-6">
                    <div className="min-w-0 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Transfer function
                        </p>
                        <Equation expression={String.raw`G(s)=\frac{K}{\tau s+1},\qquad K=1`} />
                        <p className="text-xs text-muted-foreground">Unity static gain.</p>
                    </div>
                    <div className="hidden h-16 w-px bg-border md:block" />
                    <div className="min-w-0 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Amplitude ratio
                        </p>
                        <Equation expression={String.raw`M(\omega)=\frac{1}{\sqrt{1+(\omega\tau)^2}}`} />
                        <p className="text-xs text-muted-foreground">Output amplitude divided by input amplitude.</p>
                    </div>
                    <div className="hidden h-16 w-px bg-border md:block" />
                    <div className="min-w-0 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Phase response
                        </p>
                        <Equation expression={String.raw`\phi(\omega)=-\tan^{-1}(\omega\tau)`} />
                        <p className="text-xs text-muted-foreground">Negative phase means the output lags the input.</p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
