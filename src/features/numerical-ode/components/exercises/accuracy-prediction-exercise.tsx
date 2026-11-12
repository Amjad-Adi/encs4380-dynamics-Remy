import { useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type {
    NumericalErrorMetrics,
    NumericalOdeParameters,
} from '@/features/numerical-ode/domain/numerical-ode';
import type { NumericalMethod } from '../controls/numerical-ode-controls';

interface AccuracyPredictionExerciseProps {
    parameters: NumericalOdeParameters;
    eulerError: NumericalErrorMetrics;
    rk4Error: NumericalErrorMetrics;
}

const OPTIONS: { value: NumericalMethod; label: string }[] = [
    { value: 'euler', label: "Euler's method" },
    { value: 'rk4', label: 'Fourth-order Runge–Kutta' },
];

function getMoreAccurateMethod(
    euler: NumericalErrorMetrics,
    rk4: NumericalErrorMetrics,
): NumericalMethod | null {
    if (
        Math.abs(euler.rootMeanSquareError - rk4.rootMeanSquareError) <= 1e-12
    ) {
        return null;
    }
    return euler.rootMeanSquareError < rk4.rootMeanSquareError ? 'euler' : 'rk4';
}

export function AccuracyPredictionExercise({
    parameters,
    eulerError,
    rk4Error,
}: AccuracyPredictionExerciseProps) {
    const [prediction, setPrediction] = useState<NumericalMethod | null>(null);
    const [checked, setChecked] = useState(false);
    const actual = getMoreAccurateMethod(eulerError, rk4Error);
    const predictionIsCorrect = prediction === actual;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-brand" />
                    <CardTitle className="text-base">Predict, then check</CardTitle>
                </div>
                <CardDescription>
                    For the current system and step size, predict which method has
                    the lower RMSE compared with the analytical response.
                    {' '}K = {parameters.gain.toFixed(2)}, τ = {parameters.timeConstant.toFixed(2)} s,
                    {' '}A = {parameters.amplitude.toFixed(2)}, Δt = {parameters.stepSize.toFixed(2)} s,
                    {' '}duration = {parameters.duration.toFixed(2)} s.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">
                        Which numerical method will be more accurate?
                    </legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={prediction === value}
                                onClick={() => {
                                    setPrediction(value);
                                    setChecked(false);
                                }}
                                className={[
                                    'rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    prediction === value
                                        ? 'border-brand bg-accent text-accent-foreground'
                                        : 'border-border hover:bg-muted',
                                ].join(' ')}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <Button
                    type="button"
                    disabled={prediction === null}
                    onClick={() => setChecked(true)}
                >
                    Check my prediction
                </Button>

                {checked && (
                    <div
                        className="space-y-3 rounded-lg border border-border bg-muted/40 p-4"
                        role="status"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2
                                size={17}
                                className={
                                    predictionIsCorrect
                                        ? 'text-success'
                                        : 'text-muted-foreground'
                                }
                            />
                            {actual === null
                                ? 'Both methods have the same RMSE for this experiment.'
                                : predictionIsCorrect
                                  ? 'Correct prediction.'
                                  : 'Not quite; compare the errors below.'}
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                            {actual === null
                                ? 'The methods are equally accurate by RMSE at the sampled timestamps.'
                                : `${actual === 'euler' ? "Euler's method" : 'Fourth-order Runge–Kutta'} has the lower RMSE (${(actual === 'euler' ? eulerError.rootMeanSquareError : rk4Error.rootMeanSquareError).toExponential(3)}). RMSE measures the typical error over all shared sample times; compare maximum and final-time errors as well, since those describe peak error and error at the endpoint.`}
                        </p>
                        <div className="grid gap-2 text-xs sm:grid-cols-2">
                            <p className="rounded-md bg-background p-3">
                                <span className="font-semibold">Euler:</span>{' '}
                                RMSE {eulerError.rootMeanSquareError.toExponential(3)}
                                {' · '}max {eulerError.maximumAbsoluteError.toExponential(3)}
                                {' · '}final {eulerError.finalTimeAbsoluteError.toExponential(3)}
                            </p>
                            <p className="rounded-md bg-background p-3">
                                <span className="font-semibold">RK4:</span>{' '}
                                RMSE {rk4Error.rootMeanSquareError.toExponential(3)}
                                {' · '}max {rk4Error.maximumAbsoluteError.toExponential(3)}
                                {' · '}final {rk4Error.finalTimeAbsoluteError.toExponential(3)}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
