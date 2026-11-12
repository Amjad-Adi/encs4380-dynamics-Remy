import type { PhysicalParameters } from './types';

export const REQUIRED_VALIDATION_PARAMETERS: Readonly<PhysicalParameters> = {
    m: 1,
    b: 2,
    k: 4,
};

export const VALIDATION_TOLERANCE = 1e-9;
export const CRITICAL_DAMPING_TOLERANCE = 32 * Number.EPSILON;
export const SETTLING_BAND = 0.02;
export const RISE_START_LEVEL = 0.1;
export const RISE_END_LEVEL = 0.9;
