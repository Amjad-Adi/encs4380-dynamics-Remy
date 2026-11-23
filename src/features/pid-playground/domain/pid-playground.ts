import {
    createDefaultPlantSelection,
    getSelectedPlant,
    getStepResponseMetrics,
    getSuggestedDuration,
    simulateContinuousPID,
    type ActuatorLimits,
    type ContinuousPIDPoint,
    type FirstOrderPlantParameters,
    type PIDGains,
    type Plant,
    type PlantSelection,
    type PlantType,
    type StepResponseMetrics,
} from '@/features/control/domain';

/**
 * P1 · PID Playground. The plant models, PID law, RK4 loop simulation and metrics
 * all come from the shared Control core in `@/features/control/domain`; this file
 * only adapts the playground's UI state to it.
 */

export type { FirstOrderPlantParameters, PIDGains, PlantType };

export interface PIDPlaygroundParameters extends PlantSelection {
    gains: PIDGains;
    setpoint: number;
    outputMin: number;
    outputMax: number;
}

/** Response sample common to the continuous (P1, P2, P4) and digital (P3, MySystem) loops. */
export type PIDResponsePoint = Pick<
    ContinuousPIDPoint,
    'time' | 'setpoint' | 'output' | 'error' | 'control' | 'unsaturatedControl' | 'integral'
>;

export type PIDPerformanceMetrics = StepResponseMetrics;

export const DEFAULT_PID_PARAMETERS: PIDPlaygroundParameters = {
    ...createDefaultPlantSelection('first-order'),
    gains: { kp: 9, ki: 0, kd: 0 },
    setpoint: 1,
    outputMin: 0,
    outputMax: 100,
};

export function createDefaultPIDParameters(): PIDPlaygroundParameters {
    return {
        ...DEFAULT_PID_PARAMETERS,
        ...createDefaultPlantSelection(DEFAULT_PID_PARAMETERS.plantType),
        gains: { ...DEFAULT_PID_PARAMETERS.gains },
    };
}

export function getPlaygroundPlant(parameters: PIDPlaygroundParameters): Plant {
    return getSelectedPlant(parameters);
}

export function getPlaygroundLimits(parameters: PIDPlaygroundParameters): ActuatorLimits {
    return { min: parameters.outputMin, max: parameters.outputMax };
}

/** Continuous PID loop with an ideal sensor, integrated by the shared RK4 core. */
export function simulatePID(
    parameters: PIDPlaygroundParameters,
    duration = 10,
    samples = 6001,
): ContinuousPIDPoint[] {
    return simulateContinuousPID(
        {
            plant: getPlaygroundPlant(parameters),
            gains: parameters.gains,
            setpoint: parameters.setpoint,
            limits: getPlaygroundLimits(parameters),
        },
        duration,
        samples,
    ).points;
}

/** Shared step metrics, measured against the final value. */
export function getPIDPerformanceMetrics(
    points: readonly PIDResponsePoint[],
): PIDPerformanceMetrics {
    return getStepResponseMetrics(points, points[0]?.setpoint ?? 0);
}

export function getSuggestedSimulationDuration(parameters: PIDPlaygroundParameters): number {
    return getSuggestedDuration(getPlaygroundPlant(parameters), parameters.gains);
}
