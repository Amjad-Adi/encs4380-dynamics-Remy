import { CRITICAL_DAMPING_TOLERANCE } from './constants';
import type { ComplexPole, PhysicalParameters, StateSpaceMatrices } from './types';
import {
    getDampingRatio,
    getDampingRegime,
    getNaturalFrequency,
    validateParameters,
} from './parameters';

export function getSystemPoles(parameters: PhysicalParameters): ComplexPole[] {
    validateParameters(parameters);

    const omegaN = getNaturalFrequency(parameters);
    const zeta = getDampingRatio(parameters);
    const regime = getDampingRegime(parameters);

    if (regime === 'undamped' || regime === 'underdamped') {
        const dampedFrequency = omegaN * Math.sqrt(1 - zeta ** 2);

        return [
            { real: -zeta * omegaN, imaginary: dampedFrequency },
            { real: -zeta * omegaN, imaginary: -dampedFrequency },
        ];
    }

    if (regime === 'critical') {
        return [
            { real: -omegaN, imaginary: 0 },
            { real: -omegaN, imaginary: 0 },
        ];
    }

    const root = omegaN * Math.sqrt(zeta ** 2 - 1);

    return [
        { real: -zeta * omegaN + root, imaginary: 0 },
        { real: -zeta * omegaN - root, imaginary: 0 },
    ];
}

export function getStateSpaceMatrices(parameters: PhysicalParameters): StateSpaceMatrices {
    validateParameters(parameters);

    const { m, b, k } = parameters;

    return {
        A: [
            [0, 1],
            [-k / m, -b / m],
        ],
        B: [[0], [1 / m]],
        C: [[1, 0]],
    };
}

export function getEigenvaluesOfA(parameters: PhysicalParameters): ComplexPole[] {
    const { A } = getStateSpaceMatrices(parameters);

    const trace = A[0][0] + A[1][1];
    const determinant = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const discriminant = trace ** 2 - 4 * determinant;
    const scale = trace ** 2 + 4 * Math.abs(determinant);
    const tolerance = CRITICAL_DAMPING_TOLERANCE * scale;

    if (Math.abs(discriminant) <= tolerance) {
        return [
            { real: trace / 2, imaginary: 0 },
            { real: trace / 2, imaginary: 0 },
        ];
    }

    if (discriminant < 0) {
        const imaginary = Math.sqrt(-discriminant) / 2;

        return [
            { real: trace / 2, imaginary },
            { real: trace / 2, imaginary: -imaginary },
        ];
    }

    const root = Math.sqrt(discriminant);
    const stableRoot = 0.5 * (trace + Math.sign(trace) * root);
    const otherRoot = determinant / stableRoot;

    return [
        { real: stableRoot, imaginary: 0 },
        { real: otherRoot, imaginary: 0 },
    ];
}
