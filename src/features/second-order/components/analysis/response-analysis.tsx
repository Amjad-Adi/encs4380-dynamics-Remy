import { Activity, Clock3, Gauge, TrendingUp } from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PoleChart } from '../charts/pole-chart';
import { StepResponseChart } from '../charts/step-response-chart';
import type {
    DampingRegime,
    PhysicalParameters,
    ResponseMetrics,
} from '@/features/second-order/domain/second-order';
import { getDampingRegime } from '@/features/second-order/domain/second-order';

interface ResponseAnalysisProps {
    parameters: PhysicalParameters;
    metrics: ResponseMetrics;
    duration: number;
    dampingRatio: number;
    naturalFrequency: number;
}

function formatTime(value: number | null): string {
    return value === null ? 'N/A' : `${value.toFixed(3)} s`;
}

const REGIME_LABELS: Record<DampingRegime, string> = {
    undamped: 'Undamped',
    underdamped: 'Underdamped',
    critical: 'Critically damped',
    overdamped: 'Overdamped',
};

export function ResponseAnalysis({
    parameters,
    metrics,
    duration,
    dampingRatio,
    naturalFrequency,
}: ResponseAnalysisProps) {
    const settlingValue =
        metrics.settlingTime === null
            ? 'No finite settling time'
            : `${metrics.settlingTime.toFixed(3)} s`;
    const regime = REGIME_LABELS[getDampingRegime(parameters)];

    return (
        <div className="min-w-0 space-y-4">
            <Card className="min-w-0">
                <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">Unit-force step response</CardTitle>
                            <CardDescription className="mt-1">
                                Physical displacement and normalized response update with m, b, and k.
                            </CardDescription>
                        </div>
                        <Badge variant="outline">{regime}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="min-w-0">
                    <StepResponseChart
                        parameters={parameters}
                        duration={duration}
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                        Solid teal: x(t) in m · dashed blue: kx(t) · dotted orange:
                        physical steady-state displacement 1/k = {(1 / parameters.k).toFixed(4)} m.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard
                    label="10–90% rise time"
                    value={`${metrics.riseTime.toFixed(3)} s`}
                    detail="Time from 10% to 90% of final displacement"
                    icon={Clock3}
                />
                <MetricCard
                    label="Peak time"
                    value={formatTime(metrics.peakTime)}
                    detail={metrics.peakTime === null ? 'Not mathematically applicable' : 'Time to first peak'}
                    icon={Activity}
                />
                <MetricCard
                    label="Percentage overshoot"
                    value={`${metrics.percentageOvershoot.toFixed(2)}%`}
                    detail="Relative to final displacement"
                    icon={TrendingUp}
                />
                <MetricCard
                    label="2% settling time"
                    value={settlingValue}
                    detail={
                        metrics.settlingTime === null
                            ? 'Undamped oscillation never settles'
                            : 'Remains within ±2% of final value'
                    }
                    icon={Gauge}
                />
            </div>

            <Card className="min-w-0">
                <CardHeader>
                    <CardTitle className="text-base">Complex s-plane poles</CardTitle>
                    <CardDescription>
                        Roots of ms² + bs + k = 0 for the current physical parameters.
                        The plot supports hover, pan, and zoom.
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                    <PoleChart parameters={parameters} />
                    <p className="text-xs text-muted-foreground">
                        Current values: ζ = {dampingRatio.toFixed(4)}, ωn = {naturalFrequency.toFixed(3)} rad/s.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
