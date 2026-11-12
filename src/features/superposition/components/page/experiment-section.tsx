import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';
import type {
    SensorParameters,
    SinusoidComponent,
    SuperpositionConfiguration,
} from '@/features/superposition/domain/superposition';
import { ComponentList } from '../controls/component-list';
import { SensorControls } from '../controls/sensor-controls';
import { SuperpositionAnalysis } from '../analysis/superposition-analysis';

interface ExperimentSectionProps {
    configuration: SuperpositionConfiguration;
    onSensorChange: (changes: Partial<SensorParameters>) => void;
    onComponentAdd: () => void;
    onComponentRemove: (id: number) => void;
    onComponentChange: (id: number, changes: Partial<Omit<SinusoidComponent, 'id'>>) => void;
    onReset: () => void;
}

export function ExperimentSection({
    configuration,
    onSensorChange,
    onComponentAdd,
    onComponentRemove,
    onComponentChange,
    onReset,
}: ExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Build the input from any number of sinusoids and configure the first-order sensor. Every plot, list, and metric updates immediately when a component is added, removed, or changed."
            controls={
                <div className="space-y-4">
                    <SensorControls
                        sensor={configuration.sensor}
                        onSensorChange={onSensorChange}
                        onReset={onReset}
                    />
                    <ComponentList
                        components={configuration.components}
                        sensor={configuration.sensor}
                        onAdd={onComponentAdd}
                        onRemove={onComponentRemove}
                        onChange={onComponentChange}
                    />
                </div>
            }
            analysis={<SuperpositionAnalysis configuration={configuration} />}
        />
    );
}
