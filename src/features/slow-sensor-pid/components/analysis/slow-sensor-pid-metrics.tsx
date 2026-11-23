import { Activity, Gauge, Waves } from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card.tsx';
import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section.tsx';

import type { SlowSensorPIDResponsePoint } from '../../domain/slow-sensor-pid.ts';
import { ControllerBehavior } from './controller-behavior.tsx';

export interface SlowSensorPIDMetricsProps {
    overshoot: number;
    finalTrueOutput: number;
    finalMeasuredOutput: number;
    maxTrueOutput: number;
    crossingPoint: SlowSensorPIDResponsePoint | null;
}

export function SlowSensorPIDMetrics({
                                         overshoot,
                                         finalTrueOutput,
                                         finalMeasuredOutput,
                                         maxTrueOutput,
                                         crossingPoint,
                                     }: SlowSensorPIDMetricsProps) {
    return (
        <SharedAnalysisSection
            title="Closed-loop performance analysis"
            icon={Activity}
            description="Use the response metrics to assess tracking, peak response, and the difference between the physical output and the delayed feedback signal."
            className="space-y-5"
        >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Peak true output"
                    value={maxTrueOutput.toFixed(3)}
                    detail="Maximum plant output during the simulation"
                    icon={Waves}
                />

                <MetricCard
                    label="Overshoot"
                    value={`${overshoot.toFixed(2)}%`}
                    detail="True output peak relative to its final value (as in Module 01)"
                    icon={Gauge}
                />

                <MetricCard
                    label="Final true output"
                    value={finalTrueOutput.toFixed(3)}
                    detail="Plant output at the end of the run"
                    icon={Activity}
                />

                <MetricCard
                    label="Final measured output"
                    value={finalMeasuredOutput.toFixed(3)}
                    detail="Sensor output at the end of the run"
                    icon={Activity}
                />
            </div>

            <ControllerBehavior crossingPoint={crossingPoint} />
        </SharedAnalysisSection>
    );
}