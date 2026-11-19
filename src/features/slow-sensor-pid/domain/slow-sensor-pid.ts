import type { PhysicalParameters } from '../../second-order/domain';
type PlantType = 'first-order' | 'second-order';

interface FirstOrderPlantParameters {
    gain: number;
    tau: number;
}

interface PIDGains {
    kp: number;
    ki: number;
    kd: number;
}
export interface SlowSensorPIDParameters {
    plantType: PlantType;
    firstOrder: FirstOrderPlantParameters;
    secondOrder: PhysicalParameters;
    gains: PIDGains;
    setpoint: number;
    outputMin: number;
    outputMax: number;
    sensorTau: number;
}

export interface SlowSensorPIDResponsePoint {
    time: number;
    setpoint: number;
    trueOutput: number;
    measuredOutput: number;
    error: number;
    control: number;
    unsaturatedControl: number;
    integral: number;
    sensorRate: number;
}

interface State {
    output: number;
    velocity: number;
    measured: number;
    integral: number;
}

interface Derivative {
    output: number;
    velocity: number;
    measured: number;
    integral: number;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function getControl(state: State, p: SlowSensorPIDParameters) {
    const error = p.setpoint - state.measured;
    const sensorRate = (state.output - state.measured) / p.sensorTau;

    const baseControl =
        p.gains.kp * error + p.gains.ki * state.integral;

    const unsaturatedControl =
        baseControl - p.gains.kd * sensorRate;

    return {
        error,
        sensorRate,
        unsaturatedControl,
        control: clamp(
            unsaturatedControl,
            p.outputMin,
            p.outputMax,
        ),
    };
}

function getDerivative(
    state: State,
    p: SlowSensorPIDParameters,
): Derivative {
    const controller = getControl(state, p);

    let outputRate: number;
    let velocityRate: number;

    if (p.plantType === 'first-order') {
        const { gain, tau } = p.firstOrder;

        outputRate =
            (gain * controller.control - state.output) / tau;

        velocityRate = 0;
    } else {
        const { m, b, k } = p.secondOrder;

        outputRate = state.velocity;

        velocityRate =
            (controller.control -
                b * state.velocity -
                k * state.output) / m;
    }

    return {
        output: outputRate,
        velocity: velocityRate,
        measured: controller.sensorRate,
        integral: controller.error,
    };
}

function addScaled(
    state: State,
    derivative: Derivative,
    scale: number,
): State {
    return {
        output: state.output + derivative.output * scale,
        velocity: state.velocity + derivative.velocity * scale,
        measured: state.measured + derivative.measured * scale,
        integral: state.integral + derivative.integral * scale,
    };
}

function advanceRK4(
    state: State,
    h: number,
    p: SlowSensorPIDParameters,
): State {
    const k1 = getDerivative(state, p);
    const k2 = getDerivative(addScaled(state, k1, h / 2), p);
    const k3 = getDerivative(addScaled(state, k2, h / 2), p);
    const k4 = getDerivative(addScaled(state, k3, h), p);

    return {
        output:
            state.output +
            (h / 6) *
            (k1.output + 2 * k2.output + 2 * k3.output + k4.output),

        velocity:
            state.velocity +
            (h / 6) *
            (k1.velocity +
                2 * k2.velocity +
                2 * k3.velocity +
                k4.velocity),

        measured:
            state.measured +
            (h / 6) *
            (k1.measured +
                2 * k2.measured +
                2 * k3.measured +
                k4.measured),

        integral:
            state.integral +
            (h / 6) *
            (k1.integral +
                2 * k2.integral +
                2 * k3.integral +
                k4.integral),
    };
}

function validateParameters(
    p: SlowSensorPIDParameters,
    duration: number,
    samples: number,
): void {
    if (
        !Number.isFinite(p.sensorTau) ||
        p.sensorTau <= 0
    ) {
        throw new RangeError('Sensor time constant must be positive.');
    }

    if (
        duration <= 0 ||
        !Number.isInteger(samples) ||
        samples < 2
    ) {
        throw new RangeError('Invalid simulation duration or sample count.');
    }

    if (
        p.gains.kp < 0 ||
        p.gains.ki < 0 ||
        p.gains.kd < 0
    ) {
        throw new RangeError('PID gains must be nonnegative.');
    }

    if (p.outputMin >= p.outputMax) {
        throw new RangeError('Invalid output limits.');
    }

    if (p.plantType === 'first-order') {
        if (p.firstOrder.gain <= 0 || p.firstOrder.tau <= 0) {
            throw new RangeError('First-order parameters must be positive.');
        }
    } else {
        const { m, b, k } = p.secondOrder;

        if (m <= 0 || b < 0 || k <= 0) {
            throw new RangeError('Invalid second-order parameters.');
        }
    }
}

export function simulateSlowSensorPID(
    p: SlowSensorPIDParameters,
    duration = 10,
    samples = 6001,
): SlowSensorPIDResponsePoint[] {
    validateParameters(p, duration, samples);

    const outputStep = duration / (samples - 1);

    const plantRate =
        p.plantType === 'first-order'
            ? 1 / p.firstOrder.tau
            : Math.max(
                Math.sqrt(p.secondOrder.k / p.secondOrder.m),
                p.secondOrder.b / p.secondOrder.m,
            );

    const sensorRate = 1 / p.sensorTau;

    const controllerRate =
        (1 + p.gains.kp) * plantRate +
        p.gains.ki +
        p.gains.kd * sensorRate;

    const internalSteps = Math.max(
        1,
        Math.min(
            100,
            Math.ceil(
                outputStep *
                Math.max(plantRate, sensorRate, controllerRate) *
                10,
            ),
        ),
    );

    const h = outputStep / internalSteps;

    const points: SlowSensorPIDResponsePoint[] = [];

    let state: State = {
        output: 0,
        velocity: 0,
        measured: 0,
        integral: 0,
    };

    for (let i = 0; i < samples; i++) {
        const time = i * outputStep;
        const controller = getControl(state, p);

        points.push({
            time,
            setpoint: p.setpoint,
            trueOutput: state.output,
            measuredOutput: state.measured,
            error: controller.error,
            control: controller.control,
            unsaturatedControl: controller.unsaturatedControl,
            integral: state.integral,
            sensorRate: controller.sensorRate,
        });

        if (i === samples - 1) break;

        for (let j = 0; j < internalSteps; j++) {
            state = advanceRK4(state, h, p);

            if (
                !Number.isFinite(state.output) ||
                !Number.isFinite(state.measured) ||
                Math.abs(state.output) > 1e9 ||
                Math.abs(state.measured) > 1e9
            ) {
                return points;
            }
        }
    }

    return points;
}
