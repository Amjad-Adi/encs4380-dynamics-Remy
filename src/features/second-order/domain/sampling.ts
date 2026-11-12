import type { PhasePlanePoint, PhysicalParameters, ResponsePoint } from './types';
import { validateParameters } from './parameters';
import { getNormalizedResponseUnchecked, getVelocityUnchecked } from './response';

function validateSampleCount(samples: number): void {
    if (!Number.isInteger(samples) || samples < 2) {
        throw new RangeError('Sample count must be an integer of at least 2.');
    }
}

export function generateStepResponse(
    parameters: PhysicalParameters,
    duration: number,
    samples = 500,
): ResponsePoint[] {
    validateParameters(parameters);

    if (!Number.isFinite(duration) || duration < 0) {
        throw new RangeError('Duration must be a finite nonnegative number.');
    }

    validateSampleCount(samples);

    return Array.from({ length: samples }, (_, index) => {
        const time = (index / (samples - 1)) * duration;
        const normalizedResponse = getNormalizedResponseUnchecked(time, parameters);

        return {
            time,
            displacement: normalizedResponse / parameters.k,
            normalizedResponse,
        };
    });
}

export function generatePhasePlaneTrajectory(
    parameters: PhysicalParameters,
    duration: number,
    samples = 500,
): PhasePlanePoint[] {
    validateParameters(parameters);

    if (!Number.isFinite(duration) || duration < 0) {
        throw new RangeError('Duration must be a finite nonnegative number.');
    }

    validateSampleCount(samples);

    return Array.from({ length: samples }, (_, index) => {
        const time = (index / (samples - 1)) * duration;
        const normalizedDisplacement = getNormalizedResponseUnchecked(time, parameters);

        return {
            time,
            displacement: normalizedDisplacement / parameters.k,
            velocity: getVelocityUnchecked(time, parameters),
            normalizedDisplacement,
        };
    });
}
