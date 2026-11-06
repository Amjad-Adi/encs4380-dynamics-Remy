export interface PhysicalParameters {
    m: number;
    b: number;
    k: number;
}

export interface ResponsePoint {
    time: number;
    displacement: number;
    normalizedResponse: number;
}

export interface ComplexPole {
    real: number;
    imaginary: number;
}

export interface StateSpaceMatrices {
    A: [[number, number], [number, number]];
    B: [[number], [number]];
    C: [[number, number]];
}

export interface ResponseMetrics {
    riseTime: number;
    peakTime: number | null;
    percentageOvershoot: number;
    settlingTime: number | null;
}

export interface PhasePlanePoint {
    time: number;
    displacement: number;
    velocity: number;
    normalizedDisplacement: number;
}

export interface ValidationResult {
    label: string;
    expected: number;
    actual: number;
    unit: string;
    passed: boolean;
}

export const REQUIRED_VALIDATION_PARAMETERS: Readonly<PhysicalParameters> = {
    m: 1,
    b: 2,
    k: 4,
};

const VALIDATION_TOLERANCE = 1e-9;
const CRITICAL_DAMPING_TOLERANCE = 32 * Number.EPSILON;
const SETTLING_BAND = 0.02;
const RISE_START_LEVEL = 0.1;
const RISE_END_LEVEL = 0.9;

export type DampingRegime =
    | 'undamped'
    | 'underdamped'
    | 'critical'
    | 'overdamped';

function validateParameters({ m, b, k }: PhysicalParameters): void {
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

function validateTime(time: number): void {
    if (!Number.isFinite(time) || time < 0) {
        throw new RangeError('Time must be a finite nonnegative number.');
    }
}

export function getDampingRegime(
    parameters: PhysicalParameters,
): DampingRegime {
    validateParameters(parameters);
    if (parameters.b === 0) return 'undamped';

    const zeta =
        parameters.b / (2 * Math.sqrt(parameters.m * parameters.k));
    const criticalTolerance =
        CRITICAL_DAMPING_TOLERANCE * Math.max(1, Math.abs(zeta));

    if (Math.abs(zeta - 1) <= criticalTolerance) return 'critical';
    return zeta < 1 ? 'underdamped' : 'overdamped';
}

function getNormalizedResponseUnchecked(
    time: number,
    parameters: PhysicalParameters,
): number {
    const omegaN = Math.sqrt(parameters.k / parameters.m);
    const zeta = parameters.b / (2 * Math.sqrt(parameters.m * parameters.k));
    const regime = getDampingRegime(parameters);

    if (regime === 'undamped') {
        return 1 - Math.cos(omegaN * time);
    }

    if (regime === 'underdamped') {
        const dampedFrequency = omegaN * Math.sqrt(1 - zeta ** 2);
        const decay = Math.exp(-zeta * omegaN * time);
        return 1 - decay * (
            Math.cos(dampedFrequency * time) +
            (zeta / Math.sqrt(1 - zeta ** 2)) *
            Math.sin(dampedFrequency * time)
        );
    }

    if (regime === 'critical') {
        return 1 - (1 + omegaN * time) * Math.exp(-omegaN * time);
    }

    const root = omegaN * Math.sqrt(zeta ** 2 - 1);
    const slowPole = -zeta * omegaN + root;
    const fastPole = -zeta * omegaN - root;
    const poleDifference = slowPole - fastPole;
    return 1 + (
        fastPole * Math.exp(slowPole * time) -
        slowPole * Math.exp(fastPole * time)
    ) / poleDifference;
}

function getVelocityUnchecked(
    time: number,
    parameters: PhysicalParameters,
): number {
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
            Math.exp(-zeta * omegaN * time) *
            Math.sin(dampedFrequency * time) /
            (m * dampedFrequency)
        );
    }

    if (regime === 'critical') {
        return (time / m) * Math.exp(-omegaN * time);
    }

    const root = omegaN * Math.sqrt(zeta ** 2 - 1);
    const slowPole = -zeta * omegaN + root;
    const fastPole = -zeta * omegaN - root;

    return (
        (Math.exp(slowPole * time) - Math.exp(fastPole * time)) /
        (m * (slowPole - fastPole))
    );
}

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
        (dampedFrequency * Math.log(1 / SETTLING_BAND)) /
        (Math.PI * decayRate),
    );
    const high = extremumIndex * Math.PI / dampedFrequency;
    const low = (extremumIndex - 1) * Math.PI / dampedFrequency;
    const crossingIsIncreasing = extremumIndex % 2 === 1;

    return bisectCrossing(
        crossingIsIncreasing ? 1 - SETTLING_BAND : 1 + SETTLING_BAND,
        low,
        high,
        (time) => getNormalizedResponseUnchecked(time, parameters),
        crossingIsIncreasing,
    );
}

/**
 * Returns ωn = sqrt(k / m), in radians per second.
 */
export function getNaturalFrequency(
    parameters: PhysicalParameters,
): number {
    validateParameters(parameters);
    return Math.sqrt(parameters.k / parameters.m);
}

/**
 * Returns ζ = b / (2 sqrt(mk)).
 */
export function getDampingRatio(parameters: PhysicalParameters): number {
    validateParameters(parameters);
    return parameters.b / (2 * Math.sqrt(parameters.m * parameters.k));
}

/**
 * Returns normalized unit-step displacement kx(t), whose final value is 1.
 */
export function getNormalizedStepResponse(
    time: number,
    parameters: PhysicalParameters,
): number {
    validateTime(time);
    validateParameters(parameters);
    return getNormalizedResponseUnchecked(time, parameters);
}

/**
 * Returns physical displacement x(t) for a 1 N force step from rest.
 */
export function getStepResponse(
    time: number,
    parameters: PhysicalParameters,
): number {
    return getNormalizedStepResponse(time, parameters) / parameters.k;
}

/**
 * Returns the undamped unit-force step displacement; requires b = 0.
 */
export function getUndampedStepResponse(
    time: number,
    parameters: PhysicalParameters,
): number {
    validateTime(time);
    validateParameters(parameters);
    if (getDampingRegime(parameters) !== 'undamped') {
        throw new RangeError('The undamped response requires b = 0.');
    }
    return (1 - Math.cos(getNaturalFrequency(parameters) * time)) / parameters.k;
}

/**
 * Returns the underdamped unit-force step displacement; requires 0 < ζ < 1.
 */
export function getUnderdampedStepResponse(
    time: number,
    parameters: PhysicalParameters,
): number {
    validateTime(time);
    validateParameters(parameters);
    const zeta = getDampingRatio(parameters);
    if (getDampingRegime(parameters) !== 'underdamped') {
        throw new RangeError('The underdamped response requires 0 < ζ < 1.');
    }
    return getNormalizedResponseUnchecked(time, parameters) / parameters.k;
}

/**
 * Returns the critically damped unit-force step displacement; requires ζ = 1.
 */
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

/**
 * Returns the overdamped unit-force step displacement; requires ζ > 1.
 */
export function getOverdampedStepResponse(
    time: number,
    parameters: PhysicalParameters,
): number {
    validateTime(time);
    validateParameters(parameters);
    if (getDampingRegime(parameters) !== 'overdamped') {
        throw new RangeError('The overdamped response requires ζ > 1.');
    }
    return getNormalizedResponseUnchecked(time, parameters) / parameters.k;
}

/**
 * Returns both roots of ms² + bs + k = 0 as a real pole or conjugate pair.
 */
export function getSystemPoles(
    parameters: PhysicalParameters,
): ComplexPole[] {
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

/**
 * Returns the physical realization for states [x, ẋ] and force input F.
 */
export function getStateSpaceMatrices(
    parameters: PhysicalParameters,
): StateSpaceMatrices {
    validateParameters(parameters);
    const { m, b, k } = parameters;
    return {
        A: [[0, 1], [-k / m, -b / m]],
        B: [[0], [1 / m]],
        C: [[1, 0]],
    };
}

/**
 * Returns eigenvalues calculated from the independently constructed matrix A.
 */
export function getEigenvaluesOfA(
    parameters: PhysicalParameters,
): ComplexPole[] {
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

/**
 * Computes 10–90% rise time, peak metrics, and the 2% settling time.
 * Undamped systems never settle; non-underdamped systems have no finite peak.
 */
export function getResponseMetrics(
    parameters: PhysicalParameters,
): ResponseMetrics {
    validateParameters(parameters);
    const omegaN = getNaturalFrequency(parameters);
    const zeta = getDampingRatio(parameters);
    const regime = getDampingRegime(parameters);
    const underdamped =
        regime === 'undamped' || regime === 'underdamped';
    const peakTime = underdamped
        ? Math.PI / (omegaN * Math.sqrt(1 - zeta ** 2))
        : null;
    const normalizedResponse = (time: number) =>
        getNormalizedResponseUnchecked(time, parameters);

    const riseStartTime = underdamped
        ? bisectIncreasingCrossing(
            RISE_START_LEVEL,
            0,
            peakTime as number,
            normalizedResponse,
        )
        : getMonotonicCrossing(
            RISE_START_LEVEL,
            normalizedResponse,
            1 / omegaN,
        );
    const riseEndTime = underdamped
        ? bisectIncreasingCrossing(
            RISE_END_LEVEL,
            0,
            peakTime as number,
            normalizedResponse,
        )
        : getMonotonicCrossing(
            RISE_END_LEVEL,
            normalizedResponse,
            1 / omegaN,
        );

    let settlingTime: number | null;
    if (regime === 'undamped') {
        settlingTime = null;
    } else if (underdamped) {
        settlingTime = getUnderdampedSettlingTime(parameters, zeta, omegaN);
    } else {
        settlingTime = getMonotonicCrossing(
            1 - SETTLING_BAND,
            normalizedResponse,
            1 / omegaN,
        );
    }

    const percentageOvershoot = underdamped
        ? 100 * Math.exp(
            (-Math.PI * zeta) / Math.sqrt(1 - zeta ** 2),
        )
        : 0;

    return {
        riseTime: riseEndTime - riseStartTime,
        peakTime,
        percentageOvershoot,
        settlingTime,
    };
}

/**
 * Samples the exact unit-force step response; normalizedResponse is kx(t).
 */
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

/**
 * Samples the exact phase-plane path [x(t), ẋ(t)] for the unit-force step.
 */
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
        const normalizedDisplacement =
            getNormalizedResponseUnchecked(time, parameters);
        return {
            time,
            displacement: normalizedDisplacement / parameters.k,
            velocity: getVelocityUnchecked(time, parameters),
            normalizedDisplacement,
        };
    });
}

/**
 * Checks the assignment's m=1, b=2, k=4 benchmark.
 */
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
                Math.hypot(
                    pole.real - eigenvalue.real,
                    pole.imaginary - eigenvalue.imaginary,
                ),
            ),
        ),
    );
    const poleEigenvalueDifference = Math.max(...unmatchedPoleDifferences);
    const settlingTime = getResponseMetrics(parameters).settlingTime;
    const steadyStateTime = 100;
    const initialPhasePoint =
        generatePhasePlaneTrajectory(parameters, 1, 2)[0];
    const results: Array<Omit<ValidationResult, 'passed'>> = [
        {
            label: 'Damping ratio, m=1, b=2, k=4',
            expected: 0.5,
            actual: getDampingRatio(parameters),
            unit: '—',
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
        ...([
            ['A[0][0]', matrices.A[0][0], 0],
            ['A[0][1]', matrices.A[0][1], 1],
            ['A[1][0]', matrices.A[1][0], -4],
            ['A[1][1]', matrices.A[1][1], -2],
            ['B[0][0]', matrices.B[0][0], 0],
            ['B[1][0]', matrices.B[1][0], 1],
            ['C[0][0]', matrices.C[0][0], 1],
            ['C[0][1]', matrices.C[0][1], 0],
        ] as Array<[string, number, number]>).map(([label, actual, expected]) => ({
            label: `State-space matrix ${label}, m=1, b=2, k=4`,
            actual,
            expected,
            unit: '—',
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
            unit: '—',
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
            actual:
                getNormalizedStepResponse(settlingTime as number, parameters) -
                1,
            unit: 'signed fraction',
        },
        ...([
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
        ] as const).map(({ label, parameters: caseParameters, expectedSignedError }) => {
            const caseSettlingTime =
                getResponseMetrics(caseParameters).settlingTime;
            return {
                label: `${label} settling-time boundary`,
                expected: expectedSignedError,
                actual:
                    caseSettlingTime === null
                        ? Number.NaN
                        : getNormalizedStepResponse(
                            caseSettlingTime,
                            caseParameters,
                        ) - 1,
                unit: 'signed fraction',
            };
        }),
        {
            label: 'Undamped system has no settling time',
            expected: 0,
            actual:
                getResponseMetrics({ m: 1, b: 0, k: 4 }).settlingTime === null
                    ? 0
                    : 1,
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

function validateSampleCount(samples: number): void {
    if (!Number.isInteger(samples) || samples < 2) {
        throw new RangeError('Sample count must be an integer of at least 2.');
    }
}
