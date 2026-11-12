import { RotateCcw } from 'lucide-react';

import { ParameterControl } from '@/components/shared/parameter-control';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    MAX_GAIN,
    MAX_TAU,
    MIN_GAIN,
    MIN_TAU,
    type SensorParameters,
} from '@/features/superposition/domain/superposition';

interface SensorControlsProps {
    sensor: SensorParameters;
    onSensorChange: (changes: Partial<SensorParameters>) => void;
    onReset: () => void;
}

export function SensorControls({ sensor, onSensorChange, onReset }: SensorControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">First-order sensor</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset superposition experiment"
                        title="Reset experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>τ dy/dt + y = K x(t), starting at rest.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-7">
                <ParameterControl
                    id="superposition-gain"
                    label="Sensor gain (K)"
                    value={sensor.gain}
                    min={MIN_GAIN}
                    max={MAX_GAIN}
                    step={0.1}
                    unit=""
                    description="Scales every component equally."
                    onChange={(gain) => onSensorChange({ gain })}
                />

                <ParameterControl
                    id="superposition-tau"
                    label="Time constant (τ)"
                    value={sensor.tau}
                    min={MIN_TAU}
                    max={MAX_TAU}
                    step={0.01}
                    unit="s"
                    description={`ωc = ${(1 / sensor.tau).toFixed(2)} rad/s`}
                    onChange={(tau) => onSensorChange({ tau })}
                />
            </CardContent>
        </Card>
    );
}
