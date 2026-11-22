import {
    DEFAULT_PID_PARAMETERS,
    type PIDGains,
    type PIDPerformanceMetrics,
    type PIDPlaygroundParameters,
    type PIDResponsePoint,
} from '@/features/pid-playground/domain/pid-playground';
import {
    generateSensorChallenge,
    type SensorParameters,
} from '@/features/sensor-challenge/domain/sensor-challenge';

export type HiddenPlant = SensorParameters;
export type SpecKey = 'overshoot' | 'settlingTime' | 'steadyStateError';

export interface TuningSpec {
    maxOvershoot: number;
    maxSettlingTime: number;
    maxSteadyStateError: number;
}
export interface SpecResult {
    key: SpecKey;
    label: string;
    measured: number | null;
    limit: number;
    unit: string;
    pass: boolean;
    points: number;
    maxPoints: number;
}
export interface TuningEvaluation {
    results: SpecResult[];
    score: number;
    allPassed: boolean;
}

export const TUNING_SPEC: TuningSpec = {
    maxOvershoot: 10,
    maxSettlingTime: 3,
    maxSteadyStateError: 0.01,
};

export const DEFAULT_TUNING_GAINS: PIDGains = { kp: 1, ki: 0, kd: 0 };

// A fixed window keeps the spec limits readable on the plot; it is over three times the settling limit.
export const TUNING_DURATION = 10;

/** Draws a hidden plant from the same random model family as Homework 1 Module 4. */
export function generateHiddenPlant(random: () => number = Math.random): HiddenPlant {
    return generateSensorChallenge(random).parameters;
}

export function getTuningParameters(plant: HiddenPlant, gains: PIDGains): PIDPlaygroundParameters {
    const base = { ...DEFAULT_PID_PARAMETERS, gains: { ...gains } };
    if (plant.type === 'first-order')
        return { ...base, plantType: 'first-order', firstOrder: { gain: 1, tau: plant.tau } };
    // Unit-DC-gain form of ωn²/(s²+2ζωn·s+ωn²), matching Module 4's normalized response.
    return {
        ...base,
        plantType: 'second-order',
        secondOrder: { m: 1 / plant.omegaN ** 2, b: (2 * plant.zeta) / plant.omegaN, k: 1 },
    };
}

/** Unlike the playground metric, the spec measures settling against the setpoint, not the final value. */
function getSetpointSettlingTime(points: PIDResponsePoint[], setpoint: number): number | null {
    const band = Math.abs(setpoint) * 0.02;
    let lastOutsideIndex = -1;
    points.forEach((point, index) => {
        if (Math.abs(point.output - setpoint) > band) lastOutsideIndex = index;
    });
    if (lastOutsideIndex === -1) return 0;
    return lastOutsideIndex < points.length - 1 ? points[lastOutsideIndex + 1].time : null;
}

export function evaluateTuning(
    points: PIDResponsePoint[],
    metrics: PIDPerformanceMetrics,
    setpoint: number,
    spec: TuningSpec = TUNING_SPEC,
): TuningEvaluation {
    const errorFraction = metrics.steadyStateError / Math.abs(setpoint);
    const overshoot = Math.max(0, ((metrics.peakOutput - setpoint) / Math.abs(setpoint)) * 100);
    const checks = [
        {
            key: 'overshoot' as const,
            label: 'Maximum overshoot',
            measured: overshoot,
            limit: spec.maxOvershoot,
            unit: '%',
        },
        {
            key: 'settlingTime' as const,
            label: 'Settling time (2%)',
            measured: getSetpointSettlingTime(points, setpoint),
            limit: spec.maxSettlingTime,
            unit: 's',
        },
        {
            key: 'steadyStateError' as const,
            label: 'Steady-state error',
            measured: errorFraction * 100,
            limit: spec.maxSteadyStateError * 100,
            unit: '% of setpoint',
        },
    ];
    const maxPoints = 100 / checks.length;
    const results = checks.map((check) => {
        const pass = check.measured !== null && check.measured <= check.limit;
        // A failed part keeps partial credit in proportion to how close it came to the limit.
        const points =
            check.measured === null
                ? 0
                : pass
                  ? maxPoints
                  : maxPoints * Math.min(1, check.limit / check.measured);
        return { ...check, pass, points, maxPoints };
    });
    const allPassed = results.every((result) => result.pass);
    const total = Math.round(results.reduce((sum, result) => sum + result.points, 0));
    // Only a design that meets every part of the spec can reach the full score.
    return { results, score: allPassed ? 100 : Math.min(99, total), allPassed };
}

export function describeHiddenPlant(plant: HiddenPlant): string {
    if (plant.type === 'first-order') return `First-order · K = 1, τ = ${plant.tau.toFixed(3)} s`;
    return `Second-order · ζ = ${plant.zeta.toFixed(3)}, ωn = ${plant.omegaN.toFixed(3)} rad/s`;
}
