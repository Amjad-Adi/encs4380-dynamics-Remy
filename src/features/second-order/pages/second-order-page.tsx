import { useMemo, useState } from 'react';

import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { Reveal } from '@/components/ui/reveal';
import {
    getDampingRatio,
    getDampingRegime,
    getNaturalFrequency,
    getResponseMetrics,
    type PhysicalParameters,
} from '@/features/second-order/domain/second-order';
import { PredictionExercise } from '../components/exercises/prediction-exercise';
import { AnalysisSection } from '../components/page/analysis-section';
import { ExperimentSection } from '../components/page/experiment-section';
import { ModelOverview } from '../components/page/model-overview';
import { ParameterSummary } from '../components/page/parameter-summary';
import { SECOND_ORDER_SECTIONS } from '../components/page/second-order-sections';

const DEFAULT_PARAMETERS: PhysicalParameters = {
    m: 1,
    b: 2,
    k: 4,
};

export default function SecondOrderPage() {
    const [parameters, setParameters] =
        useState<PhysicalParameters>({ ...DEFAULT_PARAMETERS });
    const [predictionSubmitted, setPredictionSubmitted] = useState(false);
    const [predictionAttemptKey, setPredictionAttemptKey] = useState(0);

    const dampingRatio = useMemo(
        () => getDampingRatio(parameters),
        [parameters],
    );
    const naturalFrequency = useMemo(
        () => getNaturalFrequency(parameters),
        [parameters],
    );
    const metrics = useMemo(
        () => getResponseMetrics(parameters),
        [parameters],
    );
    const duration = useMemo(() => {
        if (metrics.settlingTime !== null) {
            return Math.max(6 / naturalFrequency, metrics.settlingTime * 1.2);
        }
        return (6 * 2 * Math.PI) / naturalFrequency;
    }, [metrics.settlingTime, naturalFrequency]);
    const phasePlaneDuration = useMemo(() => {
        const regime = getDampingRegime(parameters);
        if (regime === 'undamped') {
            return Math.max(duration, (3 * 2 * Math.PI) / naturalFrequency);
        }
        if (regime === 'underdamped') {
            const dampedFrequency =
                naturalFrequency * Math.sqrt(1 - dampingRatio ** 2);
            const threePeriods = (3 * 2 * Math.PI) / dampedFrequency;
            return Math.max(duration, threePeriods);
        }
        return duration;
    }, [parameters, duration, naturalFrequency, dampingRatio]);

    function updateParameter(key: keyof PhysicalParameters, value: number) {
        if (!Number.isFinite(value)) return;
        setPredictionSubmitted(false);
        setParameters((current) => ({ ...current, [key]: value }));
    }

    function resetExperiment() {
        setParameters({ ...DEFAULT_PARAMETERS });
        setPredictionSubmitted(false);
        setPredictionAttemptKey((current) => current + 1);
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="03"
                    systemType="Second-order system"
                    title="Second-order response and state-space"
                    description="Explore how mass, damping, and stiffness shape a physical system’s step response, poles, state-space representation, and phase-plane trajectory."
                    nextModule={{
                        to: '/frequency-response',
                        label: '← Return to Module 02: Frequency Response',
                    }}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={SECOND_ORDER_SECTIONS} />
            </Reveal>

            {predictionSubmitted && (
                <Reveal>
                    <ParameterSummary
                        parameters={parameters}
                        dampingRatio={dampingRatio}
                        naturalFrequency={naturalFrequency}
                    />
                </Reveal>
            )}

            <Reveal>
                <ModelOverview />
            </Reveal>

            <Reveal>
                <ExperimentSection
                    parameters={parameters}
                    metrics={metrics}
                    duration={duration}
                    dampingRatio={dampingRatio}
                    naturalFrequency={naturalFrequency}
                    isPredictionSubmitted={predictionSubmitted}
                    onParameterChange={updateParameter}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <PredictionExercise
                    key={`${parameters.m}:${parameters.b}:${parameters.k}:${predictionAttemptKey}`}
                    parameters={parameters}
                    metrics={metrics}
                    onSubmissionChange={setPredictionSubmitted}
                />
            </Reveal>

            <Reveal>
                <AnalysisSection
                    parameters={parameters}
                    phasePlaneDuration={phasePlaneDuration}
                    isPredictionSubmitted={predictionSubmitted}
                />
            </Reveal>

            <Reveal>
                <ModuleFooter
                    assumptions="Linear mass–spring–damper system with positive mass and stiffness, nonnegative viscous damping, a 1 N force step, and zero initial displacement and velocity. The physical displacement settles to 1/k when damping is positive; the displayed normalized response is kx(t)."
                />
            </Reveal>
        </main>
    );
}
