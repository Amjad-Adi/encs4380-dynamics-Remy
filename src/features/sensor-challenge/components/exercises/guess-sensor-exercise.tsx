import { useState, type FormEvent } from 'react';
import { CheckCircle2, Lightbulb, Send } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SensorResponseChart } from '@/features/sensor-challenge/components/charts/sensor-response-chart';
import {
    earnsFullCredit,
    getParameterErrors,
    type SensorChallenge,
    type SensorEstimate,
    type SensorType,
} from '@/features/sensor-challenge/domain/sensor-challenge';

interface GuessSensorExerciseProps {
    challenge: SensorChallenge;
    onSubmit: (earnedCredit: boolean) => void;
    onNewSensor: () => void;
}

function actualDescription(challenge: SensorChallenge): string {
    const parameters = challenge.parameters;
    if (parameters.type === 'first-order') {
        return `First-order · τ = ${parameters.tau.toFixed(3)} s`;
    }
    return `Second-order · ζ = ${parameters.zeta.toFixed(3)}, ωn = ${parameters.omegaN.toFixed(3)} rad/s`;
}

export function GuessSensorExercise({
    challenge,
    onSubmit,
    onNewSensor,
}: GuessSensorExerciseProps) {
    const [estimatedType, setEstimatedType] = useState<SensorType>('first-order');
    const [tau, setTau] = useState('');
    const [zeta, setZeta] = useState('');
    const [omegaN, setOmegaN] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [estimate, setEstimate] = useState<SensorEstimate | null>(null);
    const submitted = estimate !== null;

    const errors = estimate ? getParameterErrors(challenge.parameters, estimate) : [];
    const correctType = estimate !== null && challenge.parameters.type === estimate.type;
    const fullCredit = estimate !== null && earnsFullCredit(challenge.parameters, estimate);

    function submitEstimate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const firstValue = Number(estimatedType === 'first-order' ? tau : zeta);
        const secondValue = Number(omegaN);

        if (
            !Number.isFinite(firstValue) ||
            firstValue <= 0 ||
            (estimatedType === 'second-order' &&
                (firstValue >= 1 || !Number.isFinite(secondValue) || secondValue <= 0))
        ) {
            setErrorMessage(
                estimatedType === 'first-order'
                    ? 'Enter a positive time constant.'
                    : 'Enter a damping ratio between 0 and 1 and a positive natural frequency.',
            );
            return;
        }

        const nextEstimate: SensorEstimate =
            estimatedType === 'first-order'
                ? { type: estimatedType, tau: firstValue }
                : {
                      type: estimatedType,
                      zeta: firstValue,
                      omegaN: secondValue,
                  };

        setErrorMessage('');
        setEstimate(nextEstimate);
        onSubmit(earnsFullCredit(challenge.parameters, nextEstimate));
    }

    return (
        <section id="sensor-challenge" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Guess the sensor" icon={Lightbulb} />
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Inspect the response and make your prediction
                    </CardTitle>
                    <CardDescription>
                        The blue measurements include simulated sensor noise. Choose a model,
                        estimate its parameters, and submit to reveal the answer and compare curves.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <SensorResponseChart
                        challenge={challenge}
                        estimate={estimate ?? undefined}
                        revealed={submitted}
                    />

                    {!submitted ? (
                        <form className="space-y-5" onSubmit={submitEstimate}>
                            <fieldset className="space-y-2">
                                <legend className="text-sm font-medium">
                                    Which sensor model best fits the trace?
                                </legend>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {(
                                        [
                                            ['first-order', 'First-order'],
                                            ['second-order', 'Second-order'],
                                        ] as const
                                    ).map(([type, label]) => (
                                        <button
                                            key={type}
                                            type="button"
                                            aria-pressed={estimatedType === type}
                                            onClick={() => {
                                                setEstimatedType(type);
                                                setErrorMessage('');
                                            }}
                                            className={[
                                                'rounded-lg border p-3 text-left text-sm transition-colors',
                                                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                                                estimatedType === type
                                                    ? 'border-primary bg-accent text-accent-foreground'
                                                    : 'border-border hover:bg-muted',
                                            ].join(' ')}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            {estimatedType === 'first-order' ? (
                                <div className="max-w-sm space-y-2">
                                    <Label htmlFor="guess-tau">Estimated time constant τ (s)</Label>
                                    <Input
                                        id="guess-tau"
                                        type="number"
                                        min="0.001"
                                        step="any"
                                        required
                                        value={tau}
                                        onChange={(event) => setTau(event.target.value)}
                                        placeholder="e.g. 1.2"
                                    />
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="guess-zeta">
                                            Estimated damping ratio ζ
                                        </Label>
                                        <Input
                                            id="guess-zeta"
                                            type="number"
                                            min="0.001"
                                            max="0.999"
                                            step="any"
                                            required
                                            value={zeta}
                                            onChange={(event) => setZeta(event.target.value)}
                                            placeholder="e.g. 0.45"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="guess-omega-n">
                                            Estimated natural frequency ωn (rad/s)
                                        </Label>
                                        <Input
                                            id="guess-omega-n"
                                            type="number"
                                            min="0.001"
                                            step="any"
                                            required
                                            value={omegaN}
                                            onChange={(event) => setOmegaN(event.target.value)}
                                            placeholder="e.g. 2.0"
                                        />
                                    </div>
                                </div>
                            )}

                            {errorMessage && (
                                <p className="text-destructive text-sm" role="alert">
                                    {errorMessage}
                                </p>
                            )}

                            <Button type="submit" className="gap-2">
                                <Send size={15} />
                                Submit prediction &amp; reveal
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4" role="status">
                            <div
                                className={[
                                    'rounded-lg border p-4',
                                    fullCredit
                                        ? 'border-success/30 bg-success/5'
                                        : 'border-border bg-muted/40',
                                ].join(' ')}
                            >
                                <div className="flex items-start gap-2">
                                    <CheckCircle2
                                        size={18}
                                        className={
                                            fullCredit
                                                ? 'text-success mt-0.5'
                                                : 'text-muted-foreground mt-0.5'
                                        }
                                    />
                                    <div className="space-y-2">
                                        <p className="font-semibold">
                                            {fullCredit
                                                ? 'Full credit - excellent estimate!'
                                                : 'Challenge revealed'}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Actual sensor: {actualDescription(challenge)}
                                        </p>
                                        {!correctType && (
                                            <p className="text-muted-foreground text-sm">
                                                The selected model type was not correct; parameter
                                                errors are only comparable when the model type
                                                matches.
                                            </p>
                                        )}
                                        {errors.map((parameterError) => (
                                            <p key={parameterError.label} className="text-sm">
                                                {parameterError.label}: estimated{' '}
                                                {parameterError.estimate.toFixed(3)}, actual{' '}
                                                {parameterError.actual.toFixed(3)}
                                                {' · '}
                                                {parameterError.percent.toFixed(1)}% error (
                                                {parameterError.withinTolerance
                                                    ? 'within 10%'
                                                    : 'outside 10%'}
                                                )
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button type="button" onClick={onNewSensor} className="gap-2">
                                New Sensor
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}

export function SensorHints() {
    return (
        <section id="hints" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Hints for reading the response" icon={Lightbulb} />
            <Card>
                <CardContent className="text-muted-foreground space-y-3 pt-4 text-sm leading-6">
                    <p>
                        <strong className="text-foreground">First-order:</strong> for a unit step,
                        the response reaches about 63.2% of its final value after one time constant
                        τ. A larger τ means a slower rise.
                    </p>
                    <p>
                        <strong className="text-foreground">Underdamped second-order:</strong>{' '}
                        overshoot is evidence of ζ &lt; 1. Its percentage is approximately{' '}
                        <span className="font-mono">Mp = 100 exp(−πζ / √(1 − ζ²))</span>. Greater
                        overshoot means lower damping; the spacing between oscillations helps
                        estimate ωn.
                    </p>
                    <p>
                        Noise can obscure the exact curve. Focus on the overall rise time, final
                        value, peak, and oscillation pattern rather than individual points.
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
