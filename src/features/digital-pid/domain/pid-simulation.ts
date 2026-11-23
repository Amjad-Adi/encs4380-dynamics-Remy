import {
    createDefaultPlantSelection,
    getSelectedPlant,
    getStepResponseMetrics,
    simulateContinuousPID,
    simulateDigitalPID,
    type ContinuousPIDPoint,
} from '@/features/control/domain';

import type { DigitalPIDParameters, PIDSimulationConfig, PIDSimulationResult } from './pid-types';

/**
 * P3 · Digital PID. A sampled controller with a zero-order hold drives the shared
 * continuous plant; the loop, plant models and metrics come from the shared Control core.
 */

export const DEFAULT_DIGITAL_PID_PARAMETERS: DigitalPIDParameters = {
    ...createDefaultPlantSelection('first-order'),
    gains: { kp: 2, ki: 1, kd: 0.5 },
    setpoint: 1,
    outputLimits: { min: -10, max: 10 },
    duration: 10,
    sampleTime: 0.05,
};

export const SAMPLE_TIME_RANGE = { min: 0.001, max: 0.5, step: 0.001 } as const;

export function createDefaultDigitalPIDParameters(): DigitalPIDParameters {
    return {
        ...DEFAULT_DIGITAL_PID_PARAMETERS,
        ...createDefaultPlantSelection(DEFAULT_DIGITAL_PID_PARAMETERS.plantType),
        gains: { ...DEFAULT_DIGITAL_PID_PARAMETERS.gains },
        outputLimits: { ...DEFAULT_DIGITAL_PID_PARAMETERS.outputLimits },
    };
}

export function toSimulationConfig(parameters: DigitalPIDParameters): PIDSimulationConfig {
    return {
        plant: getSelectedPlant(parameters),
        gains: parameters.gains,
        setpoint: parameters.setpoint,
        outputLimits: parameters.outputLimits,
        duration: parameters.duration,
        sampleTime: parameters.sampleTime,
    };
}

export function simulatePID(config: PIDSimulationConfig): PIDSimulationResult {
    const { samples, trajectory, diverged } = simulateDigitalPID({
        plant: config.plant,
        gains: config.gains,
        setpoint: config.setpoint,
        limits: config.outputLimits,
        sampleTime: config.sampleTime,
        duration: config.duration,
    });

    return {
        samples,
        trajectory,
        // Measured on the continuous plant output so inter-sample peaks are not missed.
        metrics: getStepResponseMetrics(trajectory, config.setpoint),
        diverged,
    };
}

/**
 * The same plant, gains and limits under the continuous P1 controller, used as the
 * Ts → 0 reference for the digital response.
 */
export function simulateContinuousReference(config: PIDSimulationConfig): ContinuousPIDPoint[] {
    if (config.duration <= 0) return [];
    return simulateContinuousPID(
        {
            plant: config.plant,
            gains: config.gains,
            setpoint: config.setpoint,
            limits: config.outputLimits,
        },
        config.duration,
        2001,
    ).points;
}
