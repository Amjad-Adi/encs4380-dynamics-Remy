import { Shuffle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParameterControl } from '@/components/shared/parameter-control';
import type { PIDGains } from '@/features/pid-playground/domain/pid-playground';

interface TuningControlsProps {
    gains: PIDGains;
    onParameterChange: (key: keyof PIDGains, value: number) => void;
    onNewPlant: () => void;
    onReset: () => void;
}

export function TuningControls({
    gains,
    onParameterChange,
    onNewPlant,
    onReset,
}: TuningControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Controller gains</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset PID gains"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>
                    The plant is hidden. Only the gains can be changed.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-7">
                <div className="space-y-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        PID gains
                    </p>
                    <ParameterControl
                        id="tuning-kp"
                        label={<>Proportional gain-Kp</>}
                        ariaLabel="Proportional gain Kp"
                        value={gains.kp}
                        min={0}
                        max={30}
                        step={0.1}
                        unit="-"
                        description="Acts on present error"
                        onChange={(value) => onParameterChange('kp', value)}
                    />
                    <ParameterControl
                        id="tuning-ki"
                        label={<>Integral gain-Ki</>}
                        ariaLabel="Integral gain Ki"
                        value={gains.ki}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="1/s"
                        description="Accumulates past error"
                        onChange={(value) => onParameterChange('ki', value)}
                    />
                    <ParameterControl
                        id="tuning-kd"
                        label={<>Derivative gain-Kd</>}
                        ariaLabel="Derivative gain Kd"
                        value={gains.kd}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="s"
                        description="Responds to error change"
                        onChange={(value) => onParameterChange('kd', value)}
                    />
                </div>
                <div className="space-y-3 border-t pt-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Hidden plant
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={onNewPlant}
                    >
                        <Shuffle size={15} />
                        New random plant
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
