import { useMemo, useState } from "react";
import { Activity, CircuitBoard } from "lucide-react";

import type { PIDSimulationConfig } from "../domain/pid-types";
import { simulatePID } from "../domain/pid-simulation";

import { ModuleFooter } from "@/components/modules/module-footer";
import { ModuleHeader } from "@/components/modules/module-header";
import { SectionNavigation } from "@/components/modules/section-navigation";
import { SharedAnalysisSection } from "@/components/modules/sections/analysis-section";
import { SharedExperimentSection } from "@/components/modules/sections/experiment-section";
import { SharedModelOverview } from "@/components/modules/model-overview";
import { SectionHeading } from "@/components/modules/section-heading";
import { Equation } from "@/components/modules/equation";
import { Reveal } from "@/components/ui/reveal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { PIDControls } from "../components/controls/pid-controls";
import { PIDResponseChart } from "../components/charts/pid-response-chart";
import { PIDMetrics } from "../components/metrics/pid-metrics";
import { PIDDiagram } from "../components/diagram/pid-diagram";
import { DIGITAL_PID_SECTIONS } from "../components/page/digital-pid-sections";

export default function DigitalPIDPage() {
    const [config, setConfig] = useState<PIDSimulationConfig>({
        plant: {
            type: "first-order",
            gain: 1,
            timeConstant: 1,
        },
        gains: {
            kp: 2,
            ki: 1,
            kd: 0.5,
        },
        setpoint: 1,
        outputLimits: {
            min: -10,
            max: 10,
        },
        duration: 10,
        dt: 0.01,
    });

    const result = useMemo(() => simulatePID(config), [config]);

    const resetSimulation = () => {
        setConfig({
            plant: {
                type: "first-order",
                gain: 1,
                timeConstant: 1,
            },
            gains: {
                kp: 2,
                ki: 1,
                kd: 0.5,
            },
            setpoint: 1,
            outputLimits: {
                min: -10,
                max: 10,
            },
            duration: 10,
            dt: 0.01,
        });
    };

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="10"
                    systemType="Digital control"
                    title="Digital PID controller"
                    description="Explore how proportional, integral, and derivative control shape a closed-loop response. Tune the plant and controller parameters, then observe the system response and performance metrics live."
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
                            title: "Control law",
                            content: (
                                <Equation
                                    expression={String.raw`u[k]=K_pe[k]+K_i\sum_{j=0}^{k}e[j]\Delta t+K_d\frac{e[k]-e[k-1]}{\Delta t}`}
                                />
                            ),
                            description:
                                "The proportional term reacts to current error, the integral term accumulates past error, and the derivative term responds to the error change.",
                        },
                        {
                            title: "Plant models",
                            content: (
                                <div className="space-y-2">
                                    <Equation
                                        expression={String.raw`G_1(s)=\frac{K}{\tau s+1}`}
                                        className="py-0"
                                    />
                                    <Equation
                                        expression={String.raw`G_2(s)=\frac{K\omega_n^2}{s^2+2\zeta\omega_ns+\omega_n^2}`}
                                        className="py-0"
                                    />
                                </div>
                            ),
                            description:
                                "Choose a first-order or second-order plant and adjust its gain and dynamics.",
                        },
                        {
                            title: "Feedback",
                            content: (
                                <div className="border-border bg-muted/50 rounded-lg border p-3">
                                    <p className="font-mono text-lg font-semibold">
                                        e[k] = r[k] - y[k]
                                    </p>
                                </div>
                            ),
                            description:
                                "The measured output is subtracted from the setpoint to form the controller error.",
                        },
                    ]}
                />
            </Reveal>

            <Reveal>
                <SharedExperimentSection
                    description="Configure the plant, PID gains, setpoint, time step, and actuator limits. The response updates whenever a parameter changes."
                    controls={
                        <PIDControls
                            config={config}
                            onChange={setConfig}
                        />
                    }
                    analysis={
                        <div className="space-y-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">System response</CardTitle>
                                    <CardDescription>
                                        Setpoint and simulated plant output
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PIDResponseChart samples={result.samples} />
                                </CardContent>
                            </Card>
                        </div>
                    }
                />
            </Reveal>

            <Reveal>
                <section id="architecture" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Control system architecture" icon={CircuitBoard} />
                    <p className="text-muted-foreground text-sm leading-6">
                        The controller computes an actuator command from the feedback error.
                    </p>
                    <PIDDiagram
                        kp={config.gains.kp}
                        ki={config.gains.ki}
                        kd={config.gains.kd}
                    />
                </section>
            </Reveal>

            <Reveal>
                <SharedAnalysisSection
                    title="Response performance"
                    icon={Activity}
                    description="Metrics are calculated from the simulated closed-loop response."
                >
                    <PIDMetrics
                        riseTime={result.metrics.riseTime}
                        settlingTime={result.metrics.settlingTime}
                        overshoot={result.metrics.overshoot}
                        steadyStateError={result.metrics.steadyStateError}
                    />
                </SharedAnalysisSection>
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}