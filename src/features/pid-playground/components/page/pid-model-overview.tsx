import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Equation } from '@/components/modules/equation';

export function PIDModelOverview() {
    return (
        <section id="model" className="scroll-mt-24 space-y-3">
            <div className="flex items-center gap-2">
                <span className="text-primary text-sm font-semibold">01</span>
                <h2 className="text-xl font-semibold">Feedback control model</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
                A PID controller calculates an actuator command from the difference between the
                desired setpoint and the plant output. The controller and plant form a closed-loop
                system.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">PID control law</CardTitle>
                        <CardDescription>Continuous-time parallel PID controller</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Equation
                            expression={String.raw`u(t)=K_p e(t)+K_i\int_0^t e(\lambda)\,d\lambda+K_d\frac{de(t)}{dt}`}
                        />
                        <p className="text-muted-foreground text-xs leading-5">
                            The proportional term reacts to present error, the integral term
                            accumulates past error, and the derivative term reacts to the rate of
                            error change. The simulation applies D to the measured output
                            (derivative-on-measurement) to avoid an artificial derivative kick when
                            the setpoint steps.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Plant models</CardTitle>
                        <CardDescription>Select either plant from Homework 1.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-medium">
                                First-order plant
                            </p>
                            <Equation expression={String.raw`G(s)=\frac{K}{\tau s+1}`} />
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-medium">
                                Second-order physical plant
                            </p>
                            <Equation expression={String.raw`G(s)=\frac{1}{ms^2+bs+k}`} />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
                <Card size="sm">
                    <CardContent className="space-y-1">
                        <p className="font-semibold">Proportional (P)</p>
                        <p className="text-muted-foreground text-xs leading-5">
                            Increasing K<sub>p</sub> generally speeds up the response and reduces
                            step error, but can increase overshoot. P-only control usually leaves a
                            nonzero steady-state error.
                        </p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="space-y-1">
                        <p className="font-semibold">Integral (I)</p>
                        <p className="text-muted-foreground text-xs leading-5">
                            The accumulated error drives the step steady-state error to zero for a
                            stable, unsaturated loop. Excessive K<sub>i</sub> can increase overshoot
                            and settling time.
                        </p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="space-y-1">
                        <p className="font-semibold">Derivative (D)</p>
                        <p className="text-muted-foreground text-xs leading-5">
                            Derivative action responds to how quickly the error changes. It can add
                            damping and reduce overshoot, with little direct effect on steady-state
                            error. The derivative gain sets the strength of D action.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
