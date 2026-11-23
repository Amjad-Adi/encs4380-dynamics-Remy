import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, CircuitBoard } from 'lucide-react';

import { Equation } from '@/components/modules/equation';
import { SharedModelOverview } from '@/components/modules/model-overview';
import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionHeading } from '@/components/modules/section-heading';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';
import { Reveal } from '@/components/ui/reveal';
import { ClosedLoopResponseCharts } from '@/features/control/components/closed-loop-response-charts';
import { PIDMetrics } from '@/features/control/components/pid-metrics';
import { getNyquistLoopGain, getStepResponseMetrics } from '@/features/control/domain';

import { PIDControls } from '../components/controls/pid-controls';
import { PIDDiagram } from '../components/diagram/pid-diagram';
import { SamplingComparison } from '../components/metrics/sampling-comparison';
import { DIGITAL_PID_SECTIONS } from '../components/page/digital-pid-sections';
import {
    createDefaultDigitalPIDParameters,
    simulateContinuousReference,
    simulatePID,
    toSimulationConfig,
} from '../domain/pid-simulation';
import type { DigitalPIDParameters } from '../domain/pid-types';

export default function DigitalPIDPage() {
    const [parameters, setParameters] = useState<DigitalPIDParameters>(
        createDefaultDigitalPIDParameters,
    );

    const config = useMemo(() => toSimulationConfig(parameters), [parameters]);
    const result = useMemo(() => simulatePID(config), [config]);
    const continuous = useMemo(() => simulateContinuousReference(config), [config]);
    const nyquistGain = getNyquistLoopGain(config.plant, config.gains, config.sampleTime);
    const continuousMetrics = useMemo(
        () => getStepResponseMetrics(continuous, config.setpoint),
        [continuous, config.setpoint],
    );

    function resetSimulation() {
        setParameters(createDefaultDigitalPIDParameters());
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    systemType="Digital control"
                    title="Digital PID controller"
                    description="Run the Module 01 controller on a microcontroller schedule: it samples the output every Ts seconds and holds its command until the next sample. Increase Ts and compare the sampled loop with the continuous one on the same plant."
                    onReset={resetSimulation}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={DIGITAL_PID_SECTIONS} />
            </Reveal>

            <Reveal>
                <SharedModelOverview
                    items={[
                        {
                            title: 'Discrete control law',
                            content: (
                                <Equation
                                    expression={String.raw`u[k]=K_pe[k]+K_iT_s\sum_{j=0}^{k-1}e[j]-K_d\frac{y[k]-y[k-1]}{T_s}`}
                                />
                            ),
                            description:
                                'The Module 01 law in sampled form: derivative on the measurement (equal to Kd·Δe/Ts for a constant setpoint), clamped to the actuator limits with the same conditional anti-windup.',
                        },
                        {
                            title: 'Shared plant models',
                            content: (
                                <div className="space-y-2">
                                    <Equation
                                        expression={String.raw`G_1(s)=\frac{K}{\tau s+1}`}
                                        className="py-0"
                                    />
                                    <Equation
                                        expression={String.raw`G_2(s)=\frac{1}{ms^2+bs+k}`}
                                        className="py-0"
                                    />
                                </div>
                            ),
                            description:
                                'The Homework 1 Module 01 first-order plant and Module 03 mass–spring–damper, identical to Modules 01 and 02.',
                        },
                        {
                            title: 'Zero-order hold',
                            content: (
                                <Equation
                                    expression={String.raw`u(t)=u[k],\quad kT_s\le t<(k+1)T_s`}
                                />
                            ),
                            description:
                                'Between samples the command is held while the continuous plant is integrated with the shared RK4 solver, so the plot shows the real inter-sample response.',
                        },
                    ]}
                />
            </Reveal>

            <Reveal>
                <SharedExperimentSection
                    description="Configure the sample period, plant, PID gains, setpoint and actuator limits. The sampled loop, the continuous reference and the metrics update whenever a parameter changes."
                    controls={
                        <PIDControls
                            parameters={parameters}
                            onChange={setParameters}
                            onReset={resetSimulation}
                        />
                    }
                    analysis={
                        <div className="space-y-4">
                            {result.diverged && (
                                <div className="border-destructive/30 bg-destructive/5 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    The sampled loop is unstable at this sample period and these
                                    gains; the run was stopped when the output diverged.
                                </div>
                            )}
                            {!result.diverged && nyquistGain !== null && nyquistGain >= 1 && (
                                <div className="border-warning/40 bg-warning/10 flex items-start gap-2 rounded-lg border p-3 text-sm">
                                    <AlertTriangle
                                        size={16}
                                        className="text-warning mt-0.5 shrink-0"
                                    />
                                    <span>
                                        The sampled loop gain at fs/2 is{' '}
                                        <span className="font-mono">{nyquistGain.toFixed(2)}</span>{' '}
                                        ≥ 1, so the output oscillates every other sample. The
                                        sampled derivative 2·Kd/Ts does not shrink with Ts: on a
                                        first-order plant it needs about K·Kd/τ &lt; 1. Lower Kd or
                                        Kp. The continuous loop has no such limit.
                                    </span>
                                </div>
                            )}
                            <ClosedLoopResponseCharts
                                points={result.trajectory}
                                samples={result.samples}
                                limits={parameters.outputLimits}
                                outputLabel={`Digital loop y(t), Ts = ${parameters.sampleTime} s`}
                                reference={{ label: 'Continuous loop (Module 01)', points: continuous }}
                                responseDescription="Plant output under the sampled controller, with the samples it reads and the continuous Module 01 loop for comparison."
                                controlDescription="The command changes only at the sampling instants (zero-order hold) and is clipped at the actuator limits."
                            />
                        </div>
                    }
                />
            </Reveal>

            <Reveal>
                <section id="architecture" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Control system architecture" icon={CircuitBoard} />
                    <p className="text-muted-foreground text-sm leading-6">
                        The controller computes an actuator command from the sampled feedback error.
                    </p>
                    <PIDDiagram
                        kp={parameters.gains.kp}
                        ki={parameters.gains.ki}
                        kd={parameters.gains.kd}
                    />
                </section>
            </Reveal>

            <Reveal>
                <SharedAnalysisSection
                    title="Response performance"
                    icon={Activity}
                    description="Metrics are measured on the continuous plant output, so overshoot between samples is not missed."
                >
                    <div className="space-y-4">
                        <PIDMetrics
                            metrics={result.metrics}
                            steadyStateTarget={parameters.setpoint}
                            title="Digital loop metrics"
                        />
                        <SamplingComparison
                            digital={result.metrics}
                            continuous={continuousMetrics}
                            sampleTime={parameters.sampleTime}
                        />
                    </div>
                </SharedAnalysisSection>
            </Reveal>


            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
