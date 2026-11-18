import { useState } from 'react';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Prediction = 'faster' | 'slower' | 'unchanged';
export function PIDPredictionExercise() {
    const [answer, setAnswer] = useState<Prediction | null>(null);
    const [checked, setChecked] = useState(false);
    const options: [Prediction, string][] = [
        ['faster', 'It becomes faster'],
        ['slower', 'It becomes slower'],
        ['unchanged', 'It stays unchanged'],
    ];
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Lightbulb className="text-primary size-4" />
                    <CardTitle className="text-base">Predict, then check</CardTitle>
                </div>
                <CardDescription>
                    Consider a first-order plant with K = 1 and τ = 1 s, using P-only control. The
                    proportional gain is increased from Kₚ = 2 to Kₚ = 9. What happens to the
                    closed-loop response speed?
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {options.map(([value, label]) => (
                        <Button
                            key={value}
                            type="button"
                            variant={answer === value ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => {
                                setAnswer(value);
                                setChecked(false);
                            }}
                            aria-pressed={answer === value}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        size="sm"
                        disabled={!answer}
                        onClick={() => setChecked(true)}
                    >
                        Check prediction
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setAnswer(null);
                            setChecked(false);
                        }}
                    >
                        Reset
                    </Button>
                </div>
                {checked && (
                    <div className="bg-muted/60 space-y-1 rounded-lg p-3 text-sm">
                        <p className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="text-primary size-4" />
                            {answer === 'faster' ? 'Correct.' : 'Not quite.'}
                        </p>
                        <p className="text-muted-foreground leading-6">
                            For P-only control, the closed-loop time constant is τ / (1 + K·Kₚ). It
                            decreases from 1/3 s to 1/10 s, so the response becomes faster. The
                            steady-state error also decreases from 1/3 to 1/10 of the setpoint.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
