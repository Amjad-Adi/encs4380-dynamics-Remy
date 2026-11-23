import { rk4StepVector, type StateVector } from '@/lib/numerics/ode';

import {
    computePIDCommand,
    validateLimits,
    validatePIDGains,
    type ActuatorLimits,
    type PIDGains,
} from './pid-law';
import { getPlantDerivative, getPlantRate, validatePlant, type Plant } from './plants';

/**
 * Sampled-data PID loop shared by P3 (Digital PID) and MySystem.
 *
 * Every sample period Ts the controller reads y[k] and computes
 *
 *   u[k] = sat( Kp·e[k] + Ki·Σ_{j<k} e[j]·Ts − Kd·(y[k] − y[k−1]) / Ts )
 *
 * with the same derivative-on-measurement and conditional anti-windup rules as the
 * continuous law. A zero-order hold keeps u[k] constant while the continuous plant
 * is integrated across the period with RK4 sub-steps.
 */

export interface DigitalPIDConfig {
    plant: Plant;
    gains: PIDGains;
    setpoint: number;
    limits: ActuatorLimits;
    /** Controller sample period Ts (s). */
    sampleTime: number;
    duration: number;
    /** RK4 sub-steps per sample period; chosen from the plant speed when omitted. */
    plantSubsteps?: number;
}

/** Controller variables at a sampling instant t = k·Ts. */
export interface DigitalPIDSample {
    time: number;
    setpoint: number;
    output: number;
    error: number;
    control: number;
    unsaturatedControl: number;
    integral: number;
    measurementRate: number;
}

/** Continuous plant output between samples, with the held command. */
export interface DigitalTrajectoryPoint {
    time: number;
    setpoint: number;
    output: number;
    control: number;
}

export interface DigitalPIDResult {
    samples: DigitalPIDSample[];
    trajectory: DigitalTrajectoryPoint[];
    diverged: boolean;
}

const DIVERGENCE_LIMIT = 1e9;
const MAX_TRAJECTORY_POINTS = 4000;

/**
 * Loop gain of the sampled loop at the Nyquist frequency (z = −1) for a first-order
 * plant under a zero-order hold, with p = e^(−Ts/τ):
 *
 *   L(−1) = K(1 − p)·(Kp − Ki·Ts/2 + 2·Kd/Ts) / (1 + p)
 *
 * A value ≥ 1 puts a closed-loop pole on or outside z = −1, so the loop oscillates at
 * fs/2 or diverges. The continuous loop has no such limit; because 2·Kd/Ts grows as
 * Ts shrinks, a sampled derivative needs roughly K·Kd/τ < 1 at any sample rate.
 * Returns null for second-order plants.
 */
export function getNyquistLoopGain(
    plant: Plant,
    gains: PIDGains,
    sampleTime: number,
): number | null {
    if (plant.type !== 'first-order') return null;
    const p = Math.exp(-sampleTime / plant.tau);
    const controllerGain = gains.kp - (gains.ki * sampleTime) / 2 + (2 * gains.kd) / sampleTime;
    return (plant.gain * (1 - p) * controllerGain) / (1 + p);
}

export function getDefaultPlantSubsteps(plant: Plant, sampleTime: number): number {
    return Math.max(4, Math.min(1000, Math.ceil(sampleTime * getPlantRate(plant) * 10)));
}

function validateConfig(config: DigitalPIDConfig) {
    validatePlant(config.plant);
    validatePIDGains(config.gains);
    validateLimits(config.limits);
    if (!Number.isFinite(config.setpoint)) throw new RangeError('The setpoint must be finite.');
    if (!Number.isFinite(config.sampleTime) || config.sampleTime <= 0) {
        throw new RangeError('The sample period must be positive.');
    }
    if (!Number.isFinite(config.duration) || config.duration < 0) {
        throw new RangeError('The duration must be zero or positive.');
    }
}

export function simulateDigitalPID(config: DigitalPIDConfig): DigitalPIDResult {
    validateConfig(config);

    const { plant, gains, limits, setpoint, sampleTime } = config;
    const steps = Math.floor(config.duration / sampleTime + 1e-9);
    const substeps = config.plantSubsteps ?? getDefaultPlantSubsteps(plant, sampleTime);
    const plantStep = sampleTime / substeps;
    const stride = Math.max(1, Math.ceil((steps * substeps) / MAX_TRAJECTORY_POINTS));

    const samples: DigitalPIDSample[] = [];
    const trajectory: DigitalTrajectoryPoint[] = [];
    let state: number[] = [0, 0];
    let integral = 0;
    let previousMeasurement = 0;
    let substepCounter = 0;

    for (let index = 0; index <= steps; index += 1) {
        const time = index * sampleTime;
        const output = state[0];
        const error = setpoint - output;
        const measurementRate = index === 0 ? 0 : (output - previousMeasurement) / sampleTime;
        const command = computePIDCommand(gains, limits, error, integral, measurementRate);

        samples.push({
            time,
            setpoint,
            output,
            error,
            control: command.control,
            unsaturatedControl: command.unsaturatedControl,
            integral,
            measurementRate,
        });
        trajectory.push({ time, setpoint, output, control: command.control });

        if (index === steps) break;

        if (command.integrating) integral += error * sampleTime;
        previousMeasurement = output;

        // Zero-order hold: the command stays constant across the sample period.
        const held = command.control;
        const derivative = (_time: number, x: StateVector) => {
            const rate = getPlantDerivative(plant, { output: x[0], velocity: x[1] }, held);
            return [rate.output, rate.velocity];
        };
        for (let substep = 1; substep <= substeps; substep += 1) {
            state = rk4StepVector(derivative, time + (substep - 1) * plantStep, state, plantStep);
            substepCounter += 1;
            if (substep < substeps && substepCounter % stride === 0) {
                trajectory.push({
                    time: time + substep * plantStep,
                    setpoint,
                    output: state[0],
                    control: held,
                });
            }
        }

        if (
            state.some((value) => !Number.isFinite(value)) ||
            Math.abs(state[0]) > DIVERGENCE_LIMIT
        ) {
            const last = samples[samples.length - 1];
            for (let rest = index + 1; rest <= steps; rest += 1) {
                const restTime = rest * sampleTime;
                samples.push({ ...last, time: restTime });
                trajectory.push({
                    time: restTime,
                    setpoint,
                    output: last.output,
                    control: last.control,
                });
            }
            return { samples, trajectory, diverged: true };
        }
    }

    return { samples, trajectory, diverged: false };
}
