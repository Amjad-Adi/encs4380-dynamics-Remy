import {
    Clock3,
    Gauge,
} from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';

import { Equation } from '../../../../components/modules/equation.tsx';

interface RampAnalysisProps {
    rampError: number;
    rampLag: number;
}

interface RampResultCardProps {
    title: string;
    description: string;
    value: string;
    unit: string;
    equation: string;
    explanation: string;
    icon: typeof Gauge;
}

function RampResultCard({
                            title,
                            description,
                            value,
                            unit,
                            equation,
                            explanation,
                            icon: Icon,
                        }: RampResultCardProps) {
    return (
        <Card className="min-w-0">
            <CardHeader>
                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-accent p-2 text-accent-foreground">
                        <Icon size={19} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base">
                            {title}
                        </CardTitle>

                        <CardDescription className="mt-1">
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="rounded-xl border bg-muted/40 p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                        Mathematical relationship
                    </p>

                    <Equation expression={equation} />
                </div>

                <div>
                    <p className="text-xs text-muted-foreground">
                        Calculated result
                    </p>

                    <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
                        {value}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {unit}
                        </span>
                    </p>
                </div>

                <p className="border-t pt-3 text-sm leading-6 text-muted-foreground">
                    {explanation}
                </p>
            </CardContent>
        </Card>
    );
}

export function RampAnalysis({
                                 rampError,
                                 rampLag,
                             }: RampAnalysisProps) {
    return (
        <section className="grid min-w-0 gap-4 lg:grid-cols-2">
            <RampResultCard
                title="Steady-state tracking error"
                description="The difference between the ideal ramp and the actual output."
                value={rampError.toFixed(4)}
                unit="units"
                equation={String.raw`e_{ss}=KA\tau`}
                explanation="For a ramp input with slope A, the output eventually trails the ideal output by KAτ. Increasing the time constant increases the tracking error."
                icon={Gauge}
            />

            <RampResultCard
                title="Equivalent time lag"
                description="The delay between the ideal ramp and the actual output."
                value={rampLag.toFixed(3)}
                unit="s"
                equation={String.raw`y(t)\approx KA(t-\tau)`}
                explanation="After the transient decays, the output behaves like a delayed version of the ideal ramp. The equivalent delay equals τ and is independent of gain and ramp slope."
                icon={Clock3}
            />
        </section>
    );
}