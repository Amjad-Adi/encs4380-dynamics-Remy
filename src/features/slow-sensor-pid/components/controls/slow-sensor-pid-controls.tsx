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

import type { SlowSensorPIDParameters } from '@/features/slow-sensor-pid/domain/slow-sensor-pid.ts';

interface SlowSensorPIDControlsProps {
    parameters: SlowSensorPIDParameters;
    onPlantTypeChange: (plantType: SlowSensorPIDParameters['plantType']) => void;
    onParameterChange: (key: SlowSensorParameterKey, value: number) => void;
    onPlantParameterChange: (key: 'gain' | 'tau' | 'm' | 'b' | 'k', value: number) => void;
    onReset: () => void;
}

type SlowSensorParameterKey =
    | 'sensorTau'
    | 'setpoint'
    | 'outputMin'
    | 'outputMax'
    | 'kp'
    | 'ki'
    | 'kd';

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
                <div className="space-y-3">
                    <p className="text-sm font-medium">Plant model</p>
                    <div className="grid grid-cols-2 gap-2">
                        {([
                            { value: 'first-order', label: 'First-order' },
                            { value: 'second-order', label: 'Second-order' },
                        ] as const).map((option) => (
                            <Button
                                key={option.value}
                                type="button"
                                size="sm"
                                variant={parameters.plantType === option.value ? 'default' : 'outline'}
                                aria-pressed={parameters.plantType === option.value}
                                onClick={() => onPlantTypeChange(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {parameters.plantType === 'first-order' ? (
                    <div className="space-y-5">
                        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            First-order plant
                        </p>
                        <ParameterControl
                            id="slow-pid-plant-gain"
                            label="Plant gain (K)"
                            value={parameters.firstOrder.gain}
                            min={0.1}
                            max={5}
                            step={0.1}
                            unit="-"
                            description="Plant sensitivity"
                            onChange={(value) => onPlantParameterChange('gain', value)}
                        />
                        <ParameterControl
                            id="slow-pid-plant-tau"
                            label="Plant time constant (τp)"
                            value={parameters.firstOrder.tau}
                            min={0.1}
                            max={5}
                            step={0.1}
                            unit="s"
                            description="Plant response speed"
                            onChange={(value) => onPlantParameterChange('tau', value)}
                        />
                    </div>
                ) : (
                    <div className="space-y-5">
                        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Second-order plant
                        </p>
                        <ParameterControl
                            id="slow-pid-plant-mass"
                            label="Mass (m)"
                            value={parameters.secondOrder.m}
                            min={0.1}
                            max={10}
                            step={0.1}
                            unit="kg"
                            onChange={(value) => onPlantParameterChange('m', value)}
                        />
                        <ParameterControl
                            id="slow-pid-plant-damping"
                            label="Damping (b)"
                            value={parameters.secondOrder.b}
                            min={0}
                            max={20}
                            step={0.1}
                            unit="N·s/m"
                            onChange={(value) => onPlantParameterChange('b', value)}
                        />
                        <ParameterControl
                            id="slow-pid-plant-stiffness"
                            label="Stiffness (k)"
                            value={parameters.secondOrder.k}
                            min={0.1}
                            max={100}
                            step={0.1}
                            unit="N/m"
                            onChange={(value) => onPlantParameterChange('k', value)}
                        />
                    </div>
                )}

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

                <div className="space-y-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        PID controller gains
                    </p>
                    <ParameterControl
                        id="slow-pid-kp"
                        label="Proportional gain (Kp)"
                        value={parameters.gains.kp}
                        min={0}
                        max={30}
                        step={0.1}
                        unit="-"
                        description="Acts on present error"
                        onChange={(value) => onParameterChange('kp', value)}
                    />
                    <ParameterControl
                        id="slow-pid-ki"
                        label="Integral gain (Ki)"
                        value={parameters.gains.ki}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="1/s"
                        description="Accumulates past error"
                        onChange={(value) => onParameterChange('ki', value)}
                    />
                    <ParameterControl
                        id="slow-pid-kd"
                        label="Derivative gain (Kd)"
                        value={parameters.gains.kd}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="s"
                        description="Acts on measured-output rate"
                        onChange={(value) => onParameterChange('kd', value)}
                    />
                </div>

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
