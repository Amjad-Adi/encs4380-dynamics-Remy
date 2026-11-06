import { useState } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    getDampingRegime,
    type DampingRegime,
    type PhysicalParameters,
    type ResponseMetrics,
} from '@/features/second-order/domain/second-order';

type OvershootPrediction = 'yes' | 'no';

const REGIME_OPTIONS: Array<{ value: DampingRegime; label: string }> = [
    { value: 'undamped', label: 'Undamped' },
    { value: 'underdamped', label: 'Underdamped' },
    { value: 'critical', label: 'Critically damped' },
    { value: 'overdamped', label: 'Overdamped' },
];

const REGIME_LABELS: Record<DampingRegime, string> = {
    undamped: 'Undamped',
    underdamped: 'Underdamped',
    critical: 'Critically damped',
    overdamped: 'Overdamped',
};

interface PredictionExerciseProps {
    parameters: PhysicalParameters;
    metrics: ResponseMetrics;
    onSubmissionChange: (submitted: boolean) => void;
}

export function PredictionExercise({
    parameters,
    metrics,
    onSubmissionChange,
}: PredictionExerciseProps) {
    const [predictedRegime, setPredictedRegime] =
        useState<DampingRegime | null>(null);
    const [predictedOvershoot, setPredictedOvershoot] =
        useState<OvershootPrediction | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const actualRegime = getDampingRegime(parameters);
    const actualOvershoot = metrics.percentageOvershoot > 0;
    const correct =
        predictedRegime === actualRegime &&
        predictedOvershoot === (actualOvershoot ? 'yes' : 'no');

    function submitPrediction() {
        if (predictedRegime === null || predictedOvershoot === null) return;
        setSubmitted(true);
        onSubmissionChange(true);
    }

    function resetPrediction() {
        setPredictedRegime(null);
        setPredictedOvershoot(null);
        setSubmitted(false);
        onSubmissionChange(false);
    }

    return (
        <section id="prediction" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Predict, then check" icon={Lightbulb} />
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Predict the current system behavior
                    </CardTitle>
                    <CardDescription>
                        Using the current m, b, and k values, predict the damping
                        regime and whether the step response overshoots. Submit both
                        predictions to reveal the calculated result.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <fieldset disabled={submitted} className="space-y-2">
                        <legend className="mb-2 text-sm font-medium">
                            Which damping regime applies?
                        </legend>
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                            {REGIME_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={predictedRegime === option.value}
                                    onClick={() => setPredictedRegime(option.value)}
                                    className={[
                                        'rounded-lg border p-3 text-left text-sm transition-colors',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                        predictedRegime === option.value
                                            ? 'border-primary bg-accent text-accent-foreground'
                                            : 'border-border hover:bg-muted',
                                    ].join(' ')}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset disabled={submitted} className="space-y-2">
                        <legend className="mb-2 text-sm font-medium">
                            Will the response overshoot its final displacement?
                        </legend>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {([
                                ['yes', 'Yes, overshoot occurs'],
                                ['no', 'No overshoot'],
                            ] as const).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={predictedOvershoot === value}
                                    onClick={() => setPredictedOvershoot(value)}
                                    className={[
                                        'rounded-lg border p-3 text-left text-sm transition-colors',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                        predictedOvershoot === value
                                            ? 'border-primary bg-accent text-accent-foreground'
                                            : 'border-border hover:bg-muted',
                                    ].join(' ')}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <div className="flex flex-wrap items-center gap-3">
                        {!submitted ? (
                            <Button
                                type="button"
                                disabled={
                                    predictedRegime === null ||
                                    predictedOvershoot === null
                                }
                                onClick={submitPrediction}
                            >
                                Check prediction
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetPrediction}
                            >
                                <RotateCcw />
                                Retry prediction
                            </Button>
                        )}

                        {submitted && (
                            <div
                                className="flex items-start gap-2 text-sm"
                                role="status"
                            >
                                <CheckCircle2
                                    size={17}
                                    className={
                                        correct
                                            ? 'mt-0.5 shrink-0 text-success'
                                            : 'mt-0.5 shrink-0 text-muted-foreground'
                                    }
                                />
                                <p>
                                    {correct ? 'Correct.' : 'Not quite.'}{' '}
                                    The system is{' '}
                                    <strong>{REGIME_LABELS[actualRegime]}</strong>;
                                    overshoot{' '}
                                    <strong>
                                        {actualOvershoot ? 'does occur' : 'does not occur'}
                                    </strong>
                                    . The calculated response and analysis are now
                                    available below.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
