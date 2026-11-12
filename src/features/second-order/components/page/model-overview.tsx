import { Equation } from '@/components/modules/equation';
import { SharedModelOverview } from '@/components/modules/model-overview';

export function ModelOverview() {
    return (
        <SharedModelOverview
            items={[
                {
                    title: 'Physical equation',
                    content: <Equation expression={String.raw`m\ddot{x}+b\dot{x}+kx=F(t)`} />,
                    description: 'Force input F(t), displacement output x(t).',
                },
                {
                    title: 'Transfer function',
                    content: (
                        <Equation
                            expression={String.raw`G(s)=\frac{X(s)}{F(s)}=\frac{1}{ms^2+bs+k}`}
                        />
                    ),
                    description: 'Zero initial displacement and velocity.',
                },
                {
                    title: 'Standard form',
                    content: (
                        <Equation
                            expression={String.raw`\omega_n=\sqrt{\frac{k}{m}},\quad\zeta=\frac{b}{2\sqrt{mk}},\quad kG(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}`}
                        />
                    ),
                    description: 'A unit-force step settles to 1/k; kx(t) is normalized to 1.',
                },
            ]}
        />
    );
}
