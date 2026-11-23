import { useMemo, useState } from 'react';
import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DEFAULT_FIRST_ORDER_PLANT,
    DEFAULT_SECOND_ORDER_PLANT,
    formatMetric,
    getStepResponseMetrics,
    simulateContinuousPID,
    simulateDigitalPID,
    type Plant,
    type PlantType,
    type StepResponseMetrics,
} from '@/features/control/domain';

const GAINS = { kp: 6, ki: 6, kd: 0.5 };
const LIMITS = { min: -20, max: 20 };
const SETPOINT = 1;
const DURATION = 8;

interface Row {
    id: string;
    module: string;
    engine: string;
    color: string;
    dash?: 'dash' | 'dot';
    points: { time: number; output: number }[];
    metrics: StepResponseMetrics;
}

function runAll(plant: Plant): Row[] {
    const base = { plant, gains: GAINS, setpoint: SETPOINT, limits: LIMITS };
    const p1 = simulateContinuousPID(base, DURATION, 2001).points;
    const p2 = simulateContinuousPID({ ...base, sensorTau: 0.001 }, DURATION, 2001).points.map(
        (point) => ({ time: point.time, output: point.output }),
    );
    const p3Fast = simulateDigitalPID({
        ...base,
        sampleTime: 0.001,
        duration: DURATION,
    }).trajectory;
    const p3Slow = simulateDigitalPID({ ...base, sampleTime: 0.1, duration: DURATION }).trajectory;

    return [
        {
            id: 'p1',
            module: 'P1 · PID playground',
            engine: 'Continuous loop, ideal sensor',
            color: '#159b98',
            points: p1,
            metrics: getStepResponseMetrics(p1, SETPOINT),
        },
        {
            id: 'p2',
            module: 'P2 · Slow sensor',
            engine: 'Continuous loop, τs = 1 ms',
            color: '#3978c5',
            dash: 'dash',
            points: p2,
            metrics: getStepResponseMetrics(p2, SETPOINT),
        },
        {
            id: 'p3-fast',
            module: 'P3 · Digital PID',
            engine: 'Sampled loop, Ts = 1 ms',
            color: '#8a70c5',
            dash: 'dot',
            points: p3Fast,
            metrics: getStepResponseMetrics(p3Fast, SETPOINT),
        },
        {
            id: 'p3-slow',
            module: 'P3 · Digital PID',
            engine: 'Sampled loop, Ts = 100 ms',
            color: '#d65d67',
            points: p3Slow,
            metrics: getStepResponseMetrics(p3Slow, SETPOINT),
        },
    ];
}

/**
 * Runs one plant and one set of gains through the P1, P2 and P3 engines. With a
 * negligible sensor lag and a fast sample period they must agree; a slow sample
 * period shows a real, physical difference.
 */
export function ConsistencyCheck() {
    const [plantType, setPlantType] = useState<PlantType>('second-order');
    const plant: Plant = useMemo(
        () =>
            plantType === 'first-order'
                ? { type: 'first-order', ...DEFAULT_FIRST_ORDER_PLANT }
                : { type: 'second-order', ...DEFAULT_SECOND_ORDER_PLANT },
        [plantType],
    );
    const rows = useMemo(() => runAll(plant), [plant]);

    const data: Data[] = rows.map((row) => ({
        x: row.points.map((point) => point.time),
        y: row.points.map((point) => point.output),
        type: 'scatter',
        mode: 'lines',
        name: `${row.module.split(' · ')[0]} · ${row.engine.split(', ')[1] ?? row.engine}`,
        line: { color: row.color, width: row.dash ? 2 : 2.5, dash: row.dash },
    }));

    const layout: Partial<Layout> = {
        height: 320,
        margin: { l: 55, r: 20, t: 10, b: 60 },
        legend: { orientation: 'h', y: -0.28 },
        hovermode: 'x unified',
        xaxis: { title: { text: 'Time (s)' } },
        yaxis: { title: { text: 'Output y(t)' } },
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-base">
                            Same plant, same gains, three modules
                        </CardTitle>
                        <CardDescription>
                            Kp = {GAINS.kp}, Ki = {GAINS.ki}, Kd = {GAINS.kd}, limits ±{LIMITS.max},
                            r = {SETPOINT}. Computed live in your browser by the shared core.
                        </CardDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Plant model">
                        {(['first-order', 'second-order'] as const).map((type) => (
                            <Button
                                key={type}
                                type="button"
                                size="sm"
                                variant={plantType === type ? 'default' : 'outline'}
                                aria-pressed={plantType === type}
                                onClick={() => setPlantType(type)}
                            >
                                {type === 'first-order' ? 'Module 1 plant' : 'Module 3 plant'}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-2 sm:px-4">
                <ThemedPlot data={data} layout={layout} className="h-[320px] min-h-[320px]" />

                <div className="overflow-x-auto px-2 sm:px-0">
                    <table className="w-full min-w-[520px] text-sm">
                        <thead>
                            <tr className="text-muted-foreground border-b text-left text-xs">
                                <th className="py-2 pr-3 font-medium">Module</th>
                                <th className="py-2 pr-3 font-medium">Engine</th>
                                <th className="py-2 pr-3 text-right font-medium">Rise (s)</th>
                                <th className="py-2 pr-3 text-right font-medium">Overshoot (%)</th>
                                <th className="py-2 pr-3 text-right font-medium">Settling (s)</th>
                                <th className="py-2 text-right font-medium">e_ss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id} className="border-b last:border-0">
                                    <td className="py-2 pr-3 whitespace-nowrap">
                                        <span
                                            className="mr-2 inline-block size-2 rounded-full align-middle"
                                            style={{ backgroundColor: row.color }}
                                        />
                                        {row.module}
                                    </td>
                                    <td className="text-muted-foreground py-2 pr-3">
                                        {row.engine}
                                    </td>
                                    <td className="py-2 pr-3 text-right font-mono tabular-nums">
                                        {formatMetric(row.metrics.riseTime, 3)}
                                    </td>
                                    <td className="py-2 pr-3 text-right font-mono tabular-nums">
                                        {formatMetric(row.metrics.percentageOvershoot, 2)}
                                    </td>
                                    <td className="py-2 pr-3 text-right font-mono tabular-nums">
                                        {formatMetric(row.metrics.settlingTime, 3)}
                                    </td>
                                    <td className="py-2 text-right font-mono tabular-nums">
                                        {formatMetric(row.metrics.steadyStateError, 4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-muted-foreground px-2 text-xs leading-5 sm:px-0">
                    The first three rows agree to within the effect of a 1 ms lag or sample period,
                    so the modules share one plant, one PID law and one metric definition. The last
                    row shows the real cost of sampling every 100 ms instead.
                </p>
            </CardContent>
        </Card>
    );
}
