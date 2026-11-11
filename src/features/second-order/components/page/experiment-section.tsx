import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';
import { SecondOrderControls } from '../controls/second-order-controls';
import { ResponseAnalysis } from '../analysis/response-analysis';
import type { PhysicalParameters, ResponseMetrics } from '@/features/second-order/domain';

interface ExperimentSectionProps {
    parameters: PhysicalParameters;
    metrics: ResponseMetrics;
    duration: number;
    dampingRatio: number;
    naturalFrequency: number;
    onParameterChange: (key: keyof PhysicalParameters, value: number) => void;
    onReset: () => void;
}

export function ExperimentSection({
    parameters,
    metrics,
    duration,
    dampingRatio,
    naturalFrequency,
    onParameterChange,
    onReset,
}: ExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Change the physical system parameters to observe the live force-step response, response metrics, and pole locations."
            controls={
                <SecondOrderControls
                    parameters={parameters}
                    onParameterChange={onParameterChange}
                    onReset={onReset}
                />
            }
            analysis={
                <ResponseAnalysis
                    parameters={parameters}
                    metrics={metrics}
                    duration={duration}
                    dampingRatio={dampingRatio}
                    naturalFrequency={naturalFrequency}
                />
            }
        />
    );
}
