export interface NumericalOdeParameters {
    gain: number;
    timeConstant: number;
    amplitude: number;
    stepSize: number;
    duration: number;
}

export type FirstOrderSystemParameters = Pick<
    NumericalOdeParameters,
    'gain' | 'timeConstant' | 'amplitude'
>;

export interface NumericalOdePoint {
    time: number;
    analytical: number;
    euler: number;
    rk4: number;
}

export interface NumericalErrorMetrics {
    maximumAbsoluteError: number;
    rootMeanSquareError: number;
    finalTimeAbsoluteError: number;
}

export type EulerStabilityKind =
    | 'stable'
    | 'damped-oscillation'
    | 'marginal-oscillation'
    | 'unstable';

export interface EulerStabilityAssessment {
    kind: EulerStabilityKind;
    stepRatio: number;
    amplificationFactor: number;
    explanation: string;
}

export interface NumericalOdeComparison {
    points: NumericalOdePoint[];
    eulerError: NumericalErrorMetrics;
    rk4Error: NumericalErrorMetrics;
    eulerStability: EulerStabilityAssessment;
}

export function firstOrderStepDerivative(
    _time: number,
    output: number,
    { gain, timeConstant, amplitude }: FirstOrderSystemParameters,
): number {
    return (gain * amplitude - output) / timeConstant;
}

export function analyticalStepResponse(
    time: number,
    { gain, timeConstant, amplitude }: FirstOrderSystemParameters,
): number {
    return gain * amplitude * (1 - Math.exp(-time / timeConstant));
}

export function eulerStep(
    time: number,
    output: number,
    stepSize: number,
    parameters: FirstOrderSystemParameters,
): number {
    return output + stepSize * firstOrderStepDerivative(time, output, parameters);
}

export function rk4Step(
    time: number,
    output: number,
    stepSize: number,
    parameters: FirstOrderSystemParameters,
): number {
    const derivative = (t: number, y: number) =>
        firstOrderStepDerivative(t, y, parameters);
    const k1 = derivative(time, output);
    const k2 = derivative(time + stepSize / 2, output + (stepSize * k1) / 2);
    const k3 = derivative(time + stepSize / 2, output + (stepSize * k2) / 2);
    const k4 = derivative(time + stepSize, output + stepSize * k3);

    return output + (stepSize / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

export function assessEulerStability(
    stepSize: number,
    timeConstant: number,
): EulerStabilityAssessment {
    const stepRatio = stepSize / timeConstant;
    const amplificationFactor = 1 - stepRatio;

    if (stepRatio > 2) {
        return {
            kind: 'unstable',
            stepRatio,
            amplificationFactor,
            explanation:
                'Euler is numerically unstable for this step size: its error grows from step to step. This instability is distinct from ordinary approximation error.',
        };
    }

    if (stepRatio === 2) {
        return {
            kind: 'marginal-oscillation',
            stepRatio,
            amplificationFactor,
            explanation:
                'Euler is at its stability boundary. Errors alternate without decaying, so the solution can oscillate persistently. This is marginal stability, not ordinary approximation error.',
        };
    }

    if (stepRatio > 1) {
        return {
            kind: 'damped-oscillation',
            stepRatio,
            amplificationFactor,
            explanation:
                'Euler remains stable, but its negative amplification factor makes successive errors alternate in sign. This is damped numerical oscillation, separate from ordinary approximation error.',
        };
    }

    return {
        kind: 'stable',
        stepRatio,
        amplificationFactor,
        explanation:
            'Euler is within its non-oscillatory stability range. Its remaining difference from the analytical solution is ordinary approximation error.',
    };
}

export function calculateErrorMetrics(
    points: readonly NumericalOdePoint[],
    method: 'euler' | 'rk4',
): NumericalErrorMetrics {
    if (points.length === 0) {
        throw new RangeError('At least one comparison point is required.');
    }

    let sumSquaredError = 0;
    let maximumAbsoluteError = 0;

    for (const point of points) {
        const absoluteError = Math.abs(point[method] - point.analytical);
        maximumAbsoluteError = Math.max(maximumAbsoluteError, absoluteError);
        sumSquaredError += absoluteError ** 2;
    }

    const finalPoint = points[points.length - 1];

    return {
        maximumAbsoluteError,
        rootMeanSquareError: Math.sqrt(sumSquaredError / points.length),
        finalTimeAbsoluteError: Math.abs(
            finalPoint[method] - finalPoint.analytical,
        ),
    };
}

export function generateNumericalOdeComparison(
    parameters: NumericalOdeParameters,
): NumericalOdeComparison {
    validateParameters(parameters);

    const points: NumericalOdePoint[] = [
        {
            time: 0,
            analytical: 0,
            euler: 0,
            rk4: 0,
        },
    ];

    let time = 0;
    let euler = 0;
    let rk4 = 0;

    while (time < parameters.duration) {
        const step = Math.min(
            parameters.stepSize,
            parameters.duration - time,
        );
        const nextTime = time + step >= parameters.duration
            ? parameters.duration
            : time + step;
        const actualStep = nextTime - time;

        if (actualStep <= 0) {
            throw new RangeError(
                'The step size is too small to advance the current time value.',
            );
        }

        euler = eulerStep(time, euler, actualStep, parameters);
        rk4 = rk4Step(time, rk4, actualStep, parameters);
        time = nextTime;

        points.push({
            time,
            analytical: analyticalStepResponse(time, parameters),
            euler,
            rk4,
        });
    }

    return {
        points,
        eulerError: calculateErrorMetrics(points, 'euler'),
        rk4Error: calculateErrorMetrics(points, 'rk4'),
        eulerStability: assessEulerStability(
            Math.min(parameters.stepSize, parameters.duration),
            parameters.timeConstant,
        ),
    };
}

function validateParameters(parameters: NumericalOdeParameters): void {
    for (const [name, value] of Object.entries(parameters)) {
        if (!Number.isFinite(value)) {
            throw new RangeError(`${name} must be finite.`);
        }
    }

    if (parameters.timeConstant <= 0) {
        throw new RangeError('The time constant must be positive.');
    }
    if (parameters.stepSize <= 0) {
        throw new RangeError('The step size must be positive.');
    }
    if (parameters.duration <= 0) {
        throw new RangeError('The duration must be positive.');
    }
}
