import type { PhysicalParameters } from './types';
import {
    getDampingRatio,
    getDampingRegime,
    getNaturalFrequency,
    validateParameters,
    validateTime,
} from './parameters';

export function getNormalizedResponseUnchecked(
    time: number,
    parameters: PhysicalParameters,
): number {
    const omegaN = Math.sqrt(parameters.k / parameters.m);
    const zeta = getDampingRatio(parameters);
    const regime = getDampingRegime(parameters);

    if (regime === 'undamped') {
        return 1 - Math.cos(omegaN * time);
    }

    if (regime === 'underdamped') {
        const dampedFrequency = omegaN * Math.sqrt(1 - zeta ** 2);
        const decay = Math.exp(-zeta * omegaN * time);

        return (
            1 -
            decay *
                (Math.cos(dampedFrequency * time) +
                    (zeta / Math.sqrt(1 - zeta ** 2)) * Math.sin(dampedFrequency * time))
        );
    }

    if (regime === 'critical') {
        return 1 - (1 + omegaN * time) * Math.exp(-omegaN * time);
    }

    const root = omegaN * Math.sqrt(zeta ** 2 - 1);
    const slowPole = -zeta * omegaN + root;
    const fastPole = -zeta * omegaN - root;
    const poleDifference = slowPole - fastPole;

    return (
        1 +
        (fastPole * Math.exp(slowPole * time) - slowPole * Math.exp(fastPole * time)) /
            poleDifference
    );
}

export function getVelocityUnchecked(time: number, parameters: PhysicalParameters): number {
    const { m, b, k } = parameters;
    const omegaN = Math.sqrt(k / m);
    const zeta = b / (2 * Math.sqrt(m * k));
    const regime = getDampingRegime(parameters);

    if (regime === 'undamped') {
        return Math.sin(omegaN * time) / (m * omegaN);
    }

    if (regime === 'underdamped') {
        const dampedFrequency = omegaN * Math.sqrt(1 - zeta ** 2);

        return (
            (Math.exp(-zeta * omegaN * time) * Math.sin(dampedFrequency * time)) /
            (m * dampedFrequency)
        );
    }

    if (regime === 'critical') {
        return (time / m) * Math.exp(-omegaN * time);
    }

    const root = omegaN * Math.sqrt(zeta ** 2 - 1);
    const slowPole = -zeta * omegaN + root;
    const fastPole = -zeta * omegaN - root;

    return (Math.exp(slowPole * time) - Math.exp(fastPole * time)) / (m * (slowPole - fastPole));
}

export function getNormalizedStepResponse(time: number, parameters: PhysicalParameters): number {
    validateTime(time);
    validateParameters(parameters);

    return getNormalizedResponseUnchecked(time, parameters);
}

export function getStepResponse(time: number, parameters: PhysicalParameters): number {
    return getNormalizedStepResponse(time, parameters) / parameters.k;
}

export function getUndampedStepResponse(time: number, parameters: PhysicalParameters): number {
    validateTime(time);
    validateParameters(parameters);

    if (getDampingRegime(parameters) !== 'undamped') {
        throw new RangeError('The undamped response requires b = 0.');
    }

    return (1 - Math.cos(getNaturalFrequency(parameters) * time)) / parameters.k;
}

export function getUnderdampedStepResponse(time: number, parameters: PhysicalParameters): number {
    validateTime(time);
    validateParameters(parameters);

    if (getDampingRegime(parameters) !== 'underdamped') {
        throw new RangeError('The underdamped response requires 0 < ζ < 1.');
    }

    return getNormalizedResponseUnchecked(time, parameters) / parameters.k;
}

export function getCriticallyDampedStepResponse(
    time: number,
    parameters: PhysicalParameters,
): number {
    validateTime(time);
    validateParameters(parameters);

    if (getDampingRegime(parameters) !== 'critical') {
        throw new RangeError('The critically damped response requires ζ = 1.');
    }

    return getNormalizedResponseUnchecked(time, parameters) / parameters.k;
}

export function getOverdampedStepResponse(time: number, parameters: PhysicalParameters): number {
    validateTime(time);
    validateParameters(parameters);

    if (getDampingRegime(parameters) !== 'overdamped') {
        throw new RangeError('The overdamped response requires ζ > 1.');
    }

    return getNormalizedResponseUnchecked(time, parameters) / parameters.k;
}
