import { SlidersHorizontal } from 'lucide-react';

import { FrequencyControls } from '../frequency-controls';
import { FrequencyResponseAnalysis } from '../frequency-response-analysis';
import { SectionHeading } from './section-heading';

interface ExperimentSectionProps {
    tau: number;
    omega: number;
    onTauChange: (value: number) => void;
    onOmegaChange: (value: number) => void;
    onReset: () => void;
}

export function ExperimentSection(props: ExperimentSectionProps) {
    const { tau, omega, onTauChange, onOmegaChange, onReset } = props;

    return (
        <section id="experiment" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Interactive experiment" icon={SlidersHorizontal} />
            <p className="text-sm leading-6 text-muted-foreground">
                Adjust the sensor time constant and sinusoidal input frequency.
                The time-domain signal and frequency-domain plots update immediately.
            </p>
            <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="min-w-0">
                    <FrequencyControls
                        tau={tau}
                        omega={omega}
                        onTauChange={onTauChange}
                        onOmegaChange={onOmegaChange}
                        onReset={onReset}
                    />
                </div>
                <div className="min-w-0">
                    <FrequencyResponseAnalysis tau={tau} omega={omega} />
                </div>
            </div>
        </section>
    );
}
