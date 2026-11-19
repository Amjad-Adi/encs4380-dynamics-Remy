import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';

import {
    simulateSlowSensorPID,
    type SlowSensorPIDParameters,
    type SlowSensorPIDResponsePoint,
} from '../../domain/slow-sensor-pid.ts';

type Prediction = 'increase' | 'decrease' | 'same';
type PredictionKey = 'lag' | 'overshoot' | 'oscillation';

interface PredictionExerciseProps {
    parameters: SlowSensorPIDParameters;
}

interface Comparison {
    lag: Prediction;
    overshoot: Prediction;
    oscillation: Prediction | null;
    baselinePeak: number;
    increasedPeak: number;
    baselineOscillation: OscillationMeasurement;
    increasedOscillation: OscillationMeasurement;
}

interface OscillationMeasurement {
    amplitude: number;
    extremaCount: number;
    sufficient: boolean;
    behavior: 'growing' | 'decaying' | 'sustained' | 'insufficient';
}

const OPTIONS: { value: Prediction; label: string }[] = [
    { value: 'increase', label: 'Increase' },
    { value: 'decrease', label: 'Decrease' },
    { value: 'same', label: 'Stay about the same' },
];

export function PredictionExercise({ parameters }: PredictionExerciseProps) {
    const [answers, setAnswers] = useState<Partial<Record<PredictionKey, Prediction>>>({});
    const [checkedSignature, setCheckedSignature] = useState<string | null>(null);

    const signature = JSON.stringify(parameters);
    const comparison = useMemo(() => {
        const baseline = simulateSlowSensorPID(parameters);
        const increasedSensorTau = simulateSlowSensorPID({
            ...parameters,
            sensorTau: parameters.sensorTau * 2,
        });

        return compareResponses(baseline, increasedSensorTau, parameters.setpoint);
    }, [parameters]);

    useEffect(() => {
        setAnswers({});
        setCheckedSignature(null);
    }, [signature]);

    const isChecked = checkedSignature === signature;
    const allAnswered =
        answers.lag !== undefined &&
        answers.overshoot !== undefined &&
        answers.oscillation !== undefined;
    const allCorrect =
        isChecked &&
        answers.lag === comparison.lag &&
        answers.overshoot === comparison.overshoot &&
        comparison.oscillation !== null &&
        answers.oscillation === comparison.oscillation;

    function chooseAnswer(key: PredictionKey, value: Prediction) {
        setAnswers((current) => ({ ...current, [key]: value }));
        setCheckedSignature(null);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-brand" />
                    <CardTitle className="text-base">Predict, then check</CardTitle>
                </div>
                <CardDescription>
                    Predict what changes when the sensor time constant is doubled from the current
                    value. Choose your answers before revealing the simulation comparison.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <PredictionQuestion
                    title="Sensor measurement lag will…"
                    value={answers.lag}
                    onChange={(value) => chooseAnswer('lag', value)}
                />
                <PredictionQuestion
                    title="True plant overshoot will…"
                    value={answers.overshoot}
                    onChange={(value) => chooseAnswer('overshoot', value)}
                />
                <PredictionQuestion
                    title="Oscillatory behavior will…"
                    value={answers.oscillation}
                    onChange={(value) => chooseAnswer('oscillation', value)}
                />

                <Button
                    type="button"
                    disabled={!allAnswered}
                    onClick={() => setCheckedSignature(signature)}
                >
                    Check Prediction
                </Button>

                {isChecked && (
                    <div
                        className="border-border bg-muted/40 space-y-3 rounded-lg border p-4"
                        role="status"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2
                                size={17}
                                className={allCorrect ? 'text-success' : 'text-muted-foreground'}
                            />
                            {allCorrect
                                ? 'All predictions are correct.'
                                : 'Review each prediction below.'}
                        </div>

                        <PredictionFeedback
                            label="Sensor measurement lag"
                            answer={answers.lag}
                            actual={comparison.lag}
                            explanation="A larger sensor time constant makes the measured output respond more slowly, increasing the delay between the plant and its feedback signal."
                        />
                        <PredictionFeedback
                            label="True plant overshoot"
                            answer={answers.overshoot}
                            actual={comparison.overshoot}
                            explanation={`The simulated peak changed from ${comparison.baselinePeak.toFixed(3)} to ${comparison.increasedPeak.toFixed(3)} when the sensor time constant was doubled.`}
                        />
                        <PredictionFeedback
                            label="Oscillatory behavior"
                            answer={answers.oscillation}
                            actual={comparison.oscillation}
                            explanation={getOscillationExplanation(comparison)}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PredictionQuestion({
    title,
    value,
    onChange,
}: {
    title: string;
    value: Prediction | undefined;
    onChange: (value: Prediction) => void;
}) {
    return (
        <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{title}</legend>
            <div className="grid grid-cols-3 gap-2">
                {OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={value === option.value}
                        onClick={() => onChange(option.value)}
                        className={[
                            'rounded-lg border px-3 py-2.5 text-sm transition-colors',
                            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                            value === option.value
                                ? 'border-brand bg-accent text-accent-foreground'
                                : 'border-border hover:bg-muted',
                        ].join(' ')}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}

function PredictionFeedback({
    label,
    answer,
    actual,
    explanation,
}: {
    label: string;
    answer: Prediction | undefined;
    actual: Prediction | null;
    explanation: string;
}) {
    const correct = actual !== null && answer === actual;

    return (
        <div className="space-y-1 text-sm">
            <p className={correct ? 'text-success font-medium' : 'text-destructive font-medium'}>
                {label}: {correct ? 'Correct' : 'Not quite'}
            </p>
            <p className="text-muted-foreground leading-6">
                Your answer: {formatPrediction(answer)}. Actual trend: {formatPrediction(actual)}.{' '}
                {explanation}
            </p>
        </div>
    );
}

function formatPrediction(value: Prediction | null | undefined): string {
    if (value === null) return 'insufficient data';
    if (value === 'increase') return 'increase';
    if (value === 'decrease') return 'decrease';
    return 'stay about the same';
}

function compareResponses(
    baseline: SlowSensorPIDResponsePoint[],
    increased: SlowSensorPIDResponsePoint[],
    setpoint: number,
): Comparison {
    const baselinePeak = Math.max(...baseline.map((point) => point.trueOutput));
    const increasedPeak = Math.max(...increased.map((point) => point.trueOutput));
    const baselineOscillation = getOscillationAmplitude(baseline, setpoint);
    const increasedOscillation = getOscillationAmplitude(increased, setpoint);
    const oscillation =
        baselineOscillation.sufficient && increasedOscillation.sufficient
            ? trend(increasedOscillation.amplitude, baselineOscillation.amplitude)
            : null;

    return {
        lag: 'increase',
        overshoot: trend(increasedPeak, baselinePeak),
        oscillation,
        baselinePeak,
        increasedPeak,
        baselineOscillation,
        increasedOscillation,
    };
}

function getOscillationAmplitude(
    points: SlowSensorPIDResponsePoint[],
    setpoint: number,
): OscillationMeasurement {
    const firstCrossingIndex = points.findIndex(
        (point, index) =>
            index > 0 &&
            (points[index - 1].trueOutput - setpoint) * (point.trueOutput - setpoint) <= 0,
    );

    if (firstCrossingIndex < 0) {
        return {
            amplitude: 0,
            extremaCount: 0,
            sufficient: false,
            behavior: 'insufficient',
        };
    }

    const extrema: number[] = [];

    for (let index = firstCrossingIndex + 1; index < points.length - 1; index++) {
        const previousChange = points[index].trueOutput - points[index - 1].trueOutput;
        const nextChange = points[index + 1].trueOutput - points[index].trueOutput;

        if (previousChange * nextChange < 0) {
            extrema.push(points[index].trueOutput);
        }
    }

    if (extrema.length < 2) {
        return {
            amplitude: 0,
            extremaCount: extrema.length,
            sufficient: false,
            behavior: 'insufficient',
        };
    }

    const amplitude = Math.max(...extrema) - Math.min(...extrema);
    const signalScale = Math.max(
        1,
        Math.abs(setpoint),
        ...points.map((point) => Math.abs(point.trueOutput)),
    );
    const numericalTolerance = signalScale * 1e-6;
    const envelopes = extrema.map((value) => Math.abs(value - setpoint));
    const envelopeChange = envelopes[envelopes.length - 1] - envelopes[0];
    const envelopeTolerance = Math.max(0.001, signalScale * 0.01);
    const behavior =
        envelopeChange > envelopeTolerance
            ? 'growing'
            : envelopeChange < -envelopeTolerance
              ? 'decaying'
              : 'sustained';

    return {
        amplitude: amplitude <= numericalTolerance ? 0 : amplitude,
        extremaCount: extrema.length,
        sufficient: true,
        behavior,
    };
}

function getOscillationExplanation(comparison: Comparison): string {
    const baseline = comparison.baselineOscillation;
    const increased = comparison.increasedOscillation;

    if (!baseline.sufficient || !increased.sufficient) {
        return `Insufficient data to compare oscillation amplitude: the baseline has ${baseline.extremaCount} detected extrema and the increased-sensor-time-constant case has ${increased.extremaCount}. At least two extrema are required for a peak-to-peak measurement, so no increase or decrease is reported.`;
    }

    if (baseline.amplitude === 0 && increased.amplitude === 0) {
        return `At least two extrema were detected in both responses, but both peak-to-peak amplitudes are effectively zero (${baseline.amplitude.toFixed(3)} and ${increased.amplitude.toFixed(3)}). This is a measured zero-amplitude result, not insufficient data.`;
    }

    return `After the first setpoint crossing, the peak-to-peak range across ${baseline.extremaCount} baseline and ${increased.extremaCount} increased-sensor-time-constant extrema changed from ${baseline.amplitude.toFixed(3)} to ${increased.amplitude.toFixed(3)}. The oscillation envelope is ${baseline.behavior} before and ${increased.behavior} after the sensor-time-constant change. This measures amplitude and envelope trend rather than merely counting crossings.`;
}

function trend(next: number, previous: number): Prediction {
    const tolerance = Math.max(0.001, Math.abs(previous) * 0.01);
    if (next > previous + tolerance) return 'increase';
    if (next < previous - tolerance) return 'decrease';
    return 'same';
}
