export interface FrequencyResponse {
    magnitude: number;
    phase: number;
    phaseDegrees: number;
    magnitudeDb: number;
    cutoffFrequency: number;
    amplitudeError: number;
    amplitudeLossPercent: number;
}

export interface SignalPoint {
    time: number;
    input: number;
    output: number;
}

export interface BodePoint {
    frequency: number;
    magnitudeDb: number;
    phaseDegrees: number;
}

export interface FrequencyValidationResult {
    label: string;
    expected: number;
    actual: number;
    unit: string;
    passed: boolean;
}
import {
    Activity,
    BookOpen,
    Calculator,
    Gauge,
    SlidersHorizontal,
} from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const FREQUENCY_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'analysis', label: 'Analysis', icon: Activity },
    { id: 'dynamic-error', label: 'Dynamic error', icon: Calculator },
    { id: 'challenge', label: 'Challenge', icon: Gauge },
];
const DEG_PER_RAD = 180 / Math.PI;

export function getFrequencyResponse(
    tau: number,
    omega: number,
): FrequencyResponse {
    if (!Number.isFinite(tau) || tau <= 0) {
        throw new RangeError('The time constant must be positive.');
    }
    if (!Number.isFinite(omega) || omega < 0) {
        throw new RangeError('Angular frequency must be nonnegative.');
    }

    const product = omega * tau;
    const magnitude = 1 / Math.sqrt(1 + product ** 2);
    const phase = -Math.atan(product);

    return {
        magnitude,
        phase,
        phaseDegrees: phase * DEG_PER_RAD,
        magnitudeDb: 20 * Math.log10(magnitude),
        cutoffFrequency: 1 / tau,
        amplitudeError: magnitude - 1,
        amplitudeLossPercent: (1 - magnitude) * 100,
    };
}

export function generateSignalResponse(
    tau: number,
    omega: number,
    samples = 600,
): SignalPoint[] {
    if (omega <= 0) {
        throw new RangeError('A sinusoidal input requires positive frequency.');
    }

    const { magnitude, phase } = getFrequencyResponse(tau, omega);
    const duration = (3 * 2 * Math.PI) / omega;

    return Array.from({ length: samples }, (_, index) => {
        const time = (index / (samples - 1)) * duration;
        const angle = omega * time;

        return {
            time,
            input: Math.sin(angle),
            output: magnitude * Math.sin(angle + phase),
        };
    });
}

export function generateBodeResponse(
    tau: number,
    samples = 500,
): BodePoint[] {
    if (!Number.isFinite(tau) || tau <= 0) {
        throw new RangeError('The time constant must be positive.');
    }

    const cutoff = 1 / tau;
    const minFrequency = cutoff / 1000;
    const maxFrequency = cutoff * 100;
    const minLog = Math.log10(minFrequency);
    const maxLog = Math.log10(maxFrequency);

    return Array.from({ length: samples }, (_, index) => {
        const frequency = 10 ** (
            minLog + (index / (samples - 1)) * (maxLog - minLog)
        );
        const response = getFrequencyResponse(tau, frequency);

        return {
            frequency,
            magnitudeDb: response.magnitudeDb,
            phaseDegrees: response.phaseDegrees,
        };
    });
}

/**
 * Maximum angular frequency for a permitted amplitude loss.
 * M >= 1 - tolerance, where tolerance is expressed as a fraction.
 */
export function getMaximumFrequency(
    tau: number,
    tolerancePercent: number,
): number {
    if (tau <= 0 || !Number.isFinite(tau)) {
        throw new RangeError('The time constant must be positive.');
    }
    if (
        !Number.isFinite(tolerancePercent) ||
        tolerancePercent <= 0 ||
        tolerancePercent >= 100
    ) {
        throw new RangeError('Tolerance must be between 0 and 100 percent.');
    }

    const minimumMagnitude = 1 - tolerancePercent / 100;
    return Math.sqrt(1 / minimumMagnitude ** 2 - 1) / tau;
}

export function getFrequencyValidation(): FrequencyValidationResult[] {
    const sensor = getFrequencyResponse(0.2, 2);

    // For a 5% amplitude-loss limit at 100 Hz:
    // omega = 2πf and tau_max = sqrt(1/0.95² - 1) / omega.
    const maximumTau =
        Math.sqrt(1 / 0.95 ** 2 - 1) / (2 * Math.PI * 100);
    const phaseAt50Hz = getFrequencyResponse(
        maximumTau,
        2 * Math.PI * 50,
    ).phaseDegrees;

    return [
        {
            label: 'Amplitude ratio, τ = 0.2 s and ω = 2 rad/s',
            expected: 0.9285,
            actual: sensor.magnitude,
            unit: 'ratio',
            passed: Math.abs(sensor.magnitude - 0.9285) < 0.001,
        },
        {
            label: 'Phase lag, τ = 0.2 s and ω = 2 rad/s',
            expected: -21.8,
            actual: sensor.phaseDegrees,
            unit: 'degrees',
            passed: Math.abs(sensor.phaseDegrees - -21.8) < 0.2,
        },
        {
            label: 'Maximum τ for 100 Hz at 5% amplitude loss',
            expected: 0.52,
            actual: maximumTau * 1000,
            unit: 'ms',
            passed: Math.abs(maximumTau * 1000 - 0.52) < 0.01,
        },
        {
            label: 'Phase lag at 50 Hz using τmax',
            expected: -9.3,
            actual: phaseAt50Hz,
            unit: 'degrees',
            passed: Math.abs(phaseAt50Hz - -9.3) < 0.2,
        },
    ];
}
