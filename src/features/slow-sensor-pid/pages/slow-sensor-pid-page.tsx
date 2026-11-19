import { useMemo, useState } from 'react';

import { ModuleHeader } from '@/components/modules/module-header.tsx';
import { ModuleFooter } from '@/components/modules/module-footer.tsx';
import { SectionNavigation } from '@/components/modules/section-navigation.tsx';
import { Reveal } from '@/components/ui/reveal.tsx';
import { useIsMobile } from '@/hooks/use-is-mobile.ts';

import {
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

const DEFAULT_PARAMETERS: SlowSensorPIDParameters = {
    plantType: 'first-order',
    firstOrder: {
        gain: 1,
        tau: 1,
    },
    secondOrder: {
        m: 1,
        b: 2,
        k: 4,
    },
    gains: {
        kp: 9,
        ki: 0,
        kd: 0,
    },
    setpoint: 1,
    outputMin: 0,
    outputMax: 100,
    sensorTau: 0.2,
};

export default function SlowSensorPIDPage() {
    const isMobile = useIsMobile();
    const [parameters, setParameters] = useState<SlowSensorPIDParameters>(() => ({
        ...DEFAULT_PARAMETERS,
        firstOrder: { ...DEFAULT_PARAMETERS.firstOrder },
        secondOrder: { ...DEFAULT_PARAMETERS.secondOrder },
        gains: { ...DEFAULT_PARAMETERS.gains },
    }));

    const points = useMemo(() => simulateSlowSensorPID(parameters, 10, 6001), [parameters]);

    const metrics = useMemo(() => {
        let maxTrueOutput = Number.NEGATIVE_INFINITY;
        let minTrueOutput = Number.POSITIVE_INFINITY;

        for (const point of points) {
            maxTrueOutput = Math.max(maxTrueOutput, point.trueOutput);
            minTrueOutput = Math.min(minTrueOutput, point.trueOutput);
        }

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
        const overshoot =
            parameters.setpoint > 0
                ? Math.max(
                      0,
                      ((maxTrueOutput - parameters.setpoint) / Math.abs(parameters.setpoint)) * 100,
                  )
                : parameters.setpoint < 0
                  ? Math.max(
                        0,
                        ((parameters.setpoint - minTrueOutput) / Math.abs(parameters.setpoint)) * 100,
                    )
                  : 0;

        return {
            maxTrueOutput: Number.isFinite(maxTrueOutput) ? maxTrueOutput : 0,
            overshoot,
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

    function updatePlantParameter(
        key: 'gain' | 'tau' | 'm' | 'b' | 'k',
        value: number,
    ) {
        if (!Number.isFinite(value)) return;

        setParameters((current) =>
            current.plantType === 'first-order' && (key === 'gain' || key === 'tau')
                ? { ...current, firstOrder: { ...current.firstOrder, [key]: value } }
                : current.plantType === 'second-order' && (key === 'm' || key === 'b' || key === 'k')
                  ? { ...current, secondOrder: { ...current.secondOrder, [key]: value } }
                  : current,
        );
    }

    function updatePlantType(plantType: SlowSensorPIDParameters['plantType']) {
        setParameters((current) => ({ ...current, plantType }));
    }

    function resetExperiment() {
        setParameters({
            ...DEFAULT_PARAMETERS,
            firstOrder: { ...DEFAULT_PARAMETERS.firstOrder },
            secondOrder: { ...DEFAULT_PARAMETERS.secondOrder },
            gains: { ...DEFAULT_PARAMETERS.gains },
        });
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="P2"
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
