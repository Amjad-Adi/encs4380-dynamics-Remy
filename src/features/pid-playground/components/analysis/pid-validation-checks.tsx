import { CheckCircle2, CircleHelp } from 'lucide-react';
import { Equation } from '@/components/modules/equation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PIDValidationChecks() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Reference validation checks</CardTitle>
                <CardDescription>
                    Expected results for the first-order plant K = 1 and τ = 1 s.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1 text-sm">
                        <p className="font-medium">
                            P-only: K<sub>p</sub> = 9
                        </p>
                        <p className="text-muted-foreground leading-5">
                            Closed-loop time constant and step steady-state error fraction:
                        </p>
                        <Equation
                            className="!py-0"
                            expression={String.raw`\tau_{\mathrm{cl}}=\frac{\tau}{1+KK_p}=0.1\,\mathrm{s}`}
                        />
                        <Equation
                            className="!py-0"
                            expression={String.raw`\frac{e_{\mathrm{ss}}}{r}=\frac{1}{1+KK_p}=10\%`}
                        />
                    </div>
                </div>
                <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1 text-sm">
                        <p className="font-medium">
                            PI: K<sub>p</sub> = 1 and K<sub>i</sub> = 1
                        </p>
                        <p className="text-muted-foreground leading-5">
                            The equivalent closed-loop second-order parameters are:
                        </p>
                        <Equation
                            className="!py-0"
                            expression={String.raw`\omega_n=\sqrt{\frac{KK_i}{\tau}}=1\,\mathrm{rad/s}`}
                        />
                        <Equation
                            className="!py-0"
                            expression={String.raw`\zeta=\frac{1+KK_p}{2\sqrt{\tau KK_i}}=1`}
                        />
                        <p className="text-muted-foreground leading-5">(critically damped).</p>
                    </div>
                </div>
                <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <CircleHelp className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0 text-sm">
                        <p className="font-medium">Any PI controller</p>
                        <p className="text-muted-foreground mt-1 leading-5">
                            For a stable closed loop with a step reference and sufficient actuator
                            authority, integral action drives the steady-state error to zero.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
