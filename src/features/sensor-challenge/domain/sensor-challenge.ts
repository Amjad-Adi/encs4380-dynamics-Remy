import {
    stepResponse,
    type FirstOrderParameters,
} from '@/features/first-order-time/domain/first-order-time';
import { getNormalizedStepResponse, type PhysicalParameters } from '@/features/second-order/domain';

export type SensorType = 'first-order' | 'second-order';

export type SensorParameters =
    { type: 'first-order'; tau: number } | { type: 'second-order'; zeta: number; omegaN: number };

export interface SensorSample {
    time: number;
    response: number;
    measurement: number;
}

export interface SensorChallenge {
    parameters: SensorParameters;
    duration: number;
    samples: SensorSample[];
}

export type SensorEstimate =
    { type: 'first-order'; tau: number } | { type: 'second-order'; zeta: number; omegaN: number };

export interface ParameterError {
    label: string;
    actual: number;
    estimate: number;
    percent: number;
    withinTolerance: boolean;
}

const SAMPLE_COUNT = 500;
const NOISE_STANDARD_DEVIATION = 0.012;

function randomBetween(min: number, max: number, random: () => number): number {
    return min + random() * (max - min);
}

function gaussianNoise(random: () => number): number {
    const u1 = Math.max(Number.MIN_VALUE, random());
    const u2 = random();
    const noise =
        Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * NOISE_STANDARD_DEVIATION;
    return Math.min(0.04, Math.max(-0.04, noise));
}

function getSecondOrderParameters(zeta: number, omegaN: number): PhysicalParameters {
    return {
        m: 1,
        b: 2 * zeta * omegaN,
        k: omegaN ** 2,
    };
}

export function getSensorResponse(parameters: SensorParameters, time: number): number {
    if (parameters.type === 'first-order') {
        const firstOrderParameters: FirstOrderParameters = {
            gain: 1,
            tau: parameters.tau,
            amplitude: 1,
        };
        return stepResponse(time, firstOrderParameters);
    }

    return getNormalizedStepResponse(
        time,
        getSecondOrderParameters(parameters.zeta, parameters.omegaN),
    );
}

export function generateSensorChallenge(random: () => number = Math.random): SensorChallenge {
    let parameters: SensorParameters;
    let duration: number;

    if (random() < 0.5) {
        const tau = randomBetween(0.45, 2.4, random);
        parameters = { type: 'first-order', tau };
        duration = 5 * tau;
    } else {
        const zeta = randomBetween(0.2, 0.8, random);
        const omegaN = randomBetween(0.8, 3.2, random);
        parameters = { type: 'second-order', zeta, omegaN };
        duration = Math.max(6 / omegaN, 5 / (zeta * omegaN));
    }

    const samples = Array.from({ length: SAMPLE_COUNT }, (_, index) => {
        const time = (index / (SAMPLE_COUNT - 1)) * duration;
        const response = getSensorResponse(parameters, time);
        const measurement = response + gaussianNoise(random);

        return { time, response, measurement };
    });

    return { parameters, duration, samples };
}

export function getParameterErrors(
    parameters: SensorParameters,
    estimate: SensorEstimate,
): ParameterError[] {
    let comparisons: Array<{
        label: string;
        actual: number;
        estimate: number;
    }>;
    if (parameters.type === 'first-order') {
        if (estimate.type !== 'first-order') return [];
        comparisons = [
            {
                label: 'Time constant τ',
                actual: parameters.tau,
                estimate: estimate.tau,
            },
        ];
    } else {
        if (estimate.type !== 'second-order') return [];
        comparisons = [
            {
                label: 'Damping ratio ζ',
                actual: parameters.zeta,
                estimate: estimate.zeta,
            },
            {
                label: 'Natural frequency ωn',
                actual: parameters.omegaN,
                estimate: estimate.omegaN,
            },
        ];
    }

    return comparisons.map(({ label, actual, estimate: predicted }) => {
        if (!Number.isFinite(predicted)) {
            throw new RangeError(`A finite estimate is required for ${label}.`);
        }

        const percent = (Math.abs(predicted - actual) / actual) * 100;
        return {
            label,
            actual,
            estimate: predicted,
            percent,
            withinTolerance: percent <= 10,
        };
    });
}

export function earnsFullCredit(parameters: SensorParameters, estimate: SensorEstimate): boolean {
    if (parameters.type !== estimate.type) return false;
    const errors = getParameterErrors(parameters, estimate);
    return errors.length > 0 && errors.every((error) => error.withinTolerance);
}
