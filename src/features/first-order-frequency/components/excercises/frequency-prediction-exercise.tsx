import { useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';

import { getFrequencyResponse } from '@/features/first-order-frequency/domain/first-order-frequency.ts';

type Prediction = 'decrease' | 'same' | 'increase';

const options: { value: Prediction; label: string }[] = [
    { value: 'decrease', label: 'Decrease' },
    { value: 'same', label: 'Stay the same' },
    { value: 'increase', label: 'Increase' },
];

export function FrequencyPredictionExercise({ tau }: { tau: number }) {
    const [amplitudePrediction, setAmplitudePrediction] = useState<Prediction | null>(null);
    const [phasePrediction, setPhasePrediction] = useState<Prediction | null>(null);
    const [checked, setChecked] = useState(false);

    const low = getFrequencyResponse(tau, 0.1 / tau);
    const high = getFrequencyResponse(tau, 10 / tau);
    const correct = amplitudePrediction === 'decrease' && phasePrediction === 'increase';

    function chooseAmplitude(value: Prediction) {
        setAmplitudePrediction(value);
        setChecked(false);
    }

    function choosePhase(value: Prediction) {
        setPhasePrediction(value);
        setChecked(false);
    }

    function reset() {
        setAmplitudePrediction(null);
        setPhasePrediction(null);
        setChecked(false);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-brand" />
                    <CardTitle className="text-base">Predict, then check</CardTitle>
                </div>
                <CardDescription>
                    Keep τ fixed. Predict what happens as the input frequency increases
                    from 0.1ωc to 10ωc.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <PredictionQuestion
                    title="Output amplitude will…"
                    value={amplitudePrediction}
                    onChange={chooseAmplitude}
                />
                <PredictionQuestion
                    title="Phase-lag magnitude will…"
                    value={phasePrediction}
                    onChange={choosePhase}
                />

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="button"
                        disabled={!amplitudePrediction || !phasePrediction}
                        onClick={() => setChecked(true)}
                    >
                        Check my prediction
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={reset}>
                        Clear answers
                    </Button>
                </div>

                {checked && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4" role="status">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2
                                size={17}
                                className={correct ? 'text-success' : 'text-muted-foreground'}
                            />
                            {correct ? 'Both predictions are correct.' : 'Review the comparison below.'}
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                            As frequency increases, the sensor attenuates the signal more
                            strongly and its phase lag approaches −90°.
                        </p>
                        <div className="grid gap-2 text-xs sm:grid-cols-2">
                            <p className="rounded-md bg-background p-3">
                                <span className="font-semibold">0.1ωc:</span>{' '}
                                M = {low.magnitude.toFixed(4)}, φ = {low.phaseDegrees.toFixed(2)}°
                            </p>
                            <p className="rounded-md bg-background p-3">
                                <span className="font-semibold">10ωc:</span>{' '}
                                M = {high.magnitude.toFixed(4)}, φ = {high.phaseDegrees.toFixed(2)}°
                            </p>
                        </div>
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
    value: Prediction | null;
    onChange: (value: Prediction) => void;
}) {
    return (
        <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{title}</legend>
            <div className="grid grid-cols-3 gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={value === option.value}
                        onClick={() => onChange(option.value)}
                        className={[
                            'rounded-lg border px-3 py-2.5 text-sm transition-colors',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
