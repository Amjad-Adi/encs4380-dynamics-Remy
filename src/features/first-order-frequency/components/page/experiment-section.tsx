import { FrequencyControls } from '../controls/frequency-controls.tsx';
import { FrequencyResponseAnalysis } from '../analysis/frequency-response-analysis.tsx';

import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';

interface ExperimentSectionProps {
    tau: number;
    omega: number;
    onTauChange: (value: number) => void;
    onOmegaChange: (value: number) => void;
    onReset: () => void;
}

export function ExperimentSection({
    tau,
    omega,
    onTauChange,
    onOmegaChange,
    onReset,
}: ExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Adjust the sensor time constant and sinusoidal input frequency. The time-domain signal and frequency-domain plots update immediately."
            controls={
                <FrequencyControls
                    tau={tau}
                    omega={omega}
                    onTauChange={onTauChange}
                    onOmegaChange={onOmegaChange}
                    onReset={onReset}
                />
            }
            analysis={<FrequencyResponseAnalysis tau={tau} omega={omega} />}
        />
    );
}
