
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';

import { Equation } from '../../../../components/modules/equation.tsx';
import { generateErrorFractionData } from '@/features/first-order-time/domain/first-order-time.ts';
import { ErrorFractionChart } from '../charts/error-fraction-chart.tsx';

interface ErrorFractionAnalysisProps {
    tau: number;
}

export function ErrorFractionAnalysis({
                                          tau,
                                      }: ErrorFractionAnalysisProps) {
    const naturalLogSlope = -1 / tau;
    const log10Slope = naturalLogSlope / Math.LN10;

    const plottedPoints = generateErrorFractionData(tau);
    const firstPoint = plottedPoints[0];
    const lastPoint = plottedPoints[plottedPoints.length - 1];

    const calculatedSlope =
        (lastPoint.logarithm - firstPoint.logarithm) /
        (lastPoint.time - firstPoint.time);

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">
                    Error-fraction analysis
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    The remaining step-response error decays exponentially.
                    Its natural logarithm is a straight line.
                </p>
            </div>

            <Card>
                <CardContent className="grid gap-5 p-4 md:grid-cols-[minmax(0,1fr)_240px] md:items-center md:p-6">
                    <div className="min-w-0">
                        <ErrorFractionChart tau={tau} />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Error fraction
                            </p>

                            <Equation
                                expression={String.raw`e_f(t)=e^{-t/\tau}`}
                            />
                        </div>

                        <Separator />

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Linearized equation
                            </p>

                            <Equation
                                expression={String.raw`\ln(e_f(t))=-\frac{t}{\tau}`}
                            />
                        </div>

                        <div className="rounded-lg bg-accent p-3">
                            <p className="text-xs text-accent-foreground">
                                Theoretical slope, d ln(e_f)/dt
                            </p>

                            <p className="mt-1 font-mono text-xl font-semibold text-accent-foreground">
                                {naturalLogSlope.toFixed(4)} s⁻¹
                            </p>

                            <p className="mt-1 text-[11px] text-accent-foreground/80">
                                Calculated from the plotted curve:{' '}
                                <span className="font-mono">
                                    {calculatedSlope.toFixed(4)} s⁻¹
                                </span>
                                .
                            </p>

                            <p className="mt-1 text-[11px] text-accent-foreground/80">
                                On the logarithmic (base-10) axis this is{' '}
                                <span className="font-mono">
                                    {log10Slope.toFixed(3)} s⁻¹
                                </span>
                                .
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
