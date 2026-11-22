import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getPIDPerformanceMetrics,
    simulatePID,
    type PIDGains,
    type PIDPlaygroundParameters,
} from '@/features/pid-playground/domain/pid-playground';
import {
    TUNING_DURATION,
    evaluateTuning,
    type SpecKey,
} from '@/features/tuning-challenge/domain/tuning-challenge';

type Prediction = 'increase' | 'decrease' | 'same';
type PredictionKey = 'kp' | 'kd' | 'ki';

interface Question {
    key: PredictionKey;
    title: string;
    metricLabel: string;
    change: (gains: PIDGains) => PIDGains;
    measure: Exclude<SpecKey, 'settlingTime'>;
    tolerance: number;
}

const OPTIONS: { value: Prediction; label: string }[] = [
    { value: 'increase', label: 'Increase' },
    { value: 'decrease', label: 'Decrease' },
    { value: 'same', label: 'Stay about the same' },
];

const QUESTIONS: Question[] = [
    {
        key: 'kp',
        title: 'Raising Kp by 50% will make the overshoot…',
        metricLabel: 'Overshoot',
        change: (gains) => ({ ...gains, kp: gains.kp * 1.5 }),
        measure: 'overshoot',
        tolerance: 0.1,
    },
    {
        key: 'kd',
        title: 'Adding 1 s to Kd will make the overshoot…',
        metricLabel: 'Overshoot',
        change: (gains) => ({ ...gains, kd: gains.kd + 1 }),
        measure: 'overshoot',
        tolerance: 0.1,
    },
    {
        key: 'ki',
        title: 'Setting Ki to zero will make the steady-state error…',
        metricLabel: 'Steady-state error',
        change: (gains) => ({ ...gains, ki: 0 }),
        measure: 'steadyStateError',
        tolerance: 0.1,
    },
];

export function TuningPredictionExercise({ parameters }: { parameters: PIDPlaygroundParameters }) {
    const [answers, setAnswers] = useState<Partial<Record<PredictionKey, Prediction>>>({});
    const [checkedSignature, setCheckedSignature] = useState<string | null>(null);

    const signature = JSON.stringify(parameters);
    const comparison = useMemo(() => {
        const evaluate = (gains: PIDGains) => {
            const points = simulatePID({ ...parameters, gains }, TUNING_DURATION, 6001);
            return evaluateTuning(points, getPIDPerformanceMetrics(points), parameters.setpoint)
                .results;
        };
        const baseline = evaluate(parameters.gains);
        return QUESTIONS.map((question) => {
            const changed = evaluate(question.change(parameters.gains));
            const before = baseline.find((result) => result.key === question.measure);
            const after = changed.find((result) => result.key === question.measure);
            return {
                key: question.key,
                before: before?.measured ?? 0,
                after: after?.measured ?? 0,
                unit: before?.unit ?? '%',
                actual: trend(after?.measured ?? 0, before?.measured ?? 0, question.tolerance),
            };
        });
    }, [parameters]);

    useEffect(() => {
        setAnswers({});
        setCheckedSignature(null);
    }, [signature]);

    const isChecked = checkedSignature === signature;
    const allAnswered = QUESTIONS.every((question) => answers[question.key] !== undefined);
    const allCorrect =
        isChecked && comparison.every((result) => answers[result.key] === result.actual);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Lightbulb className="text-primary size-4" />
                    <CardTitle className="text-base">Predict, then check</CardTitle>
                </div>
                <CardDescription>
                    Starting from your current gains on the hidden plant, predict how each single
                    change affects the response. Each answer is checked against a new simulation.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {QUESTIONS.map((question) => (
                    <fieldset key={question.key} className="space-y-2">
                        <legend className="text-sm font-medium">{question.title}</legend>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {OPTIONS.map((option) => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    variant={
                                        answers[question.key] === option.value
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="justify-start"
                                    onClick={() => {
                                        setAnswers((current) => ({
                                            ...current,
                                            [question.key]: option.value,
                                        }));
                                        setCheckedSignature(null);
                                    }}
                                    aria-pressed={answers[question.key] === option.value}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </fieldset>
                ))}
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        size="sm"
                        disabled={!allAnswered}
                        onClick={() => setCheckedSignature(signature)}
                    >
                        Check prediction
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setAnswers({});
                            setCheckedSignature(null);
                        }}
                    >
                        Reset
                    </Button>
                </div>
                {isChecked && (
                    <div className="bg-muted/60 space-y-3 rounded-lg p-3 text-sm" role="status">
                        <p className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="text-primary size-4" />
                            {allCorrect
                                ? 'All predictions are correct.'
                                : 'Review each prediction below.'}
                        </p>
                        {QUESTIONS.map((question, index) => {
                            const result = comparison[index];
                            const correct = answers[question.key] === result.actual;
                            return (
                                <div key={question.key} className="space-y-1">
                                    <p
                                        className={
                                            correct
                                                ? 'text-success font-medium'
                                                : 'text-destructive font-medium'
                                        }
                                    >
                                        {question.title.replace('…', '')}:{' '}
                                        {correct ? 'Correct' : 'Not quite'}
                                    </p>
                                    <p className="text-muted-foreground leading-6">
                                        Your answer: {formatPrediction(answers[question.key])}.
                                        Actual trend: {formatPrediction(result.actual)}.{' '}
                                        {question.metricLabel} changed from{' '}
                                        {result.before.toFixed(2)} to {result.after.toFixed(2)}{' '}
                                        {result.unit}.
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function formatPrediction(value: Prediction | undefined): string {
    if (value === 'increase') return 'increase';
    if (value === 'decrease') return 'decrease';
    return 'stay about the same';
}

function trend(next: number, previous: number, tolerance: number): Prediction {
    if (next > previous + tolerance) return 'increase';
    if (next < previous - tolerance) return 'decrease';
    return 'same';
}
