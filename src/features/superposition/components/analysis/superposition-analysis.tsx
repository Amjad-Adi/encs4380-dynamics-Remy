import { useMemo, useState } from 'react';
import { Activity, Clock3, Layers, Waves } from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    generateSuperpositionResponse,
    getPeakValue,
    type SuperpositionConfiguration,
} from '@/features/superposition/domain/superposition';
import { ComponentSignalsChart, type ComponentView } from '../charts/component-signals-chart';
import { SuperpositionResponseChart } from '../charts/superposition-response-chart';

const VIEW_OPTIONS: { value: ComponentView; label: string }[] = [
    { value: 'input', label: 'Input components' },
    { value: 'output', label: 'Output contributions' },
];

interface SuperpositionAnalysisProps {
    configuration: SuperpositionConfiguration;
}

export function SuperpositionAnalysis({ configuration }: SuperpositionAnalysisProps) {
    const [view, setView] = useState<ComponentView>('input');
    const { components, sensor } = configuration;

    const points = useMemo(() => generateSuperpositionResponse(configuration), [configuration]);

    // Peaks are measured after 5τ so the startup transient does not distort them.
    const settledPoints = points.filter((point) => point.time >= 5 * sensor.tau);
    const inputPeak = getPeakValue(settledPoints.map((point) => point.input));
    const outputPeak = getPeakValue(settledPoints.map((point) => point.steadyStateOutput));
    const transientPeak = getPeakValue(
        points.map((point) => point.output - point.steadyStateOutput),
    );

    return (
        <div className="min-w-0 space-y-4">
            <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">Individual components</CardTitle>
                            <CardDescription className="mt-1">
                                {view === 'input'
                                    ? 'Each sinusoid xᵢ(t) before it reaches the sensor.'
                                    : 'Each component after the sensor, yᵢ(t), including its own transient.'}
                            </CardDescription>
                        </div>

                        <div className="bg-muted flex gap-1 rounded-lg p-1">
                            {VIEW_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={view === option.value}
                                    onClick={() => setView(option.value)}
                                    className={[
                                        'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                                        view === option.value
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground',
                                    ].join(' ')}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="min-w-0">
                    {components.length === 0 ? (
                        <p className="text-muted-foreground py-16 text-center text-sm">
                            Add a component to see it here.
                        </p>
                    ) : (
                        <ComponentSignalsChart
                            components={components}
                            points={points}
                            view={view}
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">
                                Combined input and sensor output
                            </CardTitle>
                            <CardDescription className="mt-1">
                                The input x(t) = Σ xᵢ(t) and the first-order sensor response y(t),
                                starting from rest.
                            </CardDescription>
                        </div>
                        <Badge variant="outline">
                            K = {sensor.gain.toFixed(2)} · τ = {sensor.tau.toFixed(2)} s
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="min-w-0">
                    <SuperpositionResponseChart points={points} tau={sensor.tau} />
                    <p className="text-muted-foreground mt-1 text-xs leading-5">
                        Before t = 5τ the output still contains the decaying transient; after it,
                        y(t) follows the steady-state sum of every attenuated and delayed component.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Components"
                    value={components.length.toString()}
                    detail="Terms in x(t) = Σ xᵢ(t)"
                    icon={Layers}
                />
                <MetricCard
                    label="Input peak |x|"
                    value={inputPeak.toFixed(3)}
                    detail="Measured after t = 5τ"
                    icon={Waves}
                />
                <MetricCard
                    label="Output peak |y_ss|"
                    value={outputPeak.toFixed(3)}
                    detail="Steady-state, after t = 5τ"
                    icon={Activity}
                />
                <MetricCard
                    label="Transient peak"
                    value={transientPeak.toFixed(3)}
                    detail={`|y − y_ss| decays as e^(−t/${sensor.tau.toFixed(2)})`}
                    icon={Clock3}
                />
            </div>
        </div>
    );
}
