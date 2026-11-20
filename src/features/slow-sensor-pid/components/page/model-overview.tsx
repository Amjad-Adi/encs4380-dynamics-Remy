import { Equation } from '@/components/modules/equation.tsx';
import { SharedModelOverview } from '@/components/modules/model-overview.tsx';

import type { SlowSensorPIDParameters } from '@/features/slow-sensor-pid/domain/slow-sensor-pid.ts';

interface ModelOverviewProps {
    plantType: SlowSensorPIDParameters['plantType'];
}

export function ModelOverview({ plantType }: ModelOverviewProps) {
    const plantEquation =
        plantType === 'first-order'
            ? String.raw`G_p(s)=\frac{K}{\tau_p s+1}`
            : String.raw`G_p(s)=\frac{1}{ms^2+bs+k}`;
    const plantDifferentialEquation =
        plantType === 'first-order'
            ? String.raw`\tau_p\frac{dy(t)}{dt}+y(t)=Ku(t)`
            : String.raw`m\frac{d^2y(t)}{dt^2}+b\frac{dy(t)}{dt}+ky(t)=u(t)`;

    return (
        <SharedModelOverview
            items={[
                {
                    title: 'Feedback controller',
                    content: (
                        <div className="space-y-2">
                            <Equation expression={String.raw`e(t)=r(t)-y_m(t)`} />
                            <Equation
                                expression={String.raw`u^*(t)=K_p e(t)+K_i\int_0^t e(\lambda)\,d\lambda-K_d\frac{dy_m(t)}{dt}`}
                            />
                            <Equation
                                expression={String.raw`u(t)=\operatorname{sat}_{[u_{\min},u_{\max}]}\!\left(u^*(t)\right)`}
                            />
                        </div>
                    ),
                    description:
                        'The controller uses the sensor measurement. Derivative action is applied to the measured output (derivative-on-measurement).',
                },
                {
                    title: 'Sensor dynamics',
                    content: (
                        <div className="space-y-2">
                            <Equation
                                expression={String.raw`\tau_s\frac{dy_m(t)}{dt}+y_m(t)=y(t)`}
                            />
                            <Equation
                                expression={String.raw`H_s(s)=\frac{Y_m(s)}{Y(s)}=\frac{1}{\tau_s s+1}`}
                            />
                        </div>
                    ),
                    description:
                        'The measured output approaches the true plant output gradually. A larger τs increases the feedback lag.',
                },
                {
                    title: 'Plant model',
                    content: (
                        <div className="space-y-2">
                            <Equation expression={plantDifferentialEquation} />
                            <Equation expression={plantEquation} />
                        </div>
                    ),
                    badge: plantType === 'first-order' ? 'FIRST-ORDER' : 'SECOND-ORDER',
                    description:
                        plantType === 'first-order'
                            ? 'K is the plant gain and τp is its time constant.'
                            : 'm, b, and k are mass, viscous damping, and stiffness.',
                },
            ]}
        />
    );
}
