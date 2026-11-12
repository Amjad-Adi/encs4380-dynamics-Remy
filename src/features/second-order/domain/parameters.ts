import { CRITICAL_DAMPING_TOLERANCE } from './constants';
import type { DampingRegime, PhysicalParameters } from './types';

export function validateParameters({ m, b, k }: PhysicalParameters): void {
    if (!Number.isFinite(m) || m <= 0) {
        throw new RangeError('Mass m must be a finite positive number.');
    }

    if (!Number.isFinite(b) || b < 0) {
        throw new RangeError('Damping b must be a finite nonnegative number.');
    }

    if (!Number.isFinite(k) || k <= 0) {
        throw new RangeError('Stiffness k must be a finite positive number.');
    }
}

export function validateTime(time: number): void {
    if (!Number.isFinite(time) || time < 0) {
        throw new RangeError('Time must be a finite nonnegative number.');
    }
}

export function getNaturalFrequency(parameters: PhysicalParameters): number {
    validateParameters(parameters);
    return Math.sqrt(parameters.k / parameters.m);
}

export function getDampingRatio(parameters: PhysicalParameters): number {
    validateParameters(parameters);
    return parameters.b / (2 * Math.sqrt(parameters.m * parameters.k));
}

export function getDampingRegime(parameters: PhysicalParameters): DampingRegime {
    validateParameters(parameters);

    if (parameters.b === 0) {
        return 'undamped';
    }

    const zeta = getDampingRatio(parameters);
    const criticalTolerance = CRITICAL_DAMPING_TOLERANCE * Math.max(1, Math.abs(zeta));

    if (Math.abs(zeta - 1) <= criticalTolerance) {
        return 'critical';
    }

    return zeta < 1 ? 'underdamped' : 'overdamped';
}
