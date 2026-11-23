import { describe, expect, it } from 'vitest';

import { secondOrderFromStandardForm } from '@/features/control/domain';

import { simulatePID } from './pid-simulation';
import type { PIDSimulationConfig } from './pid-types';

const firstOrderPlant = {
    type: 'first-order' as const,
    gain: 1,
    tau: 1,
};

// Standard form K·ωn² / (s² + 2ζωn·s + ωn²) mapped onto the shared mass–spring–damper plant.
const lightlyDampedPlant = secondOrderFromStandardForm({ gain: 1, omegaN: 2, zeta: 0.1 });

function createConfig(overrides: Partial<PIDSimulationConfig> = {}): PIDSimulationConfig {
    return {
        plant: firstOrderPlant,
        gains: { kp: 9, ki: 0, kd: 0 },
        setpoint: 1,
        outputLimits: { min: -100, max: 100 },
        duration: 1,
        sampleTime: 0.001,
        ...overrides,
    };
}

describe('Digital PID simulation', () => {
    it('matches the P-only first-order closed-loop response within sampling tolerance', () => {
        const result = simulatePID(createConfig());
        const maxAnalyticalError = Math.max(
            ...result.samples.map((sample) => {
                const analyticalOutput = 0.9 * (1 - Math.exp(-10 * sample.time));
                return Math.abs(sample.output - analyticalOutput);
            }),
        );
        const atOneTimeConstant = result.samples[100].output;

        expect(maxAnalyticalError).toBeLessThan(0.002);
        expect(atOneTimeConstant).toBeCloseTo(0.9 * (1 - Math.exp(-1)), 2);
        expect(result.metrics.steadyStateError).toBeCloseTo(0.1, 4);
    });

    it('matches the critically damped PI response for Kp = 1 and Ki = 1', () => {
        const result = simulatePID(
            createConfig({
                gains: { kp: 1, ki: 1, kd: 0 },
                duration: 5,
            }),
        );
        const maxAnalyticalError = Math.max(
            ...result.samples.map((sample) =>
                Math.abs(sample.output - (1 - Math.exp(-sample.time))),
            ),
        );

        // The characteristic polynomial is s^2 + 2s + 1: wn = 1 rad/s, zeta = 1.
        // Pole-zero cancellation leaves the unit-step response 1 - exp(-t).
        expect(maxAnalyticalError).toBeLessThan(0.0003);
    });

    it('drives steady-state error toward zero with stable PI control and adequate limits', () => {
        const result = simulatePID(
            createConfig({
                gains: { kp: 1, ki: 1, kd: 0 },
                outputLimits: { min: -10, max: 10 },
                duration: 12,
            }),
        );

        expect(Math.abs(result.metrics.steadyStateError)).toBeLessThan(0.0001);
    });

    it('clamps positive and negative controller commands to the actuator limits', () => {
        const positive = simulatePID(
            createConfig({
                outputLimits: { min: -0.2, max: 0.2 },
                duration: 1,
            }),
        );
        const negative = simulatePID(
            createConfig({
                setpoint: -1,
                outputLimits: { min: -0.2, max: 0.2 },
                duration: 1,
            }),
        );

        expect(positive.samples[0].control).toBe(0.2);
        expect(positive.samples.every((sample) => sample.control <= 0.2)).toBe(true);
        expect(positive.samples.every((sample) => sample.control >= -0.2)).toBe(true);
        expect(negative.samples[0].control).toBe(-0.2);
        expect(negative.samples.every((sample) => sample.control <= 0.2)).toBe(true);
        expect(negative.samples.every((sample) => sample.control >= -0.2)).toBe(true);
    });

    it('allows the integral to unwind when saturation opposes the error', () => {
        const highSaturation = simulatePID(
            createConfig({
                plant: lightlyDampedPlant,
                gains: { kp: 0, ki: 2, kd: 0 },
                outputLimits: { min: 0, max: 1 },
                duration: 1.3,
            }),
        );
        const lowSaturation = simulatePID(
            createConfig({
                plant: lightlyDampedPlant,
                gains: { kp: 0, ki: 2, kd: 0 },
                setpoint: -1,
                outputLimits: { min: -1, max: 0 },
                duration: 1.3,
            }),
        );

        expect(highSaturation.samples[1100].error).toBeLessThan(0);
        expect(highSaturation.samples[1100].control).toBe(1);
        expect(highSaturation.samples[1200].control).toBeLessThan(1);

        expect(lowSaturation.samples[1100].error).toBeGreaterThan(0);
        expect(lowSaturation.samples[1100].control).toBe(-1);
        expect(lowSaturation.samples[1200].control).toBeGreaterThan(-1);
    });

    it('handles a zero setpoint and a duration shorter than one step', () => {
        const zeroSetpoint = simulatePID(createConfig({ setpoint: 0, duration: 1 }));
        const shortRun = simulatePID(createConfig({ duration: 0.005, sampleTime: 0.01 }));

        expect(zeroSetpoint.samples.every((sample) => sample.output === 0)).toBe(true);
        expect(zeroSetpoint.metrics.percentageOvershoot).toBe(0);
        expect(zeroSetpoint.metrics.steadyStateError).toBe(0);

        expect(shortRun.samples).toHaveLength(1);
        expect(shortRun.samples[0].time).toBe(0);
    });
});
