import { rk4StepVector, type StateVector } from '@/lib/numerics/ode';

import {
    computePIDCommand,
    validateLimits,
    validatePIDGains,
    type ActuatorLimits,
    type PIDCommand,
    type PIDGains,
} from './pid-law';
import { getPlantDerivative, getPlantRate, validatePlant, type Plant } from './plants';

/**
 * Continuous-time PID loop shared by P1 (ideal sensor), P2 (first-order sensor lag)
 * and P4 (hidden plant). The closed-loop state x = [y, ẏ, y_m, ∫e] is integrated with
 * the shared RK4 solver.
 */

export interface ContinuousPIDConfig {
    plant: Plant;
    gains: PIDGains;
    setpoint: number;
    limits: ActuatorLimits;
    /** Sensor time constant τs. Zero (or omitted) means an ideal sensor, y_m = y. */
    sensorTau?: number;
}

export interface ContinuousPIDPoint {
    time: number;
    setpoint: number;
    /** True plant output y. */
    output: number;
    /** Sensor measurement y_m fed back to the controller (equals y for an ideal sensor). */
    measuredOutput: number;
    error: number;
    control: number;
    unsaturatedControl: number;
    integral: number;
    /** dy_m/dt, the signal the derivative term acts on. */
    measurementRate: number;
}

export interface ContinuousPIDResult {
    points: ContinuousPIDPoint[];
    /** True when the response grew without bound and the run was stopped early. */
    diverged: boolean;
}

const DIVERGENCE_LIMIT = 1e9;
const STEPS_PER_UNIT_RATE = 20;
const MAX_INTERNAL_STEPS = 100;

function hasSensorLag(config: ContinuousPIDConfig): boolean {
    return (config.sensorTau ?? 0) > 0;
}

interface ControllerEvaluation extends PIDCommand {
    measuredOutput: number;
    measurementRate: number;
}

function evaluateController(config: ContinuousPIDConfig, x: StateVector): ControllerEvaluation {
    const [output, velocity, sensed, integral] = x;
    const { plant, gains, limits, setpoint } = config;

    if (hasSensorLag(config)) {
        const measurementRate = (output - sensed) / (config.sensorTau as number);
        const command = computePIDCommand(
            gains,
            limits,
            setpoint - sensed,
            integral,
            measurementRate,
        );
        return { ...command, measuredOutput: sensed, measurementRate };
    }

    const error = setpoint - output;

    if (plant.type === 'second-order') {
        const command = computePIDCommand(gains, limits, error, integral, velocity);
        return { ...command, measuredOutput: output, measurementRate: velocity };
    }

    // First-order plant with an ideal sensor: ẏ depends on u, so derivative-on-measurement
    // forms an algebraic loop. Solve u* = Kp·e + Ki·∫e − Kd·(K·u* − y)/τ exactly; clamping
    // u* is the exact solution when the actuator saturates.
    const { gain, tau } = plant;
    const base = gains.kp * error + gains.ki * integral;
    const unsaturated = (base * tau + gains.kd * output) / (tau + gain * gains.kd);
    const command = computePIDCommand(
        gains,
        limits,
        error,
        integral,
        (gain * unsaturated - output) / tau,
    );
    return {
        ...command,
        measuredOutput: output,
        measurementRate: (gain * command.control - output) / tau,
    };
}

function closedLoopDerivative(config: ContinuousPIDConfig, x: StateVector): number[] {
    const [output, velocity, sensed] = x;
    const controller = evaluateController(config, x);
    const plantRate = getPlantDerivative(config.plant, { output, velocity }, controller.control);
    const sensorRate = hasSensorLag(config) ? (output - sensed) / (config.sensorTau as number) : 0;
    return [
        plantRate.output,
        plantRate.velocity,
        sensorRate,
        controller.integrating ? controller.error : 0,
    ];
}

/** Conservative estimate of the fastest closed-loop rate, used to size RK4 sub-steps. */
export function estimateClosedLoopRate(config: ContinuousPIDConfig): number {
    const { plant, gains } = config;
    const { kp, ki, kd } = gains;
    const sensorTau = config.sensorTau ?? 0;
    const lag = sensorTau > 0;
    const rates = [getPlantRate(plant)];

    if (plant.type === 'first-order') {
        const { gain, tau } = plant;
        const effectiveTau = tau + (lag ? 0 : gain * kd);
        rates.push((1 + gain * kp) / effectiveTau, Math.sqrt((gain * ki) / effectiveTau));
        if (lag) {
            rates.push(
                1 / sensorTau,
                (gain * kd) / (tau * sensorTau),
                Math.sqrt((1 + gain * kp) / (tau * sensorTau)),
            );
        }
    } else {
        const { m, b, k } = plant;
        rates.push(Math.sqrt((k + kp) / m), (b + (lag ? 0 : kd)) / m, Math.cbrt(ki / m));
        if (lag) {
            rates.push(
                1 / sensorTau,
                Math.sqrt(kd / (m * sensorTau)),
                Math.cbrt(kp / (m * sensorTau)),
            );
        }
    }

    return Math.max(...rates.filter(Number.isFinite));
}

function validateConfig(config: ContinuousPIDConfig, duration: number, samples: number) {
    validatePlant(config.plant);
    validatePIDGains(config.gains);
    validateLimits(config.limits);
    if (!Number.isFinite(config.setpoint)) throw new RangeError('The setpoint must be finite.');
    const sensorTau = config.sensorTau ?? 0;
    if (!Number.isFinite(sensorTau) || sensorTau < 0) {
        throw new RangeError('The sensor time constant must be zero or positive.');
    }
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isInteger(samples) || samples < 2) {
        throw new RangeError('Duration must be positive and sample count must be at least 2.');
    }
}

function toPoint(config: ContinuousPIDConfig, time: number, x: StateVector): ContinuousPIDPoint {
    const controller = evaluateController(config, x);
    return {
        time,
        setpoint: config.setpoint,
        output: x[0],
        measuredOutput: controller.measuredOutput,
        error: controller.error,
        control: controller.control,
        unsaturatedControl: controller.unsaturatedControl,
        integral: x[3],
        measurementRate: controller.measurementRate,
    };
}

export function simulateContinuousPID(
    config: ContinuousPIDConfig,
    duration = 10,
    samples = 6001,
): ContinuousPIDResult {
    validateConfig(config, duration, samples);

    const outputStep = duration / (samples - 1);
    const internalSteps = Math.max(
        1,
        Math.min(
            MAX_INTERNAL_STEPS,
            Math.ceil(outputStep * estimateClosedLoopRate(config) * STEPS_PER_UNIT_RATE),
        ),
    );
    const step = outputStep / internalSteps;
    const derivative = (_time: number, x: StateVector) => closedLoopDerivative(config, x);

    const points: ContinuousPIDPoint[] = [];
    let state: number[] = [0, 0, 0, 0];

    for (let index = 0; index < samples; index += 1) {
        const time = index * outputStep;
        points.push(toPoint(config, time, state));
        if (index === samples - 1) break;

        let next = state;
        for (let substep = 0; substep < internalSteps; substep += 1) {
            next = rk4StepVector(derivative, time + substep * step, next, step);
        }

        if (next.some((value) => !Number.isFinite(value)) || Math.abs(next[0]) > DIVERGENCE_LIMIT) {
            // Hold the last finite state so charts keep a full time axis.
            const held = points[points.length - 1];
            for (let rest = points.length; rest < samples; rest += 1) {
                points.push({ ...held, time: rest * outputStep });
            }
            return { points, diverged: true };
        }
        state = next;
    }

    return { points, diverged: false };
}

/**
 * Simulation window long enough for the slowest closed-loop mode to decay
 * (about 12 time constants), between 5 s and 60 s.
 */
export function getSuggestedDuration(plant: Plant, gains: PIDGains): number {
    const { kp, ki, kd } = gains;

    if (plant.type === 'first-order') {
        const { gain, tau } = plant;
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

    const { m, b, k } = plant;
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
