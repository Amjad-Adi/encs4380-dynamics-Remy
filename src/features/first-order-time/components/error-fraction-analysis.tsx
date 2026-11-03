
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Equation } from './equation';
import { ErrorFractionChart } from './error-fraction-chart';

interface ErrorFractionAnalysisProps {
    tau: number;
}

export function ErrorFractionAnalysis({
                                          tau,
                                      }: ErrorFractionAnalysisProps) {
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
                                Natural-log slope
                            </p>

                            <p className="mt-1 font-mono text-xl font-semibold text-accent-foreground">
                                {(-1 / tau).toFixed(4)} s⁻¹
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
