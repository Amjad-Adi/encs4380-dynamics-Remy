import { Clock3, Gauge, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Equation } from '@/components/modules/equation';
import { MetricCard } from '@/components/modules/metric-card';
import type { TuningSpec } from '@/features/tuning-challenge/domain/tuning-challenge';

export function TuningModelOverview({ spec }: { spec: TuningSpec }) {
    return (
        <section id="model" className="scroll-mt-24 space-y-3">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Challenge and specification</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
                A random plant is drawn from the Module 04 model family and kept hidden. Tune K
                <sub>p</sub>, K<sub>i</sub>, and K<sub>d</sub> using only the closed-loop response
                until every part of the specification passes.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Hidden plant</CardTitle>
                        <CardDescription>Same random generator as Guess the sensor</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Equation
                            expression={String.raw`G(s)=\frac{1}{\tau s+1}\quad\text{or}\quad G(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}`}
                        />
                        <p className="text-muted-foreground text-xs leading-5">
                            Both forms have unit steady-state gain. The model type and its τ, or ζ
                            and ωn, stay hidden until the full specification is met.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">PID control law</CardTitle>
                        <CardDescription>Same controller and RK4 loop as Module 08</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Equation
                            expression={String.raw`u(t)=K_p e(t)+K_i\int_0^t e(\lambda)\,d\lambda-K_d\frac{dy(t)}{dt}`}
                        />
                        <p className="text-muted-foreground text-xs leading-5">
                            The control signal is limited to 0–100 and D acts on the measured
                            output. Each part of the spec earns up to one third of the score; a
                            failed part keeps partial credit in proportion to limit ÷ measured.
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
                <MetricCard
                    label="Maximum overshoot"
                    value={`≤ ${spec.maxOvershoot}%`}
                    detail="Peak above the setpoint"
                    icon={Gauge}
                />
                <MetricCard
                    label="Settling time (2%)"
                    value={`≤ ${spec.maxSettlingTime} s`}
                    detail="Time to enter and stay inside ±2% of the setpoint"
                    icon={Clock3}
                />
                <MetricCard
                    label="Steady-state error"
                    value={`≤ ${spec.maxSteadyStateError * 100}%`}
                    detail="Zero within numerical tolerance, relative to the setpoint"
                    icon={Target}
                />
            </div>
        </section>
    );
}
