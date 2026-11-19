
import type { PIDSimulationConfig, PIDSimulationResult, SimulationSample } from "./pid-types";

export function simulatePID(
    config: PIDSimulationConfig
): PIDSimulationResult {
    const { plant, gains, setpoint, outputLimits, duration, dt } = config;

    const samples: SimulationSample[] = [];

    let output = 0;
    let outputVelocity = 0;
    let integral = 0;
    let previousError = setpoint - output;

    const steps = Math.floor(duration / dt);

    for (let i = 0; i <= steps; i++) {
        const time = i * dt;
        const error = setpoint - output;

        const derivative = i === 0 ? 0 : (error - previousError) / dt;

        const rawControl =
            gains.kp * error +
            gains.ki * integral +
            gains.kd * derivative;

        const control = Math.max(
            outputLimits.min,
            Math.min(outputLimits.max, rawControl)
        );

        samples.push({
            time,
            setpoint,
            output,
            error,
            control,
        });

        // Simple anti-windup:
        // Integrate only when saturation is not pushing further
        // in the same direction as the error.
        const saturatedHigh = rawControl > outputLimits.max;
        const saturatedLow = rawControl < outputLimits.min;

        if (
            (!saturatedHigh && !saturatedLow) ||
            (saturatedHigh && error < 0) ||
            (saturatedLow && error > 0)
        ) {
            integral += error * dt;
        }

        if (plant.type === "first-order") {
            const outputDerivative =
                (plant.gain * control - output) / plant.timeConstant;

            output += outputDerivative * dt;
        } else {
            const acceleration =
                plant.naturalFrequency ** 2 *
                (plant.gain * control - output) -
                2 *
                plant.dampingRatio *
                plant.naturalFrequency *
                outputVelocity;

            outputVelocity += acceleration * dt;
            output += outputVelocity * dt;
        }

        previousError = error;
    }

    const metrics = calculateMetrics(samples, setpoint);

    return {
        samples,
        metrics,
    };
}

function calculateMetrics(
    samples: SimulationSample[],
    setpoint: number
) {
    if (samples.length === 0) {
        return {
            riseTime: null,
            overshoot: 0,
            settlingTime: null,
            steadyStateError: setpoint,
        };
    }

    const finalOutput = samples[samples.length - 1].output;
    const steadyStateError = setpoint - finalOutput;

    const amplitude = Math.abs(setpoint);
    const direction = setpoint >= 0 ? 1 : -1;

    const tenPercent = direction * amplitude * 0.1;
    const ninetyPercent = direction * amplitude * 0.9;

    let riseStart: number | null = null;
    let riseEnd: number | null = null;

    for (const sample of samples) {
        const normalizedOutput = direction * sample.output;

        if (riseStart === null && normalizedOutput >= tenPercent) {
            riseStart = sample.time;
        }

        if (riseEnd === null && normalizedOutput >= ninetyPercent) {
            riseEnd = sample.time;
        }
    }

    const riseTime =
        riseStart !== null && riseEnd !== null
            ? riseEnd - riseStart
            : null;

    const peakOutput = Math.max(
        ...samples.map((sample) => direction * sample.output)
    );

    const overshoot =
        amplitude > 0
            ? Math.max(0, ((peakOutput - amplitude) / amplitude) * 100)
            : 0;

    const tolerance = amplitude * 0.02;
    let settlingTime: number | null = null;

    for (let i = samples.length - 1; i >= 0; i--) {
        const deviation = Math.abs(samples[i].output - setpoint);

        if (deviation > tolerance) {
            if (i + 1 < samples.length) {
                settlingTime = samples[i + 1].time;
            }
            break;
        }

        if (i === 0) {
            settlingTime = samples[0].time;
        }
    }

    return {
        riseTime,
        overshoot,
        settlingTime,
        steadyStateError,
    };
}
