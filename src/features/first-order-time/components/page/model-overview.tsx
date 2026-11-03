import { BookOpen } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
} from '@/components/ui/card';

import { Equation } from '../equation';
import type { FirstOrderInputType } from '../../models/first-order-time';

import { SectionHeading } from './section-heading';

interface ModelOverviewProps {
    inputType: FirstOrderInputType;
}

export function ModelOverview({ inputType }: ModelOverviewProps) {
    const inputEquation =
        inputType === 'step'
            ? String.raw`x(t)=A\,u(t)`
            : String.raw`x(t)=At\,u(t)`;

    return (
        <section
            id="model"
            className="scroll-mt-24 space-y-3"
        >
            <SectionHeading
                title="Mathematical model"
                icon={BookOpen}
            />

            <Card className="overflow-hidden border-border">
                <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:p-6">
                    <div className="min-w-0 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Governing differential equation
                        </p>

                        <Equation
                            expression={String.raw`\tau \frac{dy(t)}{dt}+y(t)=Kx(t)`}
                        />
                    </div>

                    <div className="hidden h-16 w-px bg-border md:block" />

                    <div className="min-w-0 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Transfer function
                        </p>

                        <Equation
                            expression={String.raw`G(s)=\frac{Y(s)}{X(s)}=\frac{K}{\tau s+1}`}
                        />

                        <p className="text-xs text-muted-foreground">
                            Assumes zero initial conditions.
                        </p>
                    </div>

                    <div className="hidden h-16 w-px bg-border md:block" />

                    <div className="min-w-0 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Applied input
                            </p>

                            <Badge variant="outline" className="text-[10px]">
                                {inputType.toUpperCase()}
                            </Badge>
                        </div>

                        <Equation expression={inputEquation} />

                        <p className="text-xs text-muted-foreground">
                            A = input amplitude
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}