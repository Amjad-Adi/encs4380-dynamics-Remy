import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
                    The continuous column is the Module 01 controller on the same plant, gains and
                    limits (the Ts → 0 limit). Both columns use the shared metric calculation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="min-w-0">
                    <Table className="min-w-[320px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead className="text-right">
                                    Digital (Ts = {sampleTime} s)
                                </TableHead>
                                <TableHead className="text-right">Continuous</TableHead>
                                <TableHead className="text-right">Change</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ROWS.map((row) => {
                                const a = digital[row.key];
                                const b = continuous[row.key];
                                const change = a !== null && b !== null ? a - b : null;
                                return (
                                    <TableRow key={row.key}>
                                        <TableCell>
                                            {row.label}
                                            {row.unit && (
                                                <span className="text-muted-foreground">
                                                    {' '}
                                                    ({row.unit})
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {formatMetric(a, row.digits)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {formatMetric(b, row.digits)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-right font-mono tabular-nums">
                                            {change === null
                                                ? '—'
                                                : formatChange(change, row.digits)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
