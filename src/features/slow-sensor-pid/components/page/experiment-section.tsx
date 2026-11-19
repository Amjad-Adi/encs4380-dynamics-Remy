import { SharedExperimentSection } from '@/components/modules/sections/experiment-section.tsx';

import type { SlowSensorPIDParameters, SlowSensorPIDResponsePoint } from '../../domain/slow-sensor-pid.ts';
import { SensorFeedbackChart } from '../charts/sensor-feedback-chart.tsx';
import {
    SlowSensorPIDControls,
    type SlowSensorParameterKey,
} from '../controls/slow-sensor-pid-controls.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';

interface ExperimentSectionProps {
    parameters: SlowSensorPIDParameters;
    points: SlowSensorPIDResponsePoint[];
    onPlantTypeChange: (plantType: SlowSensorPIDParameters['plantType']) => void;
    onParameterChange: (key: SlowSensorParameterKey, value: number) => void;
    onPlantParameterChange: (key: 'gain' | 'tau' | 'm' | 'b' | 'k', value: number) => void;
    onReset: () => void;
}

export function ExperimentSection({
    parameters,
    points,
    onPlantTypeChange,
    onParameterChange,
    onPlantParameterChange,
    onReset,
}: ExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Adjust the plant, sensor, and PID parameters. The closed-loop response updates immediately so you can compare the true plant output with the delayed sensor measurement."
            controls={
                <SlowSensorPIDControls
                    parameters={parameters}
                    onPlantTypeChange={onPlantTypeChange}
                    onParameterChange={onParameterChange}
                    onPlantParameterChange={onPlantParameterChange}
                    onReset={onReset}
                />
            }
            analysis={
                <Card className="min-w-0 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-base">Closed-loop response</CardTitle>
                        <CardDescription>
                            Compare the setpoint, true plant output, and delayed sensor measurement.
                            The controller command uses the right-hand axis to show how the PID
                            responds to the delayed feedback signal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="min-w-0">
                        <SensorFeedbackChart points={points} />
                    </CardContent>
                </Card>
            }
        />
    );
}
