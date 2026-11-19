import { useMemo, useState } from "react";
import "./digital-pid-page.css";

import type { PIDSimulationConfig } from "../domain/pid-types";
import { simulatePID } from "../domain/pid-simulation";

import { PIDControls } from "../components/controls/pid-controls";
import { PIDResponseChart } from "../components/charts/pid-response-chart";
import { PIDMetrics } from "../components/metrics/pid-metrics";
import { PIDDiagram } from "../components/diagram/pid-diagram";

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
        <main className="digital-pid-page">
            <div className="pid-page-container">

                {/* Header */}
                <header className="pid-page-header">
                    <div className="pid-module-badge">
                        MODULE 08 · CONTROL SYSTEMS
                    </div>

                    <h1>Digital PID Controller</h1>

                    <p>
                        Explore how proportional, integral, and derivative
                        control shape the behavior of a closed-loop system.
                        Adjust controller gains, experiment with plant
                        parameters, and observe the system response in real time.
                    </p>

                    <button
                        className="pid-reset-button"
                        onClick={resetSimulation}
                    >
                        Reset Simulation
                    </button>
                </header>

                {/* Introduction */}
                <section className="pid-intro-card">
                    <div className="pid-intro-icon">⚙</div>

                    <div>
                        <h2>Interactive PID Laboratory</h2>
                        <p>
                            Investigate the effect of PID tuning on system
                            stability, response speed, overshoot, and
                            steady-state performance.
                        </p>
                    </div>
                </section>

                {/* Controls */}
                <section className="pid-section">
                    <div className="pid-section-heading">
                        <span className="pid-section-number">01</span>

                        <div>
                            <h2>Controller Configuration</h2>
                            <p>
                                Configure your plant, controller gains,
                                and simulation settings.
                            </p>
                        </div>
                    </div>

                    <PIDControls
                        config={config}
                        onChange={setConfig}
                    />
                </section>

                {/* Diagram */}
                <section className="pid-section">
                    <div className="pid-section-heading">
                        <span className="pid-section-number">02</span>

                        <div>
                            <h2>Control System Architecture</h2>
                            <p>
                                Visual representation of the PID feedback loop.
                            </p>
                        </div>
                    </div>

                    <div className="pid-content-card">
                        <PIDDiagram
                            kp={config.gains.kp}
                            ki={config.gains.ki}
                            kd={config.gains.kd}
                        />
                    </div>
                </section>

                {/* Response */}
                <section className="pid-section">
                    <div className="pid-section-heading">
                        <span className="pid-section-number">03</span>

                        <div>
                            <h2>System Response</h2>
                            <p>
                                Observe the closed-loop response as the
                                controller tracks the desired setpoint.
                            </p>
                        </div>
                    </div>

                    <div className="pid-content-card pid-chart-card">
                        <PIDResponseChart
                            samples={result.samples}
                        />
                    </div>
                </section>

                {/* Metrics */}
                <section className="pid-section">
                    <div className="pid-section-heading">
                        <span className="pid-section-number">04</span>

                        <div>
                            <h2>Performance Analysis</h2>
                            <p>
                                Evaluate the performance of your PID
                                controller using calculated response metrics.
                            </p>
                        </div>
                    </div>

                    <div className="pid-content-card">
                        <PIDMetrics
                            riseTime={result.metrics.riseTime}
                            settlingTime={result.metrics.settlingTime}
                            overshoot={result.metrics.overshoot}
                            steadyStateError={
                                result.metrics.steadyStateError
                            }
                        />
                    </div>
                </section>

                {/* Footer */}
                <footer className="pid-page-footer">
                    <p>
                        Digital PID Controller · Interactive Dynamic Systems Laboratory
                    </p>
                </footer>
            </div>
        </main>
    );
}