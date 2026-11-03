import { useState } from 'react';

import { Reveal } from '@/components/shared/reveal';

import {
    getFrequencyResponse,
} from '../models/first-order-frequency';

import { DynamicErrorCalculator } from '../components/dynamic-error-calculator.tsx';
import { ModuleHeader } from '../components/page/module-header';
import { SectionNavigation } from '../components/page/section-navigation';
import { ParameterSummary } from '../components/page/parameter-summary';
import { ModelOverview } from '../components/page/model-overview';
import { ExperimentSection } from '../components/page/experiment-section';
import { AnalysisSection } from '../components/page/analysis-section';
import { ChallengeSection } from '../components/page/challenge-section';
import { ModuleFooter } from '../components/page/module-footer';
import { SectionHeading } from '../components/page/section-heading';
import { Calculator } from 'lucide-react';

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
                <ModuleHeader onReset={resetExperiment} />
            </Reveal>

            <Reveal delay={75}>
                <SectionNavigation />
            </Reveal>

            <Reveal delay={100}>
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
