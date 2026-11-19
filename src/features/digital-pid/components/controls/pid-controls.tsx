import type {
    PIDSimulationConfig,
    PlantModel,
} from "../../domain/pid-types";

interface PIDControlsProps {
    config: PIDSimulationConfig;
    onChange: (config: PIDSimulationConfig) => void;
}

export function PIDControls({ config, onChange }: PIDControlsProps) {
    const updateGains = (key: "kp" | "ki" | "kd", value: number) => {
        onChange({
            ...config,
            gains: {
                ...config.gains,
                [key]: value,
            },
        });
    };

    const updatePlant = (updates: Partial<PlantModel>) => {
        onChange({
            ...config,
            plant: {
                ...config.plant,
                ...updates,
            } as PlantModel,
        });
    };

    const updateValue = (
        key: "setpoint" | "duration" | "dt",
        value: number
    ) => {
        onChange({
            ...config,
            [key]: value,
        });
    };

    const changePlantType = (type: "first-order" | "second-order") => {
        const plant: PlantModel =
            type === "first-order"
                ? {
                    type: "first-order",
                    gain: 1,
                    timeConstant: 1,
                }
                : {
                    type: "second-order",
                    gain: 1,
                    naturalFrequency: 2,
                    dampingRatio: 0.5,
                };

        onChange({
            ...config,
            plant,
        });
    };

    return (
        <section className="pid-controls">
            <h2>Digital PID Controller</h2>

            <div className="control-group">
                <label>Plant Type</label>
                <select
                    value={config.plant.type}
                    onChange={(e) =>
                        changePlantType(
                            e.target.value as "first-order" | "second-order"
                        )
                    }
                >
                    <option value="first-order">First Order</option>
                    <option value="second-order">Second Order</option>
                </select>
            </div>

            <h3>PID Gains</h3>

            <div className="control-group">
                <label>Kp (Proportional)</label>
                <input
                    type="number"
                    step="0.1"
                    value={config.gains.kp}
                    onChange={(e) => updateGains("kp", Number(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>Ki (Integral)</label>
                <input
                    type="number"
                    step="0.1"
                    value={config.gains.ki}
                    onChange={(e) => updateGains("ki", Number(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>Kd (Derivative)</label>
                <input
                    type="number"
                    step="0.1"
                    value={config.gains.kd}
                    onChange={(e) => updateGains("kd", Number(e.target.value))}
                />
            </div>

            <h3>Plant Parameters</h3>

            <div className="control-group">
                <label>Plant Gain</label>
                <input
                    type="number"
                    step="0.1"
                    value={config.plant.gain}
                    onChange={(e) =>
                        updatePlant({ gain: Number(e.target.value) })                    }
                />
            </div>

            {config.plant.type === "first-order" ? (
                <div className="control-group">
                    <label>Time Constant</label>
                    <input
                        type="number"
                        min="0.01"
                        step="0.1"
                        value={config.plant.timeConstant}
                        onChange={(e) =>
                            updatePlant({ timeConstant: Number(e.target.value) })
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="control-group">
                        <label>Natural Frequency</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.1"
                            value={config.plant.naturalFrequency}
                            onChange={(e) =>
                                updatePlant({
                                    naturalFrequency: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    <div className="control-group">
                        <label>Damping Ratio</label>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={config.plant.dampingRatio}
                            onChange={(e) =>
                                updatePlant({
                                    dampingRatio: Number(e.target.value),
                                })
                            }
                        />
                    </div>
                </>
            )}

            <h3>Simulation Settings</h3>

            <div className="control-group">
                <label>Setpoint</label>
                <input
                    type="number"
                    step="0.1"
                    value={config.setpoint}
                    onChange={(e) =>
                        updateValue("setpoint", Number(e.target.value))
                    }
                />
            </div>

            <div className="control-group">
                <label>Simulation Duration (seconds)</label>
                <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={config.duration}
                    onChange={(e) =>
                        updateValue("duration", Number(e.target.value))
                    }
                />
            </div>

            <div className="control-group">
                <label>Time Step (dt)</label>
                <input
                    type="number"
                    min="0.001"
                    step="0.01"
                    value={config.dt}
                    onChange={(e) =>
                        updateValue("dt", Number(e.target.value))
                    }
                />
            </div>

            <h3>Output Limits</h3>

            <div className="control-group">
                <label>Minimum Output</label>
                <input
                    type="number"
                    value={config.outputLimits.min}
                    onChange={(e) =>
                        onChange({
                            ...config,
                            outputLimits: {
                                ...config.outputLimits,
                                min: Number(e.target.value),
                            },
                        })
                    }
                />
            </div>

            <div className="control-group">
                <label>Maximum Output</label>
                <input
                    type="number"
                    value={config.outputLimits.max}
                    onChange={(e) =>
                        onChange({
                            ...config,
                            outputLimits: {
                                ...config.outputLimits,
                                max: Number(e.target.value),
                            },
                        })
                    }
                />
            </div>
        </section>
    );
}