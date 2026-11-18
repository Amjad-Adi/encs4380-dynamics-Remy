import type { PhysicalParameters } from '@/features/second-order/domain';

export type PlantType = 'first-order' | 'second-order';
export interface FirstOrderPlantParameters {
    gain: number;
    tau: number;
}
export interface PIDGains {
    kp: number;
    ki: number;
    kd: number;
}
export interface PIDPlaygroundParameters {
    plantType: PlantType;
    firstOrder: FirstOrderPlantParameters;
    secondOrder: PhysicalParameters;
    gains: PIDGains;
    setpoint: number;
    outputMin: number;
    outputMax: number;
}
export interface PIDResponsePoint {
    time: number;
    setpoint: number;
    output: number;
    error: number;
    control: number;
    unsaturatedControl: number;
    integral: number;
}
export interface PIDPerformanceMetrics {
    riseTime: number | null;
    percentageOvershoot: number;
    settlingTime: number | null;
    steadyStateError: number;
    peakOutput: number;
}

export const DEFAULT_PID_PARAMETERS: PIDPlaygroundParameters = {
    plantType: 'first-order',
    firstOrder: { gain: 1, tau: 1 },
    secondOrder: { m: 1, b: 2, k: 4 },
    gains: { kp: 9, ki: 0, kd: 0 },
    setpoint: 1,
    outputMin: 0,
    outputMax: 100,
};

interface PlantState {
    output: number;
    velocity: number;
}
function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function getPlantDerivative(
    state: PlantState,
    input: number,
    parameters: PIDPlaygroundParameters,
): PlantState {
    if (parameters.plantType === 'first-order') {
        const { gain, tau } = parameters.firstOrder;
        return { output: (gain * input - state.output) / tau, velocity: 0 };
    }
    const { m, b, k } = parameters.secondOrder;
    return {
        output: state.velocity,
        velocity: (input - b * state.velocity - k * state.output) / m,
    };
}

function advancePlantRK4(
    state: PlantState,
    input: number,
    step: number,
    parameters: PIDPlaygroundParameters,
): PlantState {
    const k1 = getPlantDerivative(state, input, parameters);
    const k2 = getPlantDerivative(
        {
            output: state.output + (step * k1.output) / 2,
            velocity: state.velocity + (step * k1.velocity) / 2,
        },
        input,
        parameters,
    );
    const k3 = getPlantDerivative(
        {
            output: state.output + (step * k2.output) / 2,
            velocity: state.velocity + (step * k2.velocity) / 2,
        },
        input,
        parameters,
    );
    const k4 = getPlantDerivative(
        { output: state.output + step * k3.output, velocity: state.velocity + step * k3.velocity },
        input,
        parameters,
    );
    return {
        output: state.output + (step / 6) * (k1.output + 2 * k2.output + 2 * k3.output + k4.output),
        velocity:
            state.velocity +
            (step / 6) * (k1.velocity + 2 * k2.velocity + 2 * k3.velocity + k4.velocity),
    };
}

function validateParameters(
    parameters: PIDPlaygroundParameters,
    duration: number,
    samples: number,
) {
    const values = [
        parameters.setpoint,
        parameters.gains.kp,
        parameters.gains.ki,
        parameters.gains.kd,
        parameters.outputMin,
        parameters.outputMax,
        duration,
    ];
    if (values.some((value) => !Number.isFinite(value)))
        throw new RangeError('PID parameters and duration must be finite numbers.');
    if (duration <= 0 || !Number.isInteger(samples) || samples < 2)
        throw new RangeError('Duration must be positive and sample count must be at least 2.');
    if (parameters.gains.kp < 0 || parameters.gains.ki < 0 || parameters.gains.kd < 0)
        throw new RangeError('PID gains must be nonnegative.');
    if (parameters.outputMin >= parameters.outputMax)
        throw new RangeError('The minimum output limit must be below the maximum output limit.');
    if (parameters.plantType === 'first-order') {
        const { gain, tau } = parameters.firstOrder;
        if (!Number.isFinite(gain) || gain <= 0 || !Number.isFinite(tau) || tau <= 0)
            throw new RangeError('First-order gain and time constant must be positive.');
    } else {
        const { m, b, k } = parameters.secondOrder;
        if (
            !Number.isFinite(m) ||
            m <= 0 ||
            !Number.isFinite(b) ||
            b < 0 ||
            !Number.isFinite(k) ||
            k <= 0
        )
            throw new RangeError('Second-order parameters require m > 0, b ≥ 0, and k > 0.');
    }
}

function getMaximumClosedLoopRate(parameters: PIDPlaygroundParameters): number {
    const { kp, ki, kd } = parameters.gains;
    if (parameters.plantType === 'first-order') {
        const { gain, tau } = parameters.firstOrder;
        const coefficient = 1 + gain * kp;
        const effectiveTimeConstant = tau + gain * kd;
        const discriminant = coefficient ** 2 - 4 * effectiveTimeConstant * gain * ki;
        return discriminant >= 0
            ? (coefficient + Math.sqrt(discriminant)) / (2 * effectiveTimeConstant)
            : Math.sqrt((gain * ki) / effectiveTimeConstant);
    }
    const { m, b, k } = parameters.secondOrder;
    return Math.max(Math.sqrt((k + kp) / m), (b + kd) / (2 * m));
}

function getControllerOutput(
    state: PlantState,
    integral: number,
    parameters: PIDPlaygroundParameters,
) {
    const error = parameters.setpoint - state.output;
    const baseControl = parameters.gains.kp * error + parameters.gains.ki * integral;
    let measurementRate: number;
    if (parameters.plantType === 'first-order') {
        const { gain, tau } = parameters.firstOrder;
        // Solve the derivative-on-measurement feedback algebraically to avoid a numerical derivative kick.
        measurementRate = (gain * baseControl - state.output) / (tau + gain * parameters.gains.kd);
    } else {
        measurementRate = state.velocity;
    }
    const unsaturatedControl = baseControl - parameters.gains.kd * measurementRate;
    return {
        error,
        unsaturatedControl,
        control: clamp(unsaturatedControl, parameters.outputMin, parameters.outputMax),
    };
}

/** Integrates the continuous PID feedback loop with RK4; derivative action is applied to the measured output. */
export function simulatePID(
    parameters: PIDPlaygroundParameters,
    duration = 10,
    samples = 6001,
): PIDResponsePoint[] {
    validateParameters(parameters, duration, samples);
    const outputStep = duration / (samples - 1);
    const internalSteps = Math.max(
        1,
        Math.min(50, Math.ceil(outputStep * getMaximumClosedLoopRate(parameters) * 20)),
    );
    const step = outputStep / internalSteps;
    const points: PIDResponsePoint[] = [];
    let state: PlantState = { output: 0, velocity: 0 };
    let integral = 0;
    let control = 0;
    let unsaturatedControl = 0;

    for (let index = 0; index < samples; index += 1) {
        const time = index * outputStep;
        const current = getControllerOutput(state, integral, parameters);
        control = current.control;
        unsaturatedControl = current.unsaturatedControl;
        points.push({
            time,
            setpoint: parameters.setpoint,
            output: state.output,
            error: current.error,
            control,
            unsaturatedControl,
            integral,
        });
        if (index === samples - 1) break;

        for (let substep = 0; substep < internalSteps; substep += 1) {
            const controller = getControllerOutput(state, integral, parameters);
            control = controller.control;
            unsaturatedControl = controller.unsaturatedControl;
            state = advancePlantRK4(state, control, step, parameters);
            const nextError = parameters.setpoint - state.output;
            integral += ((controller.error + nextError) * step) / 2;

            if (
                !Number.isFinite(state.output) ||
                !Number.isFinite(state.velocity) ||
                Math.abs(state.output) > 1e9
            ) {
                const safeOutput = Number.isFinite(state.output) ? state.output : 0;
                for (let rest = points.length; rest < samples; rest += 1) {
                    points.push({
                        time: rest * outputStep,
                        setpoint: parameters.setpoint,
                        output: safeOutput,
                        error: parameters.setpoint - safeOutput,
                        control,
                        unsaturatedControl,
                        integral,
                    });
                }
                return points;
            }
        }
    }
    return points;
}

function getCrossingTime(points: PIDResponsePoint[], threshold: number): number | null {
    for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        if (previous.output < threshold && current.output >= threshold) {
            const fraction = (threshold - previous.output) / (current.output - previous.output);
            return previous.time + fraction * (current.time - previous.time);
        }
    }
    return null;
}

export function getPIDPerformanceMetrics(points: PIDResponsePoint[]): PIDPerformanceMetrics {
    if (points.length < 2)
        return {
            riseTime: null,
            percentageOvershoot: 0,
            settlingTime: null,
            steadyStateError: 0,
            peakOutput: 0,
        };
    const setpoint = points[0].setpoint;
    const peakOutput = Math.max(...points.map((point) => point.output));
    const tail = points.slice(Math.floor(points.length * 0.95));
    const finalValue = tail.reduce((sum, point) => sum + point.output, 0) / tail.length;
    const magnitude = Math.abs(finalValue);
    const riseStart = getCrossingTime(points, 0.1 * finalValue);
    const riseEnd = getCrossingTime(points, 0.9 * finalValue);
    const riseTime =
        riseStart !== null && riseEnd !== null && riseEnd >= riseStart ? riseEnd - riseStart : null;
    const percentageOvershoot =
        magnitude > 1e-9 ? Math.max(0, ((peakOutput - finalValue) / magnitude) * 100) : 0;
    const settlingBand = Math.max(magnitude * 0.02, 1e-6);
    let lastOutsideIndex = -1;
    points.forEach((point, index) => {
        if (Math.abs(point.output - finalValue) > settlingBand) lastOutsideIndex = index;
    });
    const settlingTime =
        lastOutsideIndex === -1
            ? 0
            : lastOutsideIndex < points.length - 1
              ? points[lastOutsideIndex + 1].time
              : null;
    const steadyStateError =
        tail.reduce((sum, point) => sum + Math.abs(setpoint - point.output), 0) / tail.length;
    return { riseTime, percentageOvershoot, settlingTime, steadyStateError, peakOutput };
}

export function getSuggestedSimulationDuration(parameters: PIDPlaygroundParameters): number {
    if (parameters.plantType === 'first-order') {
        const { gain, tau } = parameters.firstOrder;
        const { kp, ki } = parameters.gains;
        const coefficient = 1 + gain * kp;
        const discriminant = coefficient ** 2 - 4 * tau * gain * ki;
        const decayRate =
            ki === 0
                ? coefficient / tau
                : discriminant >= 0
                  ? (coefficient - Math.sqrt(discriminant)) / (2 * tau)
                  : coefficient / (2 * tau);
        return Math.min(60, Math.max(5, 12 / Math.max(decayRate, 1e-6)));
    }

    const { m, b, k } = parameters.secondOrder;
    const { kp, ki, kd } = parameters.gains;
    const closedLoopStiffness = k + kp;
    const omegaN = Math.sqrt(closedLoopStiffness / m);
    const zeta = (b + kd) / (2 * Math.sqrt(m * closedLoopStiffness));
    const mechanicalDuration =
        zeta === 0
            ? (8 * 2 * Math.PI) / omegaN
            : zeta < 1
              ? 8 / (zeta * omegaN)
              : 8 / (omegaN * (zeta - Math.sqrt(zeta ** 2 - 1)));
    const integralDuration = ki > 0 ? (8 * closedLoopStiffness) / ki : 0;
    return Math.min(60, Math.max(5, mechanicalDuration, integralDuration));
}
