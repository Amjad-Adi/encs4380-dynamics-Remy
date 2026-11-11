import { REQUIRED_VALIDATION_PARAMETERS, SETTLING_BAND, VALIDATION_TOLERANCE } from './constants';
import type { ValidationResult } from './types';
import { getDampingRatio, getNaturalFrequency } from './parameters';
import { getEigenvaluesOfA, getStateSpaceMatrices, getSystemPoles } from './poles';
import { getResponseMetrics } from './metrics';
import { getNormalizedStepResponse, getStepResponse } from './response';
import { generatePhasePlaneTrajectory } from './sampling';

export function getRequiredValidationResults(): ValidationResult[] {
    const parameters = REQUIRED_VALIDATION_PARAMETERS;
    const poles = getSystemPoles(parameters);
    const eigenvalues = getEigenvaluesOfA(parameters);
    const matrices = getStateSpaceMatrices(parameters);

    const positiveImaginaryPole = poles.find((pole) => pole.imaginary > 0);
    const negativeImaginaryPole = poles.find((pole) => pole.imaginary < 0);

    if (!positiveImaginaryPole || !negativeImaginaryPole) {
        throw new Error('The required validation case should have complex poles.');
    }

    const unmatchedPoleDifferences = poles.map((pole) =>
        Math.min(
            ...eigenvalues.map((eigenvalue) =>
                Math.hypot(pole.real - eigenvalue.real, pole.imaginary - eigenvalue.imaginary),
            ),
        ),
    );

    const poleEigenvalueDifference = Math.max(...unmatchedPoleDifferences);
    const settlingTime = getResponseMetrics(parameters).settlingTime;
    const steadyStateTime = 100;
    const initialPhasePoint = generatePhasePlaneTrajectory(parameters, 1, 2)[0];

    const results: Array<Omit<ValidationResult, 'passed'>> = [
        {
            label: 'Damping ratio, m=1, b=2, k=4',
            expected: 0.5,
            actual: getDampingRatio(parameters),
            unit: '-',
        },
        {
            label: 'Natural frequency, m=1, b=2, k=4',
            expected: 2,
            actual: getNaturalFrequency(parameters),
            unit: 'rad/s',
        },
        {
            label: 'Pole real part, m=1, b=2, k=4',
            expected: -1,
            actual: positiveImaginaryPole.real,
            unit: 's⁻¹',
        },
        {
            label: 'Positive pole imaginary part, m=1, b=2, k=4',
            expected: Math.sqrt(3),
            actual: positiveImaginaryPole.imaginary,
            unit: 'rad/s',
        },
        {
            label: 'Negative pole imaginary part, m=1, b=2, k=4',
            expected: -Math.sqrt(3),
            actual: negativeImaginaryPole.imaginary,
            unit: 'rad/s',
        },
        {
            label: 'Maximum eigenvalue/pole difference',
            expected: 0,
            actual: poleEigenvalueDifference,
            unit: 's⁻¹',
        },
        ...(
            [
                ['A[0][0]', matrices.A[0][0], 0],
                ['A[0][1]', matrices.A[0][1], 1],
                ['A[1][0]', matrices.A[1][0], -4],
                ['A[1][1]', matrices.A[1][1], -2],
                ['B[0][0]', matrices.B[0][0], 0],
                ['B[1][0]', matrices.B[1][0], 1],
                ['C[0][0]', matrices.C[0][0], 1],
                ['C[0][1]', matrices.C[0][1], 0],
            ] as Array<[string, number, number]>
        ).map(([label, actual, expected]) => ({
            label: `State-space matrix ${label}, m=1, b=2, k=4`,
            actual,
            expected,
            unit: '-',
        })),
        {
            label: 'Physical step-response steady state, m=1, b=2, k=4',
            expected: 1 / parameters.k,
            actual: getStepResponse(steadyStateTime, parameters),
            unit: 'm/N',
        },
        {
            label: 'Normalized step-response steady state, m=1, b=2, k=4',
            expected: 1,
            actual: getNormalizedStepResponse(steadyStateTime, parameters),
            unit: '-',
        },
        {
            label: 'Initial displacement, m=1, b=2, k=4',
            expected: 0,
            actual: initialPhasePoint.displacement,
            unit: 'm',
        },
        {
            label: 'Initial velocity, m=1, b=2, k=4',
            expected: 0,
            actual: initialPhasePoint.velocity,
            unit: 'm/s',
        },
        {
            label: 'Underdamped settling-time boundary, m=1, b=2, k=4',
            expected: -SETTLING_BAND,
            actual: getNormalizedStepResponse(settlingTime as number, parameters) - 1,
            unit: 'signed fraction',
        },
        ...(
            [
                {
                    label: 'Critically damped',
                    parameters: { m: 1, b: 4, k: 4 },
                    expectedSignedError: -SETTLING_BAND,
                },
                {
                    label: 'Overdamped',
                    parameters: { m: 1, b: 6, k: 4 },
                    expectedSignedError: -SETTLING_BAND,
                },
            ] as const
        ).map(({ label, parameters: caseParameters, expectedSignedError }) => {
            const caseSettlingTime = getResponseMetrics(caseParameters).settlingTime;

            return {
                label: `${label} settling-time boundary`,
                expected: expectedSignedError,
                actual:
                    caseSettlingTime === null
                        ? Number.NaN
                        : getNormalizedStepResponse(caseSettlingTime, caseParameters) - 1,
                unit: 'signed fraction',
            };
        }),
        {
            label: 'Undamped system has no settling time',
            expected: 0,
            actual: getResponseMetrics({ m: 1, b: 0, k: 4 }).settlingTime === null ? 0 : 1,
            unit: '0 = no settling time',
        },
    ];

    return results.map((result) => ({
        ...result,
        passed:
            Math.abs(result.actual - result.expected) <=
            VALIDATION_TOLERANCE * Math.max(1, Math.abs(result.expected)),
    }));
}
