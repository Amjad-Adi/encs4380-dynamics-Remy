import { Activity, Clock3, Gauge, Target } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMetric, type StepResponseMetrics } from '@/features/control/domain';

const items = [
    { key: 'riseTime', label: 'Rise time (10–90%)', unit: 's', icon: Activity },
    { key: 'percentageOvershoot', label: 'Maximum overshoot', unit: '%', icon: Gauge },
    { key: 'settlingTime', label: 'Settling time (2%)', unit: 's', icon: Clock3 },
    { key: 'steadyStateError', label: 'Steady-state error', unit: 'units', icon: Target },
] as const;

/** Live step-response metrics card shared by P1, P3 and MySystem. */
export function PIDMetrics({
    metrics,
    steadyStateTarget,
    title = 'Live performance metrics',
}: {
    metrics: StepResponseMetrics;
    steadyStateTarget: number;
    title?: string;
}) {
    const values: Record<(typeof items)[number]['key'], number | null> = {
        riseTime: metrics.riseTime,
        percentageOvershoot: metrics.percentageOvershoot,
        settlingTime: metrics.settlingTime,
        steadyStateError: metrics.steadyStateError,
    };
    const referenceText =
        metrics.reference === 'setpoint' ? 'the setpoint' : 'the final value y(∞)';

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">{title}</CardTitle>
                <p className="text-muted-foreground text-xs">
                    Calculated from the simulated response with the shared Control metrics. Rise,
                    overshoot and the ±2% settling band are measured against {referenceText};
                    steady-state error is r − y(∞).
                </p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {items.map(({ key, label, unit, icon: Icon }) => {
                    const value = values[key];
                    return (
                        <div key={key} className="bg-muted/50 min-w-0 rounded-lg p-3">
                            <div className="text-muted-foreground flex items-start gap-2 text-xs">
                                <Icon size={14} className="mt-px shrink-0" />
                                <span className="min-w-0">{label}</span>
                            </div>
                            <p className="mt-2 font-mono text-lg font-semibold break-words tabular-nums sm:text-xl">
                                {formatMetric(
                                    value,
                                    key === 'percentageOvershoot' ? 2 : 3,
                                    'Not reached',
                                )}
                            </p>
                            {value !== null && (
                                <span className="text-muted-foreground text-[11px]">{unit}</span>
                            )}
                        </div>
                    );
                })}
                <div className="text-muted-foreground col-span-2 flex flex-wrap gap-x-4 gap-y-1 text-xs xl:col-span-4">
                    <span>
                        Peak output:{' '}
                        <span className="text-foreground font-mono">
                            {formatMetric(metrics.peakOutput, 4)}
                        </span>
                    </span>
                    <span>
                        Final value:{' '}
                        <span className="text-foreground font-mono">
                            {formatMetric(metrics.finalValue, 4)}
                        </span>
                    </span>
                    <span>
                        Setpoint:{' '}
                        <span className="text-foreground font-mono">
                            {steadyStateTarget.toFixed(3)}
                        </span>
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
