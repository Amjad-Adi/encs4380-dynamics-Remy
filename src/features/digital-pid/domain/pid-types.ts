
export type PlantType = "first-order" | "second-order";

export interface PIDGains {
    kp: number;
    ki: number;
    kd: number;
}

export interface OutputLimits {
    min: number;
    max: number;
}

export interface FirstOrderPlant {
    type: "first-order";
    gain: number;
    timeConstant: number;
}

export interface SecondOrderPlant {
    type: "second-order";
    gain: number;
    naturalFrequency: number;
    dampingRatio: number;
}

export type PlantModel = FirstOrderPlant | SecondOrderPlant;

export interface PIDSimulationConfig {
    plant: PlantModel;
    gains: PIDGains;
    setpoint: number;
    outputLimits: OutputLimits;
    duration: number;
    dt: number;
}

export interface SimulationSample {
    time: number;
    setpoint: number;
    output: number;
    error: number;
    control: number;
}

export interface PIDPerformanceMetrics {
    riseTime: number | null;
    overshoot: number;
    settlingTime: number | null;
    steadyStateError: number;
}

export interface PIDSimulationResult {
    samples: SimulationSample[];
    metrics: PIDPerformanceMetrics;
}
