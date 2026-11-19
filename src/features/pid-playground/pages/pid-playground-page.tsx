import { useMemo, useState } from 'react';
import { Gauge } from 'lucide-react';
import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import { Reveal } from '@/components/ui/reveal';
import {
    DEFAULT_PID_PARAMETERS,
    getPIDPerformanceMetrics,
    getSuggestedSimulationDuration,
    simulatePID,
    type PIDPlaygroundParameters,
    type PlantType,
} from '@/features/pid-playground/domain/pid-playground';
import { PIDMetrics } from '../components/analysis/pid-metrics';
import { PIDValidationChecks } from '../components/analysis/pid-validation-checks';
import { PIDPredictionExercise } from '../components/exercises/pid-prediction-exercise';
import { PIDExperimentSection } from '../components/page/pid-experiment-section';
import { PIDModelOverview } from '../components/page/pid-model-overview';
import { PID_SECTIONS } from '../components/page/pid-sections';

export default function PIDPlaygroundPage() {
    const [parameters, setParameters] = useState<PIDPlaygroundParameters>({
        ...DEFAULT_PID_PARAMETERS,
        firstOrder: { ...DEFAULT_PID_PARAMETERS.firstOrder },
        secondOrder: { ...DEFAULT_PID_PARAMETERS.secondOrder },
        gains: { ...DEFAULT_PID_PARAMETERS.gains },
    });
    const duration = useMemo(() => getSuggestedSimulationDuration(parameters), [parameters]);
    const points = useMemo(() => simulatePID(parameters, duration, 6001), [parameters, duration]);
    const metrics = useMemo(() => getPIDPerformanceMetrics(points), [points]);

    function updateGain(key: keyof PIDPlaygroundParameters['gains'], value: number) {
        if (!Number.isFinite(value)) return;
        setParameters((current) => ({ ...current, gains: { ...current.gains, [key]: value } }));
    }
    function updatePlantParameter(key: 'gain' | 'tau' | 'm' | 'b' | 'k', value: number) {
        if (!Number.isFinite(value)) return;
        setParameters((current) =>
            current.plantType === 'first-order'
                ? { ...current, firstOrder: { ...current.firstOrder, [key]: value } }
                : { ...current, secondOrder: { ...current.secondOrder, [key]: value } },
        );
    }
    function resetExperiment() {
        setParameters({
            ...DEFAULT_PID_PARAMETERS,
            firstOrder: { ...DEFAULT_PID_PARAMETERS.firstOrder },
            secondOrder: { ...DEFAULT_PID_PARAMETERS.secondOrder },
            gains: { ...DEFAULT_PID_PARAMETERS.gains },
        });
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="08"
                    systemType="Feedback control"
                    title="PID control playground"
                    description="Explore how proportional, integral, and derivative control shape a closed-loop response. Compare first-order and second-order plants, inspect the actuator command, and tune the controller against live performance metrics."
                    onReset={resetExperiment}
                    nextModule={{
                        to: '/slow-sensor-pid',
                        label: 'Continue to Module 09: Slow sensor in feedback loop →',
                    }}
                />
            </Reveal>
            <Reveal>
                <SectionNavigation sections={PID_SECTIONS} />
            </Reveal>
            <Reveal>
                <PIDModelOverview />
            </Reveal>
            <Reveal>
                <PIDExperimentSection
                    parameters={parameters}
                    points={points}
                    onPlantTypeChange={(plantType: PlantType) =>
                        setParameters((current) => ({ ...current, plantType }))
                    }
                    onParameterChange={updateGain}
                    onPlantParameterChange={updatePlantParameter}
                    onSetpointChange={(setpoint) =>
                        setParameters((current) => ({ ...current, setpoint }))
                    }
                    onOutputLimitChange={(key, value) =>
                        setParameters((current) => ({ ...current, [key]: value }))
                    }
                    onReset={resetExperiment}
                />
            </Reveal>
            <Reveal>
                <SharedAnalysisSection
                    title="Response performance"
                    icon={Gauge}
                    description="The metrics are recalculated from the simulated closed-loop response. A missing settling time means the response did not enter and remain within the 2% band during the displayed simulation."
                >
                    <div className="space-y-4">
                        <PIDMetrics metrics={metrics} steadyStateTarget={parameters.setpoint} />
                        <PIDValidationChecks />
                    </div>
                </SharedAnalysisSection>
            </Reveal>
            <Reveal>
                <section id="challenge" className="scroll-mt-24 space-y-3">
                    <PIDPredictionExercise />
                </section>
            </Reveal>
            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
