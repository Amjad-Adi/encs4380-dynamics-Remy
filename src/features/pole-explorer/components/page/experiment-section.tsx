import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';
import {
    type ComplexPole,
    type PoleCharacteristics,
    type PoleConfiguration,
    type PolePreset,
    type ResponseMetrics,
    type SystemOrder,
} from '@/features/pole-explorer/domain/pole-explorer';
import { PoleControls } from '../controls/pole-controls';
import { ResponseAnalysis } from '../analysis/response-analysis';

interface ExperimentSectionProps {
    configuration: PoleConfiguration;
    characteristics: PoleCharacteristics;
    metrics: ResponseMetrics;
    duration: number;
    onOrderChange: (order: SystemOrder) => void;
    onPresetSelect: (preset: PolePreset) => void;
    onPoleChange: (index: number, pole: ComplexPole) => void;
    onConjugatePairChange: (realPart: number, imaginaryPart: number) => void;
    onReset: () => void;
}

export function ExperimentSection({
    configuration,
    characteristics,
    metrics,
    duration,
    onOrderChange,
    onPresetSelect,
    onPoleChange,
    onConjugatePairChange,
    onReset,
}: ExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Drag the poles around the complex plane. The damping ratio, natural frequency, stability classification, and step response update immediately."
            controls={
                <PoleControls
                    configuration={configuration}
                    characteristics={characteristics}
                    onOrderChange={onOrderChange}
                    onPresetSelect={onPresetSelect}
                    onPoleChange={onPoleChange}
                    onConjugatePairChange={onConjugatePairChange}
                    onReset={onReset}
                />
            }
            analysis={
                <ResponseAnalysis
                    configuration={configuration}
                    characteristics={characteristics}
                    metrics={metrics}
                    duration={duration}
                    onPoleChange={onPoleChange}
                />
            }
        />
    );
}
