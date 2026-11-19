import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';

import type { SlowSensorPIDResponsePoint } from '../../domain/slow-sensor-pid.ts';

interface ControllerBehaviorProps {
    crossingPoint: SlowSensorPIDResponsePoint | null;
}

function formatValue(value: number): string {
    return Number.isFinite(value) ? value.toFixed(3) : '-';
}

export function ControllerBehavior({ crossingPoint }: ControllerBehaviorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Controller behavior at setpoint crossing</CardTitle>
                <CardDescription>
                    Inspect what the controller sees at the first instant the true plant output
                    reaches the setpoint.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {crossingPoint ? (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">Crossing time</p>
                                <p className="text-lg font-semibold tabular-nums">
                                    {crossingPoint.time.toFixed(3)} s
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">True plant output</p>
                                <p className="text-lg font-semibold tabular-nums">
                                    {formatValue(crossingPoint.trueOutput)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">Sensor measurement</p>
                                <p className="text-lg font-semibold tabular-nums">
                                    {formatValue(crossingPoint.measuredOutput)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">Controller error</p>
                                <p className="text-lg font-semibold tabular-nums">
                                    {formatValue(crossingPoint.error)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/50 mt-4 rounded-lg p-3">
                            <p className="text-sm leading-6">
                                {crossingPoint.error > 0
                                    ? 'The true plant output has reached the setpoint, but the sensor still reports a lower value. The controller therefore sees a positive error and continues requesting a positive control action.'
                                    : crossingPoint.error < 0
                                      ? 'The true plant output has reached the setpoint, while the sensor reports a value above it. The controller therefore sees a negative error and requests a corrective reduction.'
                                      : 'At this crossing, the measured output matches the setpoint, so the proportional and integral error signal is momentarily zero.'}
                            </p>
                            <p className="text-muted-foreground mt-2 text-xs tabular-nums">
                                Controller command u(t): {formatValue(crossingPoint.control)}
                                {' · '}
                                Sensor-to-plant gap: {formatValue(
                                    crossingPoint.trueOutput - crossingPoint.measuredOutput,
                                )}
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="text-muted-foreground text-sm leading-6">
                        The true plant output does not reach the setpoint during this simulation
                        window. Adjust the setpoint, plant, or controller parameters to observe the
                        crossing behavior.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
