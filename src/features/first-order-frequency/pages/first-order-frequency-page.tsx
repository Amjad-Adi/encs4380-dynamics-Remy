import { useState } from 'react';

import {
    FREQUENCY_SECTIONS,
    getFrequencyResponse,
} from '@/features/first-order-frequency/domain/first-order-frequency';

import { DynamicErrorCalculator } from '../components/analysis/dynamic-error-calculator.tsx';
import { ParameterSummary } from '../components/page/parameter-summary';
import { ModelOverview } from '../components/page/model-overview';
import { ExperimentSection } from '../components/page/experiment-section';
import { AnalysisSection } from '../components/page/analysis-section';
import { ChallengeSection } from '../components/page/challenge-section';
import { Calculator } from 'lucide-react';
import { ModuleHeader } from '@/components/modules/module-header.tsx';
import { ModuleFooter } from '@/components/modules/module-footer.tsx';
import { SectionHeading } from '@/components/modules/section-heading.tsx';
import { SectionNavigation } from '@/components/modules/section-navigation.tsx';
import { Reveal } from '@/components/ui/reveal.tsx';

const DEFAULT_TAU = 1;
const DEFAULT_OMEGA = 1;

export default function FirstOrderFrequencyPage() {
    const [tau, setTau] = useState(DEFAULT_TAU);
    const [omega, setOmega] = useState(DEFAULT_OMEGA);
    const [resetKey, setResetKey] = useState(0);

    const response = getFrequencyResponse(tau, omega);

    function resetExperiment() {
        setTau(DEFAULT_TAU);
        setOmega(DEFAULT_OMEGA);
        setResetKey((current) => current + 1);
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="02"
                    systemType="First-order system"
                    title="First-order frequency response"
                    description="Investigate how a first-order sensor responds to sinusoidal inputs. Observe amplitude attenuation and phase lag, locate the cutoff frequency, and evaluate dynamic error."
                    nextModule={{
                        to: '/second-order',
                        label: 'Continue to Module 03: Second-order response →',
                    }}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={FREQUENCY_SECTIONS} />
            </Reveal>

            <Reveal>
                <ParameterSummary response={response} />
            </Reveal>

            <Reveal>
                <ModelOverview />
            </Reveal>

            <Reveal>
                <ExperimentSection
                    tau={tau}
                    omega={omega}
                    onTauChange={setTau}
                    onOmegaChange={setOmega}
                    onReset={resetExperiment}
                />
            </Reveal>

            <Reveal>
                <AnalysisSection />
            </Reveal>

            <Reveal>
                <section id="dynamic-error" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Dynamic-error calculator" icon={Calculator} />
                    <DynamicErrorCalculator tau={tau} omega={omega} key={resetKey} />
                </section>
            </Reveal>

            <Reveal>
                <ChallengeSection tau={tau} key={resetKey} />
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
