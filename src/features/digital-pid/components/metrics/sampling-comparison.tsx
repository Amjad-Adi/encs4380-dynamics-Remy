import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMetric, type StepResponseMetrics } from '@/features/control/domain';

interface SamplingComparisonProps {
    digital: StepResponseMetrics;
    continuous: StepResponseMetrics;
    sampleTime: number;
}

const ROWS: {
    key: keyof Pick<
        StepResponseMetrics,
        'riseTime' | 'percentageOvershoot' | 'settlingTime' | 'steadyStateError'
    >;
    label: string;
    unit: string;
    digits: number;
}[] = [
    { key: 'riseTime', label: 'Rise time', unit: 's', digits: 3 },
    { key: 'percentageOvershoot', label: 'Overshoot', unit: '%', digits: 2 },
    { key: 'settlingTime', label: 'Settling time', unit: 's', digits: 3 },
    { key: 'steadyStateError', label: 'Steady-state error', unit: '', digits: 4 },
];

function formatChange(change: number, digits: number) {
    const text = formatMetric(change, digits);
    return change > 0 && Number(text) !== 0 ? `+${text}` : text;
}

/** Digital loop at Ts against the continuous P1 loop with the same plant and gains. */
export function SamplingComparison({ digital, continuous, sampleTime }: SamplingComparisonProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Effect of sampling</CardTitle>
                <CardDescription>
                    The continuous column is the P1 controller on the same plant, gains and limits
                    (the Ts → 0 limit). Both columns use the shared metric calculation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[320px] text-sm">
                        <thead>
                            <tr className="text-muted-foreground border-b text-left text-xs">
                                <th className="py-2 pr-3 font-medium">Metric</th>
                                <th className="py-2 pr-3 text-right font-medium">
                                    Digital (Ts = {sampleTime} s)
                                </th>
                                <th className="py-2 pr-3 text-right font-medium">Continuous</th>
                                <th className="py-2 text-right font-medium">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ROWS.map((row) => {
                                const a = digital[row.key];
                                const b = continuous[row.key];
                                const change = a !== null && b !== null ? a - b : null;
                                return (
                                    <tr key={row.key} className="border-b last:border-0">
                                        <td className="py-2 pr-3">
                                            {row.label}
                                            {row.unit && (
                                                <span className="text-muted-foreground">
                                                    {' '}
                                                    ({row.unit})
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 pr-3 text-right font-mono tabular-nums">
                                            {formatMetric(a, row.digits)}
                                        </td>
                                        <td className="py-2 pr-3 text-right font-mono tabular-nums">
                                            {formatMetric(b, row.digits)}
                                        </td>
                                        <td className="text-muted-foreground py-2 text-right font-mono tabular-nums">
                                            {change === null
                                                ? '—'
                                                : formatChange(change, row.digits)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
