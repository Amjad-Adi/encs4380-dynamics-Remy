import type {
    ActuatorLimits,
    DigitalPIDSample,
    DigitalTrajectoryPoint,
    PIDGains,
    Plant,
    PlantSelection,
    PlantType,
    StepResponseMetrics,
} from '@/features/control/domain';

export type { ActuatorLimits as OutputLimits, PIDGains, Plant as PlantModel, PlantType };

export interface PIDSimulationConfig {
    plant: Plant;
    gains: PIDGains;
    setpoint: number;
    outputLimits: ActuatorLimits;
    duration: number;
    /** Controller sample period Ts (s). */
    sampleTime: number;
}

/** UI state: keeps both plant parameter sets so switching plant type keeps values. */
export interface DigitalPIDParameters extends PlantSelection {
    gains: PIDGains;
    setpoint: number;
    outputLimits: ActuatorLimits;
    duration: number;
    sampleTime: number;
}

export type SimulationSample = DigitalPIDSample;
export type TrajectoryPoint = DigitalTrajectoryPoint;
export type PIDPerformanceMetrics = StepResponseMetrics;

export interface PIDSimulationResult {
    /** Controller variables at the sampling instants t = k·Ts. */
    samples: SimulationSample[];
    /** Continuous plant output between samples (zero-order-hold input). */
    trajectory: TrajectoryPoint[];
    metrics: PIDPerformanceMetrics;
    diverged: boolean;
}
