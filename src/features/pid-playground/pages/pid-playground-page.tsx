import { useMemo, useState } from 'react';
import { Gauge } from 'lucide-react';
import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import { Reveal } from '@/components/ui/reveal';
import { PIDMetrics } from '@/features/control/components/pid-metrics';
import { updatePlantSelection, type PlantParameterKey } from '@/features/control/domain';
import {
    createDefaultPIDParameters,
    getPIDPerformanceMetrics,
    getSuggestedSimulationDuration,
    simulatePID,
    type PIDPlaygroundParameters,
    type PlantType,
} from '@/features/pid-playground/domain/pid-playground';
import { PIDValidationChecks } from '../components/analysis/pid-validation-checks';
import { PIDPredictionExercise } from '../components/exercises/pid-prediction-exercise';
import { PIDExperimentSection } from '../components/page/pid-experiment-section';
import { PIDModelOverview } from '../components/page/pid-model-overview';
import { PID_SECTIONS } from '../components/page/pid-sections';

export default function PIDPlaygroundPage() {
    const [parameters, setParameters] = useState<PIDPlaygroundParameters>(
        createDefaultPIDParameters,
    );
    const duration = useMemo(() => getSuggestedSimulationDuration(parameters), [parameters]);
    const points = useMemo(() => simulatePID(parameters, duration, 6001), [parameters, duration]);
    const metrics = useMemo(() => getPIDPerformanceMetrics(points), [points]);

    function updateGain(key: keyof PIDPlaygroundParameters['gains'], value: number) {
        if (!Number.isFinite(value)) return;
        setParameters((current) => ({ ...current, gains: { ...current.gains, [key]: value } }));
    }
    function updatePlantParameter(key: PlantParameterKey, value: number) {
        setParameters((current) => ({ ...current, ...updatePlantSelection(current, key, value) }));
    }
    function resetExperiment() {
        setParameters(createDefaultPIDParameters());
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    systemType="Feedback control"
                    title="PID control playground"
                    description="Explore how proportional, integral, and derivative control shape a closed-loop response. Compare first-order and second-order plants, inspect the actuator command, and tune the controller against live performance metrics."
                    onReset={resetExperiment}
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
                    description="The metrics are recalculated from the simulated closed-loop response with the same shared calculation used by every Control module. A missing settling time means the response did not enter and remain within the 2% band during the displayed simulation."
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
