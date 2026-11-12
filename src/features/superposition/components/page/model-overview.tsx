import { Equation } from '@/components/modules/equation';
import { SharedModelOverview } from '@/components/modules/model-overview';

export function ModelOverview() {
    return (
        <SharedModelOverview
            items={[
                {
                    title: 'Sinusoidal component',
                    content: (
                        <Equation expression={String.raw`x_i(t)=A_i\sin(\omega_i t+\phi_i)`} />
                    ),
                    description: 'Each component has its own amplitude, frequency, and phase.',
                },
                {
                    title: 'Combined input',
                    content: <Equation expression={String.raw`x(t)=\sum_{i} x_i(t)`} />,
                    description: 'The sensor input is the sum of every active component.',
                },
                {
                    title: 'Per-component response',
                    content: (
                        <Equation
                            expression={String.raw`M_i=\frac{1}{\sqrt{1+(\omega_i\tau)^2}},\quad \phi_{lag,i}=-\tan^{-1}(\omega_i\tau)`}
                        />
                    ),
                    description: 'Higher ω gives smaller M and a phase lag closer to −90°.',
                },
                {
                    title: 'Standard form',
                    content: (
                        <Equation
                            expression={String.raw`\tau\frac{dy(t)}{dt}+y(t)=Kx(t)\;\Rightarrow\; y(t)=\sum_i \Big[KA_iM_i\sin(\omega_i t+\phi_i+\phi_{lag,i})-C_i e^{-t/\tau}\Big]`}
                        />
                    ),
                    description:
                        'The sensor is linear, so each component is attenuated and delayed independently. Starting at rest, y(0) = 0, so each C_i cancels its steady-state value at t = 0 and the transient decays with τ.',
                },
            ]}
        />
    );
}
