import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { ParameterControl } from '@/components/shared/parameter-control.tsx';
import { PIDGainControls } from '@/features/control/components/pid-gain-controls';
import { PlantModelControls } from '@/features/control/components/plant-model-controls';
import type { PlantParameterKey } from '@/features/control/domain';

import type { SlowSensorPIDParameters } from '@/features/slow-sensor-pid/domain/slow-sensor-pid.ts';

interface SlowSensorPIDControlsProps {
    parameters: SlowSensorPIDParameters;
    onPlantTypeChange: (plantType: SlowSensorPIDParameters['plantType']) => void;
    onParameterChange: (key: SlowSensorParameterKey, value: number) => void;
    onPlantParameterChange: (key: PlantParameterKey, value: number) => void;
    onReset: () => void;
}

type SlowSensorParameterKey =
    'sensorTau' | 'setpoint' | 'outputMin' | 'outputMax' | 'kp' | 'ki' | 'kd';

export function SlowSensorPIDControls({
    parameters,
    onPlantTypeChange,
    onParameterChange,
    onPlantParameterChange,
    onReset,
}: SlowSensorPIDControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Experiment controls</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset slow-sensor PID experiment"
                        title="Reset experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>
                    Configure the plant, sensor dynamics, controller gains, and actuator limits.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <PlantModelControls
                    idPrefix="slow-pid"
                    selection={parameters}
                    onPlantTypeChange={onPlantTypeChange}
                    onPlantParameterChange={onPlantParameterChange}
                    tauLabel="Plant time constant (τp)"
                />

                <Separator />

                <div className="space-y-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Sensor dynamics
                    </p>
                    <ParameterControl
                        id="slow-pid-sensor-tau"
                        label="Sensor time constant (τs)"
                        value={parameters.sensorTau}
                        min={0.01}
                        max={5}
                        step={0.05}
                        unit="s"
                        description="Larger values mean slower feedback"
                        onChange={(value) => onParameterChange('sensorTau', value)}
                    />
                </div>

                <Separator />

                <PIDGainControls
                    idPrefix="slow-pid"
                    title="PID controller gains"
                    gains={parameters.gains}
                    onGainChange={onParameterChange}
                />

                <Separator />

                <div className="space-y-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Reference and actuator
                    </p>
                    <ParameterControl
                        id="slow-pid-setpoint"
                        label="Setpoint (r)"
                        value={parameters.setpoint}
                        min={-5}
                        max={5}
                        step={0.1}
                        unit="units"
                        onChange={(value) => onParameterChange('setpoint', value)}
                    />
                    <ParameterControl
                        id="slow-pid-output-min"
                        label="Minimum control output"
                        value={parameters.outputMin}
                        min={-100}
                        max={100}
                        step={1}
                        unit="units"
                        onChange={(value) => onParameterChange('outputMin', value)}
                    />
                    <ParameterControl
                        id="slow-pid-output-max"
                        label="Maximum control output"
                        value={parameters.outputMax}
                        min={-100}
                        max={100}
                        step={1}
                        unit="units"
                        onChange={(value) => onParameterChange('outputMax', value)}
                    />
                    <p className="text-muted-foreground text-xs leading-5">
                        The output limits saturate the controller command sent to the plant; they do
                        not directly limit the plant output.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export type { SlowSensorParameterKey };
