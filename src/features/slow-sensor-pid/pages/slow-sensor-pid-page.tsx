import { useMemo, useState } from 'react';

import { ModuleHeader } from '@/components/modules/module-header.tsx';
import { ModuleFooter } from '@/components/modules/module-footer.tsx';
import { SectionNavigation } from '@/components/modules/section-navigation.tsx';
import { Reveal } from '@/components/ui/reveal.tsx';
import { useIsMobile } from '@/hooks/use-is-mobile.ts';

import { updatePlantSelection, type PlantParameterKey } from '@/features/control/domain';

import {
    createDefaultSlowSensorParameters,
    getSlowSensorMetrics,
    simulateSlowSensorPID,
    type SlowSensorPIDParameters,
} from '../domain/slow-sensor-pid.ts';
import { ModelOverview } from '../components/page/model-overview.tsx';
import { ParameterSummary } from '../components/page/parameter-summary.tsx';
import { ExperimentSection } from '../components/page/experiment-section.tsx';
import { SlowSensorPIDMetrics } from '../components/analysis/slow-sensor-pid-metrics.tsx';
import { ChallengeSection } from '../components/page/challenge-section.tsx';
import { SLOW_SENSOR_PID_SECTIONS } from '../components/page/slow-sensor-pid-sections.ts';
import type { SlowSensorParameterKey } from '../components/controls/slow-sensor-pid-controls.tsx';

export default function SlowSensorPIDPage() {
    const isMobile = useIsMobile();
    const [parameters, setParameters] = useState<SlowSensorPIDParameters>(
        createDefaultSlowSensorParameters,
    );

    const points = useMemo(() => simulateSlowSensorPID(parameters, 10, 6001), [parameters]);

    const metrics = useMemo(() => {
        // Overshoot comes from the shared Control metrics (true output against its final
        // value), so P2 reports the same quantity as P1 for the same response.
        const shared = getSlowSensorMetrics(points, parameters.setpoint);
        const finalPoint = points[points.length - 1];
        const crossingDirection = parameters.setpoint < 0 ? -1 : 1;
        const crossingPoint =
            parameters.setpoint === 0
                ? null
                : (points.find(
                      (point) =>
                          crossingDirection * point.trueOutput >=
                          crossingDirection * parameters.setpoint,
                  ) ?? null);

        return {
            maxTrueOutput: shared.peakOutput,
            overshoot: shared.percentageOvershoot,
            finalTrueOutput: finalPoint?.trueOutput ?? 0,
            finalMeasuredOutput: finalPoint?.measuredOutput ?? 0,
            crossingPoint,
        };
    }, [points, parameters.setpoint]);

    function updateParameter(key: SlowSensorParameterKey, value: number) {
        if (!Number.isFinite(value)) return;

        setParameters((current) => {
            if (key === 'kp' || key === 'ki' || key === 'kd') {
                return { ...current, gains: { ...current.gains, [key]: value } };
            }

            if (key === 'outputMin') {
                return { ...current, outputMin: Math.min(value, current.outputMax - 1) };
            }

            if (key === 'outputMax') {
                return { ...current, outputMax: Math.max(value, current.outputMin + 1) };
            }

            return { ...current, [key]: value };
        });
    }

    function updatePlantParameter(key: PlantParameterKey, value: number) {
        setParameters((current) => ({ ...current, ...updatePlantSelection(current, key, value) }));
    }

    function updatePlantType(plantType: SlowSensorPIDParameters['plantType']) {
        setParameters((current) => ({ ...current, plantType }));
    }

    function resetExperiment() {
        setParameters(createDefaultSlowSensorParameters());
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    systemType="PID control with sensor dynamics"
                    title="Slow sensor in the feedback loop"
                    description="Investigate how sensor lag affects closed-loop PID performance. Compare the true plant output with the delayed sensor measurement and observe how feedback delay can increase overshoot and cause oscillations."
                    onReset={resetExperiment}
                />
            </Reveal>

            {!isMobile && (
                <Reveal>
                    <SectionNavigation sections={SLOW_SENSOR_PID_SECTIONS} />
                </Reveal>
            )}

            <Reveal>
                <ParameterSummary parameters={parameters} overshoot={metrics.overshoot} />
            </Reveal>

            <Reveal>
                <ModelOverview plantType={parameters.plantType} />
            </Reveal>

            <Reveal>
                <ExperimentSection
                    parameters={parameters}
                    points={points}
                    onPlantTypeChange={updatePlantType}
                    onParameterChange={updateParameter}
                    onPlantParameterChange={updatePlantParameter}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <SlowSensorPIDMetrics
                    overshoot={metrics.overshoot}
                    maxTrueOutput={metrics.maxTrueOutput}
                    finalTrueOutput={metrics.finalTrueOutput}
                    finalMeasuredOutput={metrics.finalMeasuredOutput}
                    crossingPoint={metrics.crossingPoint}
                />
            </Reveal>

            <Reveal>
                <ChallengeSection parameters={parameters} />
            </Reveal>


            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
