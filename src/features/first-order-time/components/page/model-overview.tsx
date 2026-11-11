import { Badge } from '@/components/ui/badge';

import { SharedModelOverview } from '@/components/modules/model-overview';
import { Equation } from '@/components/modules/equation';

import type { FirstOrderInputType } from '@/features/first-order-time/domain/first-order-time';

interface ModelOverviewProps {
    inputType: FirstOrderInputType;
}

export function ModelOverview({ inputType }: ModelOverviewProps) {
    const inputEquation =
        inputType === 'step' ? String.raw`x(t)=A\,u(t)` : String.raw`x(t)=At\,u(t)`;

    return (
        <SharedModelOverview
            items={[
                {
                    title: 'Governing differential equation',
                    content: <Equation expression={String.raw`\tau \frac{dy(t)}{dt}+y(t)=Kx(t)`} />,
                },
                {
                    title: 'Transfer function',
                    content: (
                        <Equation
                            expression={String.raw`G(s)=\frac{Y(s)}{X(s)}=\frac{K}{\tau s+1}`}
                        />
                    ),
                    description: 'Assumes zero initial conditions.',
                },
                {
                    title: 'Applied input',
                    badge: inputType.toUpperCase(),
                    content: <Equation expression={inputEquation} />,
                    description: inputType === 'step' ? 'A = step amplitude' : 'A = ramp slope',
                },
            ]}
        />
    );
}
