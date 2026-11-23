import {
    RISE_END_LEVEL,
    RISE_START_LEVEL,
    SETTLING_BAND,
} from '@/features/second-order/domain/constants';

/**
 * Step-response performance metrics shared by every Control module. The rise
 * levels (10–90 %) and the ±2 % settling band are the Homework 1 Module 3 constants.
 *
 * Reference value:
 * - 'final-value' (default, textbook definition): rise, overshoot and settling are
 *   measured against the final value y(∞), as in P1, P2, P3 and MySystem.
 * - 'setpoint': measured against the setpoint r, as the P4 specification requires,
 *   so a response that settles short of r never counts as settled.
 */

export type MetricReference = 'final-value' | 'setpoint';

export interface StepResponseSample {
    time: number;
    output: number;
}

export interface StepResponseMetrics {
    /** 10–90 % rise time, or null when the response never rises through both levels. */
    riseTime: number | null;
    peakTime: number | null;
    /** Extreme output in the direction of the reference. */
    peakOutput: number;
    percentageOvershoot: number;
    /** First time after which the output stays within the band, or null if it never settles. */
    settlingTime: number | null;
    /** Output at the end of the run, used as y(∞). */
    finalValue: number;
    /** Signed steady-state error r − y(∞). */
    steadyStateError: number;
    reference: MetricReference;
}

export interface MetricOptions {
    reference?: MetricReference;
    settlingBand?: number;
}

function getCrossingTime(
    samples: readonly StepResponseSample[],
    target: number,
    direction: number,
): number | null {
    if (direction * samples[0].output >= target) return samples[0].time;
    for (let index = 1; index < samples.length; index += 1) {
        const previous = direction * samples[index - 1].output;
        const current = direction * samples[index].output;
        if (previous < target && current >= target) {
            const fraction = (target - previous) / (current - previous);
            return (
                samples[index - 1].time + fraction * (samples[index].time - samples[index - 1].time)
            );
        }
    }
    return null;
}

export function getStepResponseMetrics(
    samples: readonly StepResponseSample[],
    setpoint: number,
    { reference = 'final-value', settlingBand = SETTLING_BAND }: MetricOptions = {},
): StepResponseMetrics {
    const finalValue = samples.length > 0 ? samples[samples.length - 1].output : 0;
    const steadyStateError = setpoint - finalValue;

    if (samples.length < 2) {
        return {
            riseTime: null,
            peakTime: null,
            peakOutput: finalValue,
            percentageOvershoot: 0,
            settlingTime: null,
            finalValue,
            steadyStateError,
            reference,
        };
    }

    const referenceValue = reference === 'setpoint' ? setpoint : finalValue;
    const magnitude = Math.abs(referenceValue);
    const direction = referenceValue < 0 ? -1 : 1;

    let peakIndex = 0;
    samples.forEach((sample, index) => {
        if (direction * sample.output > direction * samples[peakIndex].output) peakIndex = index;
    });
    const peakOutput = samples[peakIndex].output;

    if (magnitude < 1e-12) {
        return {
            riseTime: null,
            peakTime: null,
            peakOutput,
            percentageOvershoot: 0,
            settlingTime: null,
            finalValue,
            steadyStateError,
            reference,
        };
    }

    const riseStart = getCrossingTime(samples, RISE_START_LEVEL * magnitude, direction);
    const riseEnd = getCrossingTime(samples, RISE_END_LEVEL * magnitude, direction);
    const riseTime =
        riseStart !== null && riseEnd !== null && riseEnd >= riseStart ? riseEnd - riseStart : null;

    const percentageOvershoot = Math.max(
        0,
        ((direction * peakOutput - magnitude) / magnitude) * 100,
    );

    const band = Math.max(magnitude * settlingBand, 1e-6);
    let lastOutsideIndex = -1;
    samples.forEach((sample, index) => {
        if (Math.abs(sample.output - referenceValue) > band) lastOutsideIndex = index;
    });
    const settlingTime =
        lastOutsideIndex === -1
            ? samples[0].time
            : lastOutsideIndex < samples.length - 1
              ? samples[lastOutsideIndex + 1].time
              : null;

    return {
        riseTime,
        peakTime: percentageOvershoot > 0 ? samples[peakIndex].time : null,
        peakOutput,
        percentageOvershoot,
        settlingTime,
        finalValue,
        steadyStateError,
        reference,
    };
}

/** Fixed-point formatting that never shows "-0.000" for values that round to zero. */
export function formatMetric(value: number | null, digits: number, empty = '—'): string {
    if (value === null || !Number.isFinite(value)) return empty;
    const fixed = value.toFixed(digits);
    return /^-0\.?0*$/.test(fixed) ? fixed.slice(1) : fixed;
}
