import { useMemo, useState } from 'react';

import { Reveal } from '@/components/shared/reveal';

import {
    getRampLag,
    getRampSteadyStateError,
    getStepValidation,
    type FirstOrderInputType,
    type FirstOrderParameters,
} from '../models/first-order-time';

import { ModuleHeader } from '../components/page/module-header';
import { SectionNavigation } from '../components/page/section-navigation';
import { ParameterSummary } from '../components/page/parameter-summary';
import { ModelOverview } from '../components/page/model-overview';
import { ExperimentSection } from '../components/page/experiment-section';
import { AnalysisSection } from '../components/page/analysis-section';
import { ChallengeSection } from '../components/page/challenge-section';
import { ModuleFooter } from '../components/page/module-footer';

const DEFAULT_PARAMETERS: FirstOrderParameters = {
    gain: 1,
    tau: 1,
    amplitude: 1,
};

export default function FirstOrderTimePage() {
    const [parameters, setParameters] =
        useState<FirstOrderParameters>({ ...DEFAULT_PARAMETERS });

    const [inputType, setInputType] =
        useState<FirstOrderInputType>('step');

    // Forces stateful child components to reset.
    const [resetKey, setResetKey] = useState(0);

    const validation = useMemo(
        () => getStepValidation(parameters),
        [parameters],
    );

    const rampError = getRampSteadyStateError(parameters);
    const rampLag = getRampLag(parameters.tau);

    const expectedStepOutput =
        parameters.gain * parameters.amplitude;

    function updateParameter(
        key: keyof FirstOrderParameters,
        value: number,
    ) {
        if (!Number.isFinite(value)) return;

        setParameters((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function resetParameters() {
        setParameters({ ...DEFAULT_PARAMETERS });
        setInputType('step');

        // Reset internal state in child components.
        setResetKey((current) => current + 1);
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader onReset={resetParameters} />
            </Reveal>

            <Reveal delay={75}>
                <SectionNavigation />
            </Reveal>

            <Reveal delay={100}>
                <ParameterSummary
                    parameters={parameters}
                    inputType={inputType}
                    rampLag={rampLag}
                    expectedStepOutput={expectedStepOutput}
                />
            </Reveal>

            <Reveal>
                <ModelOverview inputType={inputType} />
            </Reveal>

            <Reveal>
                <ExperimentSection
                    parameters={parameters}
                    inputType={inputType}
                    rampError={rampError}
                    rampLag={rampLag}
                    onParameterChange={updateParameter}
                    onInputTypeChange={setInputType}
                    onReset={resetParameters}
                />
            </Reveal>

            <Reveal>
                <AnalysisSection
                    inputType={inputType}
                    parameters={parameters}
                    validation={validation}
                    rampError={rampError}
                    rampLag={rampLag}
                />
            </Reveal>

            <Reveal>
                <ChallengeSection key={resetKey} />
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}