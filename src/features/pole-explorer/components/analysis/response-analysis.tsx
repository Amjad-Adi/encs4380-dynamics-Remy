import {
    Activity,
    Clock3,
    ShieldCheck,
    TrendingUp,
} from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    formatNumber,
    getPoleSummary,
    getPoles,
    type ComplexPole,
    type PoleCharacteristics,
    type PoleConfiguration,
    type PoleStability,
    type ResponseMetrics,
} from '@/features/pole-explorer/domain/pole-explorer';
import {
    getRegimeLabel,
    getStabilityLabel,
    STABILITY_DESCRIPTIONS,
} from '@/features/pole-explorer/components/pole-labels';
import { PolePlaneChart } from '../charts/pole-plane-chart';
import { StepResponseChart } from '../charts/step-response-chart';

const STABILITY_BADGE_CLASS: Record<PoleStability, string> = {
    stable: 'border-success/30 bg-success/5 text-success',
    marginal:
        'border-[#d69a35]/40 bg-[#d69a35]/10 text-[#a9761f] dark:text-[#e0b25f]',
    unstable:
        'border-destructive/30 bg-destructive/5 text-destructive',
};

interface ResponseAnalysisProps {
    configuration: PoleConfiguration;
    characteristics: PoleCharacteristics;
    metrics: ResponseMetrics;
    duration: number;
    onPoleChange: (index: number, pole: ComplexPole) => void;
}

export function ResponseAnalysis({
    configuration,
    characteristics,
    metrics,
    duration,
    onPoleChange,
}: ResponseAnalysisProps) {
    const poles = getPoles(configuration);
    const overshootValue =
        metrics.overshootPercent === null
            ? 'N/A'
            : `${formatNumber(metrics.overshootPercent, 2)}%`;
    const peakTimeValue =
        metrics.peakTime === null
            ? 'N/A'
            : `${formatNumber(metrics.peakTime, 3)} s`;
    const settlingTimeValue =
        metrics.settlingTime === null
            ? characteristics.stability === 'unstable'
                ? 'Diverges'
                : 'Never settles'
            : `${formatNumber(metrics.settlingTime, 3)} s`;

    return (
        <div className="min-w-0 space-y-4">
            <div className="grid min-w-0 gap-4 xl:grid-cols-2">
                <Card className="min-w-0">
                    <CardHeader>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <CardTitle className="text-base">
                                    Interactive s-plane
                                </CardTitle>

                                <CardDescription className="mt-1">
                                    Drag a pole to update the system
                                    instantly. The shading marks the
                                    stable and unstable half-planes.
                                </CardDescription>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                    {getRegimeLabel(
                                        characteristics.kind,
                                    )}
                                </Badge>

                                <Badge
                                    variant="outline"
                                    className={
                                        STABILITY_BADGE_CLASS[
                                            characteristics.stability
                                        ]
                                    }
                                >
                                    {getStabilityLabel(
                                        characteristics.stability,
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="min-w-0">
                        <PolePlaneChart
                            configuration={configuration}
                            onPoleChange={onPoleChange}
                        />

                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                            Poles: {getPoleSummary(poles)}
                            {configuration.order === 'first'
                                ? ` · τ = ${formatNumber(
                                      characteristics.timeConstant ?? 0,
                                      2,
                                  )} s`
                                : ` · ζ = ${
                                      characteristics.dampingRatio === null
                                          ? '—'
                                          : formatNumber(
                                                characteristics.dampingRatio,
                                                3,
                                            )
                                  } · ωn = ${
                                      characteristics.naturalFrequency ===
                                      null
                                          ? '—'
                                          : `${formatNumber(
                                                characteristics.naturalFrequency,
                                                3,
                                            )} rad/s`
                                  }`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Unit step response
                        </CardTitle>

                        <CardDescription>
                            The response is regenerated from the current
                            pole locations as you drag them.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="min-w-0">
                        <StepResponseChart
                            configuration={configuration}
                            duration={duration}
                            metrics={metrics}
                        />

                        <p className="text-xs leading-5 text-muted-foreground">
                            Solid teal: y(t) · dotted orange: steady-state
                            value 1 · shaded band: ±2% of the final value ·
                            dashed blue: settling time.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Percentage overshoot"
                    value={overshootValue}
                    detail={
                        metrics.overshootPercent === null
                            ? 'Not defined for this response'
                            : metrics.overshootPercent > 0
                              ? 'First peak above the final value'
                              : 'No overshoot; the response stays below the final value'
                    }
                    icon={TrendingUp}
                />

                <MetricCard
                    label="Peak time"
                    value={peakTimeValue}
                    detail={
                        metrics.peakTime === null
                            ? 'No finite peak for this placement'
                            : 'Time of the first overshoot'
                    }
                    icon={Activity}
                />

                <MetricCard
                    label="2% settling time"
                    value={settlingTimeValue}
                    detail={
                        metrics.settlingTime === null
                            ? characteristics.stability === 'unstable'
                                ? 'The response grows without bound'
                                : 'The response does not decay to a steady value'
                            : 'Remains within ±2% of the final value'
                    }
                    icon={Clock3}
                />

                <MetricCard
                    label="Stability"
                    value={getStabilityLabel(
                        characteristics.stability,
                    )}
                    detail={
                        STABILITY_DESCRIPTIONS[
                            characteristics.stability
                        ]
                    }
                    icon={ShieldCheck}
                />
            </div>
        </div>
    );
}
