import { useState } from 'react';
import { Waves } from 'lucide-react';

import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionHeading } from '@/components/modules/section-heading';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { Reveal } from '@/components/ui/reveal';
import {
    addComponent,
    createDefaultConfiguration,
    removeComponent,
    updateComponent,
    MAX_GAIN,
    MAX_TAU,
    MIN_GAIN,
    MIN_TAU,
    type SensorParameters,
    type SinusoidComponent,
    type SuperpositionConfiguration,
} from '@/features/superposition/domain/superposition';
import { FrequencyEffectsAnalysis } from '../components/analysis/frequency-effects-analysis';
import { PredictionExercise } from '../components/exercises/prediction-exercise';
import { AnalysisSection } from '../components/page/analysis-section';
import { ExperimentSection } from '../components/page/experiment-section';
import { ModelOverview } from '../components/page/model-overview';
import { ParameterSummary } from '../components/page/parameter-summary';
import { SUPERPOSITION_SECTIONS } from '../components/page/superposition-sections';

export default function SuperpositionPage() {
    const [configuration, setConfiguration] = useState<SuperpositionConfiguration>(
        createDefaultConfiguration,
    );
    const [resetKey, setResetKey] = useState(0);

    function changeSensor(changes: Partial<SensorParameters>) {
        setConfiguration((current) => {
            const sensor = { ...current.sensor, ...changes };

            return {
                ...current,
                sensor: {
                    gain: Math.min(MAX_GAIN, Math.max(MIN_GAIN, sensor.gain)),
                    tau: Math.min(MAX_TAU, Math.max(MIN_TAU, sensor.tau)),
                },
            };
        });
    }

    function addNewComponent(component?: Omit<SinusoidComponent, 'id'>) {
        setConfiguration((current) => addComponent(current, component));
    }

    function deleteComponent(id: number) {
        setConfiguration((current) => removeComponent(current, id));
    }

    function changeComponent(id: number, changes: Partial<Omit<SinusoidComponent, 'id'>>) {
        setConfiguration((current) => updateComponent(current, id, changes));
    }

    function resetExperiment() {
        setConfiguration(createDefaultConfiguration());
        setResetKey((current) => current + 1);
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="06"
                    systemType="First-order system"
                    title="Superposition simulator"
                    description="Combine any number of sinusoids into one input signal and pass it through a first-order sensor. See how each frequency component is attenuated and delayed, and how the transient settles into the steady-state output."
                    nextModule={{
                        to: '/frequency-response',
                        label: '← Return to Module 02: First-order frequency response',
                    }}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={SUPERPOSITION_SECTIONS} />
            </Reveal>

            <Reveal>
                <ParameterSummary configuration={configuration} />
            </Reveal>

            <Reveal>
                <ModelOverview />
            </Reveal>

            <Reveal>
                <ExperimentSection
                    configuration={configuration}
                    onSensorChange={changeSensor}
                    onComponentAdd={() => addNewComponent()}
                    onComponentRemove={deleteComponent}
                    onComponentChange={changeComponent}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <section id="frequency-effects" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Frequency effects on each component" icon={Waves} />
                    <p className="text-muted-foreground text-sm leading-6">
                        For steady-state sinusoidal inputs, each component is scaled by K·M and
                        shifted by φ. Higher-frequency components experience greater attenuation and
                        phase lag.
                    </p>
                    <FrequencyEffectsAnalysis configuration={configuration} />
                </section>
            </Reveal>

            <Reveal>
                <PredictionExercise
                    key={resetKey}
                    configuration={configuration}
                    onModify={(id, omega) => changeComponent(id, { omega })}
                    onAdd={addNewComponent}
                    onRemove={deleteComponent}
                />
            </Reveal>

            <Reveal>
                <AnalysisSection configuration={configuration} />
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
