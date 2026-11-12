import { SharedModelOverview } from '@/components/modules/model-overview';
import { Equation } from '@/components/modules/equation';

export function ModelOverview() {
    return (
        <SharedModelOverview
            items={[
                {
                    title: 'Transfer function',
                    content: (
                        <Equation expression={String.raw`G(s)=\frac{K}{\tau s+1},\qquad K=1`} />
                    ),
                    description: 'Unity static gain.',
                },
                {
                    title: 'Amplitude ratio',
                    content: (
                        <Equation
                            expression={String.raw`M(\omega)=\frac{1}{\sqrt{1+(\omega\tau)^2}}`}
                        />
                    ),
                    description: 'Output amplitude divided by input amplitude.',
                },
                {
                    title: 'Phase response',
                    content: (
                        <Equation expression={String.raw`\phi(\omega)=-\tan^{-1}(\omega\tau)`} />
                    ),
                    description: 'Negative phase means the output lags the input.',
                },
            ]}
        />
    );
}
