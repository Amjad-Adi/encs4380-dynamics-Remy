import { useState } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    type DampingRegime,
    getDampingRegime,
    type PhysicalParameters,
    type ResponseMetrics,
} from '@/features/second-order/domain';

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
}

export function PredictionExercise({ parameters, metrics }: PredictionExerciseProps) {
    const [predictedRegime, setPredictedRegime] = useState<DampingRegime | null>(null);
    const [predictedOvershoot, setPredictedOvershoot] = useState<OvershootPrediction | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const actualRegime = getDampingRegime(parameters);
    const actualOvershoot = metrics.percentageOvershoot > 0;
    const regimeCorrect = predictedRegime === actualRegime;
    const overshootCorrect = predictedOvershoot === (actualOvershoot ? 'yes' : 'no');

    function submitPrediction() {
        if (predictedRegime === null || predictedOvershoot === null) return;
        setSubmitted(true);
    }

    function resetPrediction() {
        setPredictedRegime(null);
        setPredictedOvershoot(null);
        setSubmitted(false);
    }

    return (
        <section id="prediction" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Predict, then check" icon={Lightbulb} />
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Predict the current system behavior</CardTitle>
                    <CardDescription>
                        Using the current m, b, and k values, predict the damping regime and whether
                        the step response overshoots. Submit both predictions to check each answer
                        against the live results.
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
                                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
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
                            {(
                                [
                                    ['yes', 'Yes, overshoot occurs'],
                                    ['no', 'No overshoot'],
                                ] as const
                            ).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={predictedOvershoot === value}
                                    onClick={() => setPredictedOvershoot(value)}
                                    className={[
                                        'rounded-lg border p-3 text-left text-sm transition-colors',
                                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
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
                                disabled={predictedRegime === null || predictedOvershoot === null}
                                onClick={submitPrediction}
                            >
                                Check prediction
                            </Button>
                        ) : (
                            <Button type="button" variant="outline" onClick={resetPrediction}>
                                <RotateCcw />
                                Retry prediction
                            </Button>
                        )}

                        {submitted && (
                            <div className="flex items-start gap-2 text-sm" role="status">
                                <div className="space-y-1">
                                    <p>
                                        <CheckCircle2
                                            size={17}
                                            className={`mr-1 inline ${regimeCorrect ? 'text-success' : 'text-muted-foreground'}`}
                                        />
                                        Damping-regime prediction:{' '}
                                        <strong>{regimeCorrect ? 'Correct.' : 'Not quite.'}</strong>{' '}
                                        You predicted{' '}
                                        <strong>
                                            {predictedRegime === null
                                                ? 'no regime'
                                                : REGIME_LABELS[predictedRegime]}
                                        </strong>
                                        ; the system is{' '}
                                        <strong>{REGIME_LABELS[actualRegime]}</strong>.
                                    </p>
                                    <p>
                                        <CheckCircle2
                                            size={17}
                                            className={`mr-1 inline ${overshootCorrect ? 'text-success' : 'text-muted-foreground'}`}
                                        />
                                        Overshoot prediction:{' '}
                                        <strong>
                                            {overshootCorrect ? 'Correct.' : 'Not quite.'}
                                        </strong>{' '}
                                        You predicted{' '}
                                        <strong>
                                            {predictedOvershoot === 'yes'
                                                ? 'overshoot'
                                                : 'no overshoot'}
                                        </strong>
                                        ; overshoot{' '}
                                        <strong>
                                            {actualOvershoot ? 'does occur' : 'does not occur'}
                                        </strong>
                                        .
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
