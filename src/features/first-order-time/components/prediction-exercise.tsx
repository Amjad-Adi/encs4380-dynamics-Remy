import { useState } from 'react';
import {
    Activity,
    CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Prediction = 'slower' | 'faster' | 'same';

const options: {
    value: Prediction;
    label: string;
}[] = [
    {
        value: 'slower',
        label: 'The response becomes slower',
    },
    {
        value: 'faster',
        label: 'The response becomes faster',
    },
    {
        value: 'same',
        label: 'The response is unchanged',
    },
];

export function PredictionExercise() {
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [checked, setChecked] = useState(false);

    const isCorrect = prediction === 'slower';

    return (
        <section>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-brand" />

                        <CardTitle className="text-base">
                            Predict, then check
                        </CardTitle>
                    </div>

                    <CardDescription>
                        Suppose the time constant increases while the input
                        and gain remain unchanged. What happens to the
                        response speed?
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={prediction === option.value}
                                onClick={() => {
                                    setPrediction(option.value);
                                    setChecked(false);
                                }}
                                className={[
                                    'rounded-lg border p-3 text-left text-sm transition-colors',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    prediction === option.value
                                        ? 'border-brand bg-accent text-accent-foreground'
                                        : 'border-border hover:bg-muted',
                                ].join(' ')}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            disabled={!prediction}
                            onClick={() => setChecked(true)}
                        >
                            Check prediction
                        </Button>

                        {checked && (
                            <div
                                className="flex items-center gap-2 text-sm"
                                role="status"
                            >
                                {isCorrect ? (
                                    <>
                                        <CheckCircle2
                                            size={17}
                                            className="text-success"
                                        />

                                        <span className="text-success">
                      Correct. A larger time constant means a slower
                      response.
                    </span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">
                    Not quite. Increasing τ increases the time
                    required to approach the final value.
                  </span>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}