import { useMemo, useState } from 'react';

import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { Reveal } from '@/components/ui/reveal';
import {
    clampPole,
    createDefaultConfiguration,
    getCharacteristics,
    getResponseMetrics,
    getSuggestedDuration,
    movePole,
    setConjugatePair,
    type ComplexPole,
    type PoleConfiguration,
    type PolePreset,
    type SystemOrder,
} from '@/features/pole-explorer/domain/pole-explorer';
import { AnalysisSection } from '../components/page/analysis-section';
import { ExperimentSection } from '../components/page/experiment-section';
import { ModelOverview } from '../components/page/model-overview';
import { ParameterSummary } from '../components/page/parameter-summary';
import { POLE_EXPLORER_SECTIONS } from '../components/page/pole-explorer-sections';
import { PredictionExercise } from '../components/exercises/prediction-exercise';

export default function PoleExplorerPage() {
    const [configuration, setConfiguration] = useState<PoleConfiguration>(() =>
        createDefaultConfiguration('second'),
    );

    const characteristics = useMemo(() => getCharacteristics(configuration), [configuration]);
    const metrics = useMemo(() => getResponseMetrics(configuration), [configuration]);
    const duration = useMemo(() => getSuggestedDuration(configuration), [configuration]);

    function updatePole(index: number, pole: ComplexPole) {
        setConfiguration((current) => movePole(current, index, pole));
    }

    function changeOrder(order: SystemOrder) {
        setConfiguration(createDefaultConfiguration(order));
    }

    function selectPreset(preset: PolePreset) {
        setConfiguration((current) => ({
            order: current.order,
            poles: preset.poles.map((pole) => clampPole(pole)),
        }));
    }

    function changeConjugatePair(realPart: number, imaginaryPart: number) {
        setConfiguration(setConjugatePair(realPart, imaginaryPart));
    }

    function resetExperiment() {
        setConfiguration(createDefaultConfiguration('second'));
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="05"
                    systemType={
                        configuration.order === 'first'
                            ? 'First-order system'
                            : 'Second-order system'
                    }
                    title="Pole explorer"
                    description="Drag poles around the complex s-plane and watch the damping ratio, natural frequency, stability, and unit step response update in real time."
                    nextModule={{
                        to: '/second-order',
                        label: '← Return to Module 03: Second-order response',
                    }}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={POLE_EXPLORER_SECTIONS} />
            </Reveal>

            <Reveal>
                <ParameterSummary configuration={configuration} characteristics={characteristics} />
            </Reveal>

            <Reveal>
                <ModelOverview />
            </Reveal>

            <Reveal>
                <ExperimentSection
                    configuration={configuration}
                    characteristics={characteristics}
                    metrics={metrics}
                    duration={duration}
                    onOrderChange={changeOrder}
                    onPresetSelect={selectPreset}
                    onPoleChange={updatePole}
                    onConjugatePairChange={changeConjugatePair}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <PredictionExercise />
            </Reveal>

            <Reveal>
                <AnalysisSection characteristics={characteristics} />
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
