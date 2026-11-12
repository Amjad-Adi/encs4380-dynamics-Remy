import { Equation } from '@/components/modules/equation';
import { SharedModelOverview } from '@/components/modules/model-overview';

export function ModelOverview() {
    return (
        <SharedModelOverview
            items={[
                {
                    title: 'First-order pole',
                    content: <Equation expression={String.raw`G(s)=\frac{-p}{s-p}`} />,
                    description:
                        'A single real pole p gives a first-order response with time constant τ = 1/|p|.',
                },
                {
                    title: 'Second-order poles',
                    content: (
                        <Equation
                            expression={String.raw`s_{1,2}=-\zeta\omega_n\pm j\omega_n\sqrt{1-\zeta^2}`}
                        />
                    ),
                    description:
                        'Complex poles always appear as a conjugate pair, symmetric about the real axis.',
                },
                {
                    title: 'Pole-to-parameter mapping',
                    content: (
                        <Equation
                            expression={String.raw`\omega_n=\sqrt{\sigma^2+\omega_d^2},\quad \zeta=-\frac{\sigma}{\omega_n}`}
                        />
                    ),
                    description:
                        'σ is the real part, ωd is the imaginary part, and both are read directly from the s-plane.',
                },
                {
                    title: 'Standard form',
                    content: (
                        <Equation
                            expression={String.raw`G(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}`}
                        />
                    ),
                    description: 'Unit step input; the DC gain is 1 for every stable placement.',
                },
            ]}
        />
    );
}
