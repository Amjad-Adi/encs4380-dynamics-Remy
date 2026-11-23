import {
    createDefaultPlantSelection,
    getSelectedPlant,
    getStepResponseMetrics,
    simulateContinuousPID,
    type PIDGains,
    type PlantSelection,
    type StepResponseMetrics,
} from '@/features/control/domain';

/**
 * P2 · Slow sensor in the feedback loop. This is the P1 loop from the shared Control
 * core with a first-order sensor τs·ẏ_m + y_m = y between the plant and the controller.
 */

export interface SlowSensorPIDParameters extends PlantSelection {
    gains: PIDGains;
    setpoint: number;
    outputMin: number;
    outputMax: number;
    sensorTau: number;
}

export interface SlowSensorPIDResponsePoint {
    time: number;
    setpoint: number;
    trueOutput: number;
    measuredOutput: number;
    error: number;
    control: number;
    unsaturatedControl: number;
    integral: number;
    sensorRate: number;
}

export const DEFAULT_SLOW_SENSOR_PARAMETERS: SlowSensorPIDParameters = {
    ...createDefaultPlantSelection('first-order'),
    gains: { kp: 9, ki: 0, kd: 0 },
    setpoint: 1,
    outputMin: 0,
    outputMax: 100,
    sensorTau: 0.2,
};

export function createDefaultSlowSensorParameters(): SlowSensorPIDParameters {
    return {
        ...DEFAULT_SLOW_SENSOR_PARAMETERS,
        ...createDefaultPlantSelection(DEFAULT_SLOW_SENSOR_PARAMETERS.plantType),
        gains: { ...DEFAULT_SLOW_SENSOR_PARAMETERS.gains },
    };
}

export function simulateSlowSensorPID(
    p: SlowSensorPIDParameters,
    duration = 10,
    samples = 6001,
): SlowSensorPIDResponsePoint[] {
    if (!Number.isFinite(p.sensorTau) || p.sensorTau <= 0) {
        throw new RangeError('Sensor time constant must be positive.');
    }

    const { points } = simulateContinuousPID(
        {
            plant: getSelectedPlant(p),
            gains: p.gains,
            setpoint: p.setpoint,
            limits: { min: p.outputMin, max: p.outputMax },
            sensorTau: p.sensorTau,
        },
        duration,
        samples,
    );

    return points.map((point) => ({
        time: point.time,
        setpoint: point.setpoint,
        trueOutput: point.output,
        measuredOutput: point.measuredOutput,
        error: point.error,
        control: point.control,
        unsaturatedControl: point.unsaturatedControl,
        integral: point.integral,
        sensorRate: point.measurementRate,
    }));
}

/** Shared step metrics of the true plant output, measured against its final value as in P1. */
export function getSlowSensorMetrics(
    points: readonly SlowSensorPIDResponsePoint[],
    setpoint: number,
): StepResponseMetrics {
    return getStepResponseMetrics(
        points.map((point) => ({ time: point.time, output: point.trueOutput })),
        setpoint,
    );
}
