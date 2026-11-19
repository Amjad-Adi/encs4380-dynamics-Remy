import { Activity, Clock3, Gauge, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PIDPerformanceMetrics } from '@/features/pid-playground/domain/pid-playground';

const items = [
    { key: 'riseTime', label: 'Rise time (10–90%)', unit: 's', icon: Activity },
    { key: 'percentageOvershoot', label: 'Maximum overshoot', unit: '%', icon: Gauge },
    { key: 'settlingTime', label: 'Settling time (2%)', unit: 's', icon: Clock3 },
    { key: 'steadyStateError', label: 'Steady-state error', unit: 'units', icon: Target },
] as const;

export function PIDMetrics({
    metrics,
    steadyStateTarget,
}: {
    metrics: PIDPerformanceMetrics;
    steadyStateTarget: number;
}) {
    const values: Record<(typeof items)[number]['key'], number | null> = {
        riseTime: metrics.riseTime,
        percentageOvershoot: metrics.percentageOvershoot,
        settlingTime: metrics.settlingTime,
        steadyStateError: metrics.steadyStateError,
    };
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Live performance metrics</CardTitle>
                <p className="text-muted-foreground text-xs">
                    Calculated from the simulated response. Settling uses a ±2% band around the
                    setpoint.
                </p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {items.map(({ key, label, unit, icon: Icon }) => {
                    const value = values[key];
                    return (
                        <div key={key} className="bg-muted/50 min-w-0 rounded-lg p-3">
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <Icon size={14} />
                                {label}
                            </div>
                            <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
                                {value === null
                                    ? 'Not reached'
                                    : key === 'percentageOvershoot'
                                      ? value.toFixed(2)
                                      : value.toFixed(3)}
                            </p>
                            {value !== null && (
                                <span className="text-muted-foreground text-[11px]">{unit}</span>
                            )}
                        </div>
                    );
                })}
                <div className="text-muted-foreground col-span-2 text-xs xl:col-span-4">
                    Peak output:{' '}
                    <span className="text-foreground font-mono">
                        {metrics.peakOutput.toFixed(4)}
                    </span>
                    <span className="mx-2">·</span>Setpoint:{' '}
                    <span className="text-foreground font-mono">
                        {steadyStateTarget.toFixed(3)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
