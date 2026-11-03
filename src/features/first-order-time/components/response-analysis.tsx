import {
    Activity,
    Clock3,
    Gauge,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { TimeResponseChart } from './time-response-chart';
import { MetricCard } from './metric-card';

import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '../models/first-order-time';

interface ResponseAnalysisProps {
    parameters: FirstOrderParameters;
    inputType: FirstOrderInputType;
    rampError: number;
    rampLag: number;
}

export function ResponseAnalysis({
                                     parameters,
                                     inputType,
                                     rampError,
                                     rampLag,
                                 }: ResponseAnalysisProps) {
    const { gain, tau, amplitude } = parameters;

    const finalValue = gain * amplitude;

    const isStep = inputType === 'step';

    return (
        <div className="min-w-0 space-y-4">
            <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">
                                System response
                            </CardTitle>

                            <CardDescription className="mt-1">
                                Compare the applied input, actual output,
                                and ideal output.
                            </CardDescription>
                        </div>

                        <Badge variant="outline">
                            {isStep ? 'Step input' : 'Ramp input'}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="min-w-0">
                    <TimeResponseChart
                        parameters={parameters}
                        inputType={inputType}
                        duration={5 * tau}
                    />

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        <ChartLegend
                            color="#3978c5"
                            label="Input"
                        />

                        <ChartLegend
                            color="#159b98"
                            label="Actual output"
                        />

                        <ChartLegend
                            color="#d69a35"
                            label="Ideal output"
                        />
                    </div>
                </CardContent>
            </Card>

            <div
                className={`grid gap-3 ${
                    isStep
                        ? 'sm:grid-cols-3'
                        : 'sm:grid-cols-3'
                }`}
            >
                <MetricCard
                    label="Time constant"
                    value={`${tau.toFixed(2)} s`}
                    detail="63.2% response time"
                    icon={Clock3}
                />

                {isStep ? (
                    <>
                        <MetricCard
                            label="95% response"
                            value={`${(3 * tau).toFixed(2)} s`}
                            detail="Approximately 3τ"
                            icon={Activity}
                        />

                        <MetricCard
                            label="Final output"
                            value={finalValue.toFixed(2)}
                            detail="Steady-state value (KA)"
                            icon={Gauge}
                        />
                    </>
                ) : (
                    <>
                        <MetricCard
                            label="Steady-state error"
                            value={rampError.toFixed(2)}
                            detail="Tracking error (KAτ)"
                            icon={Gauge}
                        />

                        <MetricCard
                            label="Equivalent time lag"
                            value={`${rampLag.toFixed(2)} s`}
                            detail="Ramp delay (τ)"
                            icon={Activity}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function ChartLegend({
                         color,
                         label,
                     }: {
    color: string;
    label: string;
}) {
    return (
        <span className="inline-flex items-center gap-2">
            <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    );
}