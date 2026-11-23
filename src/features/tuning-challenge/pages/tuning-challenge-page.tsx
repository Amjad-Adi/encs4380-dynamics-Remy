import { useMemo, useState } from 'react';
import { Gauge } from 'lucide-react';
import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { ModulePager } from '@/components/modules/module-pager';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import { Reveal } from '@/components/ui/reveal';
import { simulatePID, type PIDGains } from '@/features/pid-playground/domain/pid-playground';
import {
    DEFAULT_TUNING_GAINS,
    TUNING_DURATION,
    TUNING_SPEC,
    evaluateTuning,
    generateHiddenPlant,
    getTuningParameters,
} from '@/features/tuning-challenge/domain/tuning-challenge';
import { SpecResults } from '../components/analysis/spec-results';
import { TuningPredictionExercise } from '../components/exercises/tuning-prediction-exercise';
import { TuningExperimentSection } from '../components/page/tuning-experiment-section';
import { TuningModelOverview } from '../components/page/tuning-model-overview';
import { TUNING_SECTIONS } from '../components/page/tuning-sections';

export default function TuningChallengePage() {
    const [plant, setPlant] = useState(() => generateHiddenPlant());
    const [gains, setGains] = useState<PIDGains>({ ...DEFAULT_TUNING_GAINS });
    const parameters = useMemo(() => getTuningParameters(plant, gains), [plant, gains]);
    const points = useMemo(() => simulatePID(parameters, TUNING_DURATION, 6001), [parameters]);
    const evaluation = useMemo(
        () => evaluateTuning(points, parameters.setpoint),
        [points, parameters.setpoint],
    );

    function updateGain(key: keyof PIDGains, value: number) {
        if (!Number.isFinite(value)) return;
        setGains((current) => ({ ...current, [key]: value }));
    }
    function resetExperiment() {
        setGains({ ...DEFAULT_TUNING_GAINS });
    }
    function newPlant() {
        setPlant(generateHiddenPlant());
        resetExperiment();
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    badge="CONTROL · P4"
                    kicker="Feedback control laboratory"
                    parent={{ to: '/control', label: 'Control overview' }}
                    systemType="Controller tuning"
                    title="Tuning challenge"
                    description="Tune a PID controller for a hidden random plant. Meet the overshoot, settling-time, and steady-state error specification using only the simulated closed-loop response, and earn a score for each part."
                    onReset={resetExperiment}
                    nextModule={{
                        to: '/control/my-system',
                        label: 'Continue to MySystem →',
                    }}
                />
            </Reveal>
            <Reveal>
                <SectionNavigation sections={TUNING_SECTIONS} />
            </Reveal>
            <Reveal>
                <TuningModelOverview spec={TUNING_SPEC} />
            </Reveal>
            <Reveal>
                <TuningExperimentSection
                    gains={gains}
                    parameters={parameters}
                    points={points}
                    spec={TUNING_SPEC}
                    onParameterChange={updateGain}
                    onNewPlant={newPlant}
                    onReset={resetExperiment}
                />
            </Reveal>
            <Reveal>
                <SharedAnalysisSection
                    title="Specification results"
                    icon={Gauge}
                    description="Every part of the spec is checked against the simulated closed-loop response. Overshoot and settling are measured against the setpoint, so a response that settles short of it fails. A missing settling time means the response did not enter and remain within the ±2% band during the displayed simulation."
                >
                    <SpecResults evaluation={evaluation} plant={plant} />
                </SharedAnalysisSection>
            </Reveal>
            <Reveal>
                <section id="challenge" className="scroll-mt-24 space-y-3">
                    <TuningPredictionExercise parameters={parameters} />
                </section>
            </Reveal>
            <Reveal>
                <ModulePager />
            </Reveal>
            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
