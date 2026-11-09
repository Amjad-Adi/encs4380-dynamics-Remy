import { useMemo, useState } from 'react';

import {
    getRampLag,
    getRampSteadyStateError,
    getStepValidation,
    type FirstOrderInputType,
    type FirstOrderParameters, TIME_SECTIONS,
} from '@/features/first-order-time/domain/first-order-time';

import { ModuleHeader } from '@/components/modules/module-header.tsx';
import { ParameterSummary } from '../components/page/parameter-summary';
import { ModelOverview } from '../components/page/model-overview';
import { ExperimentSection } from '../components/page/experiment-section';
import { AnalysisSection } from '../components/page/analysis-section';
import { ChallengeSection } from '../components/page/challenge-section';
import {useIsMobile} from "@/hooks/use-is-mobile.ts";
import {ModuleFooter} from "@/components/modules/module-footer.tsx";
import {SectionNavigation} from "@/components/modules/section-navigation.tsx";
import { Reveal } from "@/components/ui/reveal";
const DEFAULT_PARAMETERS: FirstOrderParameters = {
    gain: 1,
    tau: 1,
    amplitude: 1,
};

export default function FirstOrderTimePage() {
    const isMobile = useIsMobile();

    const [parameters, setParameters] =
        useState<FirstOrderParameters>({ ...DEFAULT_PARAMETERS });

    const [inputType, setInputType] =
        useState<FirstOrderInputType>('step');

    const [resetKey, setResetKey] = useState(0);

    const validation = useMemo(
        () => getStepValidation(parameters),
        [parameters],
    );

    const rampError = getRampSteadyStateError(parameters);
    const rampLag = getRampLag(parameters.tau);

    const expectedStepOutput = parameters.gain * parameters.amplitude;

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

    function resetExperiment() {
        setParameters({ ...DEFAULT_PARAMETERS });
        setInputType('step');
        setResetKey((current) => current + 1);
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="01"
                    systemType="First-order system"
                    title="First-order time response"
                    description="Investigate how a first-order sensor responds to sudden and continuously changing inputs. Adjust its parameters and observe their effects on response speed, steady-state behavior, and tracking error."
                    nextModule={{
                        to: '/frequency-response',
                        label: 'Continue to Module 02: First-order frequency response →',
                    }}
                    onReset={resetExperiment}
                />
            </Reveal>

            {/* Conditionally render SectionNavigation based on viewport width */}
            {!isMobile && (
                <Reveal >
                    <SectionNavigation sections={TIME_SECTIONS} />
                </Reveal>
            )}

            <Reveal >
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
                    onReset={resetExperiment}
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
                <ChallengeSection
                    key={`${inputType}-${resetKey}`}
                    inputType={inputType}
                />
            </Reveal>

            <Reveal>
                <ModuleFooter/>
            </Reveal>
        </main>
    );
}