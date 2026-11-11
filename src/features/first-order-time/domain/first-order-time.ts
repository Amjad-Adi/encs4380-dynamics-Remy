import { useIsMobile } from '@/hooks/use-is-mobile.ts';
import { useState } from 'react';
import type { ModuleSection } from '@/components/modules/section-navigation.tsx';
import { Activity, BookOpen, Gauge, SlidersHorizontal } from 'lucide-react';

export type FirstOrderInputType = 'step' | 'ramp';

export interface FirstOrderParameters {
    gain: number;
    tau: number;
    amplitude: number;
}

export interface ResponsePoint {
    time: number;
    input: number;
    output: number;
    reference: number;
    error: number;
}

export interface ValidationResult {
    label: string;
    expected: number;
    actual: number;
    unit: string;
    passed: boolean;
}

export const TIME_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'analysis', label: 'Analysis', icon: Activity },
    { id: 'challenge', label: 'Challenge', icon: Gauge },
];

export function stepResponse(time: number, { gain, tau, amplitude }: FirstOrderParameters): number {
    return gain * amplitude * (1 - Math.exp(-time / tau));
}

export function rampResponse(time: number, { gain, tau, amplitude }: FirstOrderParameters): number {
    return gain * amplitude * (time - tau * (1 - Math.exp(-time / tau)));
}

export function errorFraction(time: number, tau: number): number {
    return Math.exp(-time / tau);
}

export function generateTimeResponse(
    parameters: FirstOrderParameters,
    inputType: FirstOrderInputType,
    duration: number,
    samples = 500,
): ResponsePoint[] {
    const { gain, tau, amplitude } = parameters;

    return Array.from({ length: samples }, (_, index) => {
        const time = (index / (samples - 1)) * duration;

        const input = inputType === 'step' ? amplitude : amplitude * time;

        const output =
            inputType === 'step' ? stepResponse(time, parameters) : rampResponse(time, parameters);

        const reference = gain * input;

        return {
            time,
            input,
            output,
            reference,
            error: reference - output,
        };
    });
}

export function generateErrorFractionData(tau: number) {
    return Array.from({ length: 101 }, (_, index) => {
        const time = (5 * tau * index) / 100;
        const fraction = Math.exp(-time / tau);

        return {
            time,
            fraction,
            logarithm: Math.log(fraction),
        };
    });
}

export function getStepValidation(parameters: FirstOrderParameters): ValidationResult[] {
    const finalValue = parameters.gain * parameters.amplitude;

    const tests = [
        {
            label: 'Response at τ',
            time: parameters.tau,
            expectedFraction: 0.6321205588,
        },
        {
            label: 'Response at 3τ',
            time: 3 * parameters.tau,
            expectedFraction: 0.9502129316,
        },
    ];

    return tests.map(({ label, time, expectedFraction }) => {
        const expected = expectedFraction * finalValue;
        const actual = stepResponse(time, parameters);

        return {
            label,
            expected,
            actual,
            unit: 'output units',
            passed: Math.abs(actual - expected) < 1e-6,
        };
    });
}

export function getRampSteadyStateError(parameters: FirstOrderParameters): number {
    return parameters.gain * parameters.amplitude * parameters.tau;
}

export function getRampLag(tau: number): number {
    return tau;
}
