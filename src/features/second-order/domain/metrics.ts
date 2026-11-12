import { RISE_END_LEVEL, RISE_START_LEVEL, SETTLING_BAND } from './constants';
import type { PhysicalParameters, ResponseMetrics } from './types';
import {
    getDampingRatio,
    getDampingRegime,
    getNaturalFrequency,
    validateParameters,
} from './parameters';
import { getNormalizedResponseUnchecked } from './response';

function bisectIncreasingCrossing(
    target: number,
    low: number,
    high: number,
    valueAt: (time: number) => number,
): number {
    for (let iteration = 0; iteration < 100; iteration += 1) {
        const middle = (low + high) / 2;

        if (valueAt(middle) < target) {
            low = middle;
        } else {
            high = middle;
        }
    }

    return (low + high) / 2;
}

function bisectCrossing(
    target: number,
    low: number,
    high: number,
    valueAt: (time: number) => number,
    increasing: boolean,
): number {
    for (let iteration = 0; iteration < 100; iteration += 1) {
        const middle = (low + high) / 2;
        const isBelowTarget = valueAt(middle) < target;

        if (isBelowTarget === increasing) {
            low = middle;
        } else {
            high = middle;
        }
    }

    return (low + high) / 2;
}

function getMonotonicCrossing(
    target: number,
    valueAt: (time: number) => number,
    initialHigh: number,
): number {
    let high = initialHigh;

    while (valueAt(high) < target) {
        high *= 2;

        if (!Number.isFinite(high)) {
            throw new RangeError('Could not bracket the response threshold.');
        }
    }

    return bisectIncreasingCrossing(target, 0, high, valueAt);
}

function getUnderdampedSettlingTime(
    parameters: PhysicalParameters,
    zeta: number,
    omegaN: number,
): number {
    const dampedFrequency = omegaN * Math.sqrt(1 - zeta ** 2);
    const decayRate = zeta * omegaN;
    const extremumIndex = Math.ceil(
        (dampedFrequency * Math.log(1 / SETTLING_BAND)) / (Math.PI * decayRate),
    );

    const high = (extremumIndex * Math.PI) / dampedFrequency;
    const low = ((extremumIndex - 1) * Math.PI) / dampedFrequency;
    const crossingIsIncreasing = extremumIndex % 2 === 1;

    return bisectCrossing(
        crossingIsIncreasing ? 1 - SETTLING_BAND : 1 + SETTLING_BAND,
        low,
        high,
        (time) => getNormalizedResponseUnchecked(time, parameters),
        crossingIsIncreasing,
    );
}

export function getResponseMetrics(parameters: PhysicalParameters): ResponseMetrics {
    validateParameters(parameters);

    const omegaN = getNaturalFrequency(parameters);
    const zeta = getDampingRatio(parameters);
    const regime = getDampingRegime(parameters);
    const underdamped = regime === 'undamped' || regime === 'underdamped';

    const peakTime = underdamped ? Math.PI / (omegaN * Math.sqrt(1 - zeta ** 2)) : null;

    const normalizedResponse = (time: number) => getNormalizedResponseUnchecked(time, parameters);

    const riseStartTime = underdamped
        ? bisectIncreasingCrossing(RISE_START_LEVEL, 0, peakTime as number, normalizedResponse)
        : getMonotonicCrossing(RISE_START_LEVEL, normalizedResponse, 1 / omegaN);

    const riseEndTime = underdamped
        ? bisectIncreasingCrossing(RISE_END_LEVEL, 0, peakTime as number, normalizedResponse)
        : getMonotonicCrossing(RISE_END_LEVEL, normalizedResponse, 1 / omegaN);

    let settlingTime: number | null;

    if (regime === 'undamped') {
        settlingTime = null;
    } else if (underdamped) {
        settlingTime = getUnderdampedSettlingTime(parameters, zeta, omegaN);
    } else {
        settlingTime = getMonotonicCrossing(1 - SETTLING_BAND, normalizedResponse, 1 / omegaN);
    }

    const percentageOvershoot = underdamped
        ? 100 * Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta ** 2))
        : 0;

    return {
        riseTime: riseEndTime - riseStartTime,
        peakTime,
        percentageOvershoot,
        settlingTime,
    };
}
