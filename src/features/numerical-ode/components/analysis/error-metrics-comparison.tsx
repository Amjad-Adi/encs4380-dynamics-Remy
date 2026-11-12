import { Activity, Target, TrendingDown } from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { NumericalErrorMetrics } from '@/features/numerical-ode/domain/numerical-ode';
import type { NumericalMethod } from '../controls/numerical-ode-controls';

interface ErrorMetricsComparisonProps {
    euler: NumericalErrorMetrics;
    rk4: NumericalErrorMetrics;
}

const METRICS = [
    {
        key: 'maximumAbsoluteError',
        label: 'Maximum absolute error',
        icon: Activity,
    },
    {
        key: 'rootMeanSquareError',
        label: 'RMSE',
        icon: TrendingDown,
    },
    {
        key: 'finalTimeAbsoluteError',
        label: 'Final-time absolute error',
        icon: Target,
    },
] as const;

function getMoreAccurateMethod(
    euler: NumericalErrorMetrics,
    rk4: NumericalErrorMetrics,
): NumericalMethod | null {
    if (
        Math.abs(euler.rootMeanSquareError - rk4.rootMeanSquareError) <= 1e-12
    ) {
        return null;
    }
    return euler.rootMeanSquareError < rk4.rootMeanSquareError ? 'euler' : 'rk4';
}

export function ErrorMetricsComparison({
    euler,
    rk4,
}: ErrorMetricsComparisonProps) {
    const moreAccurate = getMoreAccurateMethod(euler, rk4);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h3 className="text-base font-semibold">Numerical error metrics</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Errors are measured against the analytical solution at each
                        shared time point. Lower RMSE indicates greater overall
                        accuracy for this comparison.
                    </p>
                </div>
                {moreAccurate ? (
                    <p className="text-sm font-medium text-primary">
                        More accurate by RMSE:{' '}
                        {moreAccurate === 'euler' ? "Euler's method" : 'RK4'}
                    </p>
                ) : (
                    <p className="text-sm font-medium text-muted-foreground">
                        Equal RMSE for this comparison
                    </p>
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {([
                    ['euler', "Euler's method", euler],
                    ['rk4', 'Fourth-order Runge–Kutta', rk4],
                ] as const).map(([method, label, metrics]) => (
                    <Card
                        key={method}
                        className={
                            moreAccurate === method
                                ? 'border-primary/40 bg-primary/5'
                                : undefined
                        }
                    >
                        <CardHeader>
                            <CardTitle className="text-base">{label}</CardTitle>
                            <CardDescription>
                                {moreAccurate === method
                                    ? 'Lower RMSE in the current experiment'
                                    : 'Absolute difference from analytical values'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            {METRICS.map(({ key, label: metricLabel, icon }) => (
                                <MetricCard
                                    key={key}
                                    label={metricLabel}
                                    value={metrics[key].toExponential(3)}
                                    detail="Output units"
                                    icon={icon}
                                />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
