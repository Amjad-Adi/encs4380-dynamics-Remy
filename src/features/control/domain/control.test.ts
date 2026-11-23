import { describe, expect, it } from 'vitest';

import { stepResponse } from '@/features/first-order-time/domain/first-order-time';
import { rk4Step } from '@/features/numerical-ode/domain/numerical-ode';
import {
    getDampingRatio,
    getNaturalFrequency,
    getResponseMetrics,
    getStepResponse,
} from '@/features/second-order/domain';
import {
    drawSensorParameters,
    getSensorResponse,
} from '@/features/sensor-challenge/domain/sensor-challenge';
import { rk4StepVector } from '@/lib/numerics/ode';

import {
    getNyquistLoopGain,
    getPlantDCGain,
    getPlantDerivative,
    getStepResponseMetrics,
    plantFromSensorParameters,
    secondOrderFromStandardForm,
    simulateContinuousPID,
    simulateDigitalPID,
    type ContinuousPIDConfig,
    type Plant,
} from './index';

const WIDE_LIMITS = { min: -1000, max: 1000 };

function seededRandom(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 2 ** 32;
    };
}

function maxDifference(a: readonly number[], b: readonly number[]) {
    return Math.max(...a.map((value, index) => Math.abs(value - b[index])));
}

describe('shared numerical solver', () => {
    it('is the same RK4 step that Homework 1 Module 7 uses', () => {
        const parameters = { gain: 2, timeConstant: 0.7, amplitude: 1.5 };
        let scalar = 0;
        let vector = [0];
        for (let step = 0; step < 50; step += 1) {
            scalar = rk4Step(step * 0.1, scalar, 0.1, parameters);
            vector = rk4StepVector(
                (_time, [y]) => [
                    (parameters.gain * parameters.amplitude - y) / parameters.timeConstant,
                ],
                step * 0.1,
                vector,
                0.1,
            );
        }
        expect(vector[0]).toBe(scalar);
    });
});

describe('shared plant models', () => {
    it('maps standard-form second-order plants onto the Module 3 mass–spring–damper', () => {
        const plant = secondOrderFromStandardForm({ gain: 2.5, omegaN: 3, zeta: 0.4 });
        expect(getNaturalFrequency(plant)).toBeCloseTo(3, 12);
        expect(getDampingRatio(plant)).toBeCloseTo(0.4, 12);
        expect(getPlantDCGain(plant)).toBeCloseTo(2.5, 12);
    });

    it('reproduces the Homework 1 Module 4 random sensor responses for P4 plants', () => {
        const random = seededRandom(4380);
        for (let draw = 0; draw < 6; draw += 1) {
            const sensor = drawSensorParameters(random);
            const plant = plantFromSensorParameters(sensor);
            const step = 0.002;
            let state = [0, 0];
            for (let index = 1; index <= 2000; index += 1) {
                state = rk4StepVector(
                    (_time, [output, velocity]) => {
                        const rate = getPlantDerivative(plant, { output, velocity }, 1);
                        return [rate.output, rate.velocity];
                    },
                    (index - 1) * step,
                    state,
                    step,
                );
                if (index % 250 === 0) {
                    expect(state[0]).toBeCloseTo(getSensorResponse(sensor, index * step), 8);
                }
            }
        }
    });
});

describe('continuous PID loop (P1, P2, P4)', () => {
    it('matches the Module 1 first-order step response for P-only control', () => {
        const gain = 2;
        const tau = 0.8;
        const kp = 4;
        const setpoint = 1.5;
        const { points } = simulateContinuousPID(
            {
                plant: { type: 'first-order', gain, tau },
                gains: { kp, ki: 0, kd: 0 },
                setpoint,
                limits: WIDE_LIMITS,
            },
            3,
            601,
        );
        const closedLoop = {
            gain: (gain * kp) / (1 + gain * kp),
            tau: tau / (1 + gain * kp),
            amplitude: setpoint,
        };
        expect(
            maxDifference(
                points.map((point) => point.output),
                points.map((point) => stepResponse(point.time, closedLoop)),
            ),
        ).toBeLessThan(1e-7);
    });

    it('matches the Module 3 second-order step response for PD control', () => {
        const plant = { type: 'second-order' as const, m: 1, b: 2, k: 4 };
        const gains = { kp: 12, ki: 0, kd: 1.5 };
        const setpoint = 2;
        const { points } = simulateContinuousPID(
            { plant, gains, setpoint, limits: WIDE_LIMITS },
            6,
            1201,
        );
        // m·ÿ + (b + Kd)·ẏ + (k + Kp)·y = Kp·r
        const closedLoop = { m: plant.m, b: plant.b + gains.kd, k: plant.k + gains.kp };
        expect(
            maxDifference(
                points.map((point) => point.output),
                points.map(
                    (point) => gains.kp * setpoint * getStepResponse(point.time, closedLoop),
                ),
            ),
        ).toBeLessThan(1e-6);
    });

    it('computes the same metrics as the Module 3 analytic formulas', () => {
        const plant = { type: 'second-order' as const, m: 1, b: 0.5, k: 4 };
        const gains = { kp: 5, ki: 0, kd: 1 };
        const { points } = simulateContinuousPID(
            { plant, gains, setpoint: 1, limits: WIDE_LIMITS },
            15,
            15001,
        );
        const sampled = getStepResponseMetrics(points, 1);
        const analytic = getResponseMetrics({ m: 1, b: 1.5, k: 9 });

        expect(sampled.riseTime).toBeCloseTo(analytic.riseTime, 3);
        expect(sampled.percentageOvershoot).toBeCloseTo(analytic.percentageOvershoot, 2);
        expect(sampled.peakTime).toBeCloseTo(analytic.peakTime as number, 2);
        expect(sampled.settlingTime).toBeCloseTo(analytic.settlingTime as number, 2);
    });

    it('reduces P2 to P1 as the sensor time constant goes to zero', () => {
        const base: ContinuousPIDConfig = {
            plant: { type: 'second-order', m: 1, b: 2, k: 4 },
            gains: { kp: 10, ki: 3, kd: 1 },
            setpoint: 1,
            limits: { min: 0, max: 100 },
        };
        const ideal = simulateContinuousPID(base, 8, 801).points;
        const fastSensor = simulateContinuousPID({ ...base, sensorTau: 1e-4 }, 8, 801).points;
        expect(
            maxDifference(
                ideal.map((point) => point.output),
                fastSensor.map((point) => point.output),
            ),
        ).toBeLessThan(2e-3);
    });

    it('freezes the integral while the actuator is saturated (anti-windup)', () => {
        const { points } = simulateContinuousPID(
            {
                plant: { type: 'first-order', gain: 1, tau: 1 },
                gains: { kp: 0, ki: 5, kd: 0 },
                setpoint: 1,
                limits: { min: 0, max: 0.5 },
            },
            4,
            401,
        );
        // Ki·∫e stops at the 0.5 limit instead of growing with the persistent error.
        expect(Math.max(...points.map((point) => point.integral))).toBeLessThan(0.11);
        expect(points.every((point) => point.control <= 0.5)).toBe(true);
    });

    it('flags a diverging loop and keeps the full time axis', () => {
        const result = simulateContinuousPID(
            {
                plant: { type: 'second-order', m: 1, b: 0, k: 1 },
                gains: { kp: 0, ki: 20, kd: 0 },
                setpoint: 1,
                limits: { min: -1e12, max: 1e12 },
            },
            60,
            601,
        );
        expect(result.diverged).toBe(true);
        expect(result.points).toHaveLength(601);
    });
});

describe('digital PID loop (P3, MySystem)', () => {
    const plants: Plant[] = [
        { type: 'first-order', gain: 1, tau: 1 },
        { type: 'second-order', m: 1, b: 2, k: 4 },
    ];

    it.each(plants)('approaches the continuous P1 loop as Ts → 0 ($type)', (plant) => {
        const gains = { kp: 2, ki: 1, kd: 0.5 };
        const limits = { min: -10, max: 10 };
        const continuous = simulateContinuousPID(
            { plant, gains, setpoint: 1, limits },
            10,
            10001,
        ).points;
        const digital = simulateDigitalPID({
            plant,
            gains,
            setpoint: 1,
            limits,
            sampleTime: 0.001,
            duration: 10,
        }).samples;

        expect(
            maxDifference(
                digital.map((sample) => sample.output),
                continuous.map((point) => point.output),
            ),
        ).toBeLessThan(5e-3);

        const a = getStepResponseMetrics(continuous, 1);
        const b = getStepResponseMetrics(digital, 1);
        expect(b.riseTime).toBeCloseTo(a.riseTime as number, 1);
        expect(b.percentageOvershoot).toBeCloseTo(a.percentageOvershoot, 0);
    });

    it('holds the command between samples (zero-order hold)', () => {
        const { trajectory, samples } = simulateDigitalPID({
            plant: { type: 'first-order', gain: 1, tau: 1 },
            gains: { kp: 3, ki: 0, kd: 0 },
            setpoint: 1,
            limits: WIDE_LIMITS,
            sampleTime: 0.25,
            duration: 2,
        });
        expect(samples).toHaveLength(9);
        expect(trajectory.length).toBeGreaterThan(samples.length);
        const firstPeriod = trajectory.filter((point) => point.time < 0.25);
        expect(new Set(firstPeriod.map((point) => point.control)).size).toBe(1);
    });

    it('predicts the Nyquist-frequency instability of a sampled first-order loop', () => {
        const plant: Plant = { type: 'first-order', gain: 1, tau: 1 };
        const run = (gains: { kp: number; ki: number; kd: number }, sampleTime: number) => {
            const { samples } = simulateDigitalPID({
                plant,
                gains,
                setpoint: 1,
                limits: WIDE_LIMITS,
                sampleTime,
                duration: 8,
            });
            const tail = samples.slice(-20).map((sample) => sample.output);
            return Math.max(...tail) - Math.min(...tail);
        };

        const stable = { kp: 6, ki: 6, kd: 0.5 };
        const derivativeHeavy = { kp: 15, ki: 20, kd: 1 };
        expect(getNyquistLoopGain(plant, stable, 0.1)).toBeLessThan(1);
        expect(run(stable, 0.1)).toBeLessThan(1e-3);
        // 2·Kd/Ts dominates: unstable even at a 1 ms sample period.
        expect(getNyquistLoopGain(plant, derivativeHeavy, 0.001)).toBeGreaterThan(1);
        expect(run(derivativeHeavy, 0.001)).toBeGreaterThan(0.1);
        expect(
            getNyquistLoopGain({ type: 'second-order', m: 1, b: 2, k: 4 }, stable, 0.1),
        ).toBeNull();
    });

    it('uses the same anti-windup rule as the continuous loop', () => {
        const { samples } = simulateDigitalPID({
            plant: { type: 'first-order', gain: 1, tau: 1 },
            gains: { kp: 0, ki: 5, kd: 0 },
            setpoint: 1,
            limits: { min: 0, max: 0.5 },
            sampleTime: 0.01,
            duration: 4,
        });
        expect(Math.max(...samples.map((sample) => sample.integral))).toBeLessThan(0.11);
    });
});

describe('shared step metrics', () => {
    it('handles negative setpoints symmetrically', () => {
        const config = (setpoint: number): ContinuousPIDConfig => ({
            plant: { type: 'second-order', m: 1, b: 1, k: 4 },
            gains: { kp: 6, ki: 2, kd: 0.5 },
            setpoint,
            limits: WIDE_LIMITS,
        });
        const positive = getStepResponseMetrics(simulateContinuousPID(config(1)).points, 1);
        const negative = getStepResponseMetrics(simulateContinuousPID(config(-1)).points, -1);
        expect(negative.riseTime).toBeCloseTo(positive.riseTime as number, 9);
        expect(negative.percentageOvershoot).toBeCloseTo(positive.percentageOvershoot, 9);
        expect(negative.settlingTime).toBe(positive.settlingTime);
        expect(negative.peakOutput).toBeCloseTo(-positive.peakOutput, 9);
    });

    it('measures against the setpoint when asked (P4 specification)', () => {
        const { points } = simulateContinuousPID({
            plant: { type: 'first-order', gain: 1, tau: 1 },
            gains: { kp: 9, ki: 0, kd: 0 },
            setpoint: 1,
            limits: WIDE_LIMITS,
        });
        const finalValue = getStepResponseMetrics(points, 1);
        const setpoint = getStepResponseMetrics(points, 1, { reference: 'setpoint' });
        expect(finalValue.settlingTime).not.toBeNull();
        expect(setpoint.settlingTime).toBeNull();
        expect(finalValue.steadyStateError).toBeCloseTo(0.1, 6);
    });
});
