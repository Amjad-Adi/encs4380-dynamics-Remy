import { RotateCcw } from 'lucide-react';

import { ParameterControl } from '@/components/shared/parameter-control';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PIDGainControls } from '@/features/control/components/pid-gain-controls';
import { PlantModelControls } from '@/features/control/components/plant-model-controls';
import { updatePlantSelection } from '@/features/control/domain';

import { SAMPLE_TIME_RANGE } from '../../domain/pid-simulation';
import type { DigitalPIDParameters } from '../../domain/pid-types';

interface PIDControlsProps {
    parameters: DigitalPIDParameters;
    onChange: (update: (current: DigitalPIDParameters) => DigitalPIDParameters) => void;
    onReset: () => void;
}

export function PIDControls({ parameters, onChange, onReset }: PIDControlsProps) {
    const set = <K extends keyof DigitalPIDParameters>(key: K, value: DigitalPIDParameters[K]) =>
        onChange((current) => ({ ...current, [key]: value }));

    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Controller and plant</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset digital PID experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>
                    Same plants and PID law as P1; the controller now runs every Ts seconds.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-7">
                <div className="space-y-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Sampling
                    </p>
                    <ParameterControl
                        id="digital-pid-sample-time"
                        label="Sample period (Ts)"
                        value={parameters.sampleTime}
                        {...SAMPLE_TIME_RANGE}
                        unit="s"
                        description={`fs = ${(1 / parameters.sampleTime).toFixed(parameters.sampleTime < 0.01 ? 0 : 1)} Hz`}
                        onChange={(value) => set('sampleTime', value)}
                    />
                </div>

                <div className="border-t pt-6">
                    <PlantModelControls
                        idPrefix="digital-pid"
                        selection={parameters}
                        onPlantTypeChange={(plantType) => set('plantType', plantType)}
                        onPlantParameterChange={(key, value) =>
                            onChange((current) => ({
                                ...current,
                                ...updatePlantSelection(current, key, value),
                            }))
                        }
                    />
                </div>

                <div className="border-t pt-6">
                    <PIDGainControls
                        idPrefix="digital-pid"
                        gains={parameters.gains}
                        onGainChange={(key, value) =>
                            onChange((current) => ({
                                ...current,
                                gains: { ...current.gains, [key]: value },
                            }))
                        }
                    />
                </div>

                <div className="space-y-6 border-t pt-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Reference, run and actuator
                    </p>
                    <ParameterControl
                        id="digital-pid-setpoint"
                        label="Setpoint"
                        value={parameters.setpoint}
                        min={0.1}
                        max={5}
                        step={0.1}
                        unit="units"
                        onChange={(value) => set('setpoint', value)}
                    />
                    <ParameterControl
                        id="digital-pid-duration"
                        label="Duration"
                        value={parameters.duration}
                        min={1}
                        max={30}
                        step={0.5}
                        unit="s"
                        onChange={(value) => set('duration', value)}
                    />
                    <ParameterControl
                        id="digital-pid-output-min"
                        label="Minimum control output"
                        value={parameters.outputLimits.min}
                        min={-100}
                        max={0}
                        step={1}
                        unit="units"
                        onChange={(value) =>
                            onChange((current) => ({
                                ...current,
                                outputLimits: { ...current.outputLimits, min: value },
                            }))
                        }
                    />
                    <ParameterControl
                        id="digital-pid-output-max"
                        label="Maximum control output"
                        value={parameters.outputLimits.max}
                        min={1}
                        max={100}
                        step={1}
                        unit="units"
                        onChange={(value) =>
                            onChange((current) => ({
                                ...current,
                                outputLimits: { ...current.outputLimits, max: value },
                            }))
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
