import { Copy, Gauge } from 'lucide-react';

import type { MotorGains } from '@/features/my-system/domain/my-system';
import { getPIEquivalentDampingRatio } from '@/features/my-system/domain/my-system';
import { ParameterControl } from '@/components/shared/parameter-control';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MotorControllerCardProps {
    side: 'left' | 'right';
    gains: MotorGains;
    plantGain: number;
    timeConstant: number;
    onChange: (gains: MotorGains) => void;
    onCopyOther: () => void;
}

export function MotorControllerCard({
    side,
    gains,
    plantGain,
    timeConstant,
    onChange,
    onCopyOther,
}: MotorControllerCardProps) {
    const dampingRatio = getPIEquivalentDampingRatio(plantGain, timeConstant, gains);
    const dampingInRange =
        dampingRatio !== null && dampingRatio >= 0.6 && dampingRatio <= 0.8;

    function updateGain(key: keyof MotorGains, value: number) {
        onChange({ ...gains, [key]: value });
    }

    return (
        <Card className="min-w-0">
            <CardHeader className="gap-2">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base capitalize">{side} motor controller</CardTitle>
                    <Badge variant="outline">{side === 'left' ? 'Loop 1' : 'Loop 2'}</Badge>
                </div>
                <CardDescription>
                    Independently tune the speed loop using its own encoder feedback.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ParameterControl
                    id={`${side}-kp`}
                    label="Proportional gain (Kp)"
                    ariaLabel={`${side} motor proportional gain`}
                    value={gains.kp}
                    min={0}
                    max={0.02}
                    step={0.0001}
                    unit="PWM/RPM"
                    description="Immediate correction from speed error"
                    onChange={(value) => updateGain('kp', value)}
                />
                <ParameterControl
                    id={`${side}-ki`}
                    label="Integral gain (Ki)"
                    ariaLabel={`${side} motor integral gain`}
                    value={gains.ki}
                    min={0}
                    max={0.2}
                    step={0.001}
                    unit="PWM/(RPM·s)"
                    description="Removes persistent speed error"
                    onChange={(value) => updateGain('ki', value)}
                />
                <ParameterControl
                    id={`${side}-kd`}
                    label="Derivative gain (Kd)"
                    ariaLabel={`${side} motor derivative gain`}
                    value={gains.kd}
                    min={0}
                    max={0.01}
                    step={0.0001}
                    unit="PWM·s/RPM"
                    description="Damps rapid changes in measured speed"
                    onChange={(value) => updateGain('kd', value)}
                />

                <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <Gauge size={15} className="text-primary" />
                        <div>
                            <p className="text-xs font-medium">PI-equivalent damping ratio</p>
                            <p className="text-muted-foreground text-[11px]">
                                Valid when Kd = 0
                            </p>
                        </div>
                    </div>
                    {dampingRatio === null ? (
                        <Badge variant="outline">Not applicable</Badge>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold">
                                {dampingRatio.toFixed(3)}
                            </span>
                            <Badge
                                variant="outline"
                                className={
                                    dampingInRange
                                        ? 'border-success/30 bg-success/5 text-success'
                                        : 'border-border'
                                }
                            >
                                {dampingInRange ? 'Within 0.6–0.8' : 'Outside target'}
                            </Badge>
                        </div>
                    )}
                </div>

                <Button type="button" variant="outline" size="sm" onClick={onCopyOther}>
                    <Copy size={14} />
                    Copy other motor gains
                </Button>
            </CardContent>
        </Card>
    );
}
