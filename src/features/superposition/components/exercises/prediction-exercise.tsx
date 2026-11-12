import { useState } from 'react';
import { CheckCircle2, CircleX, Lightbulb, Play, RotateCcw } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getComponentResponse,
    MAX_OMEGA,
    type SinusoidComponent,
    type SuperpositionConfiguration,
} from '@/features/superposition/domain/superposition';

type ScenarioAction =
    | { type: 'modify'; id: number; omega: number }
    | { type: 'add'; component: Omit<SinusoidComponent, 'id'> }
    | { type: 'remove'; id: number };

interface PredictionOption {
    value: string;
    label: string;
}

interface PredictionScenario {
    id: string;
    prompt: string;
    options: PredictionOption[];
    correctValue: string;
    explanation: string;
    action: ScenarioAction;
}

interface PredictionExerciseProps {
    configuration: SuperpositionConfiguration;
    onModify: (id: number, omega: number) => void;
    onAdd: (component: Omit<SinusoidComponent, 'id'>) => void;
    onRemove: (id: number) => void;
}

/**
 * Builds the three questions from the current experiment, so each prediction
 * refers to a real component and can be applied to the plots afterwards.
 */
function getScenarios(configuration: SuperpositionConfiguration): PredictionScenario[] {
    const { components, sensor } = configuration;
    const scenarios: PredictionScenario[] = [];
    const byFrequency = [...components].sort((a, b) => a.omega - b.omega);

    // Modify: double the frequency of the slowest component.
    const slowest = byFrequency[0];
    if (slowest && slowest.omega < MAX_OMEGA) {
        const targetOmega = Math.min(MAX_OMEGA, slowest.omega * 2);
        const before = getComponentResponse(slowest, sensor);
        const after = getComponentResponse({ ...slowest, omega: targetOmega }, sensor);

        scenarios.push({
            id: 'modify',
            prompt: `You change x${slowest.id} from ω = ${slowest.omega.toFixed(2)} to ${targetOmega.toFixed(2)} rad/s and keep its amplitude. What happens to its contribution to the steady-state sensor output?`,
            options: [
                { value: 'smaller-more-lag', label: 'Smaller amplitude, more phase lag' },
                { value: 'same', label: 'Nothing changes, only ω changed' },
                { value: 'larger-less-lag', label: 'Larger amplitude, less phase lag' },
                { value: 'smaller-less-lag', label: 'Smaller amplitude, less phase lag' },
            ],
            correctValue: 'smaller-more-lag',
            explanation: `M falls from ${before.magnitude.toFixed(4)} to ${after.magnitude.toFixed(4)} and φ moves from ${before.phaseLagDegrees.toFixed(2)}° to ${after.phaseLagDegrees.toFixed(2)}°. A faster input gives the sensor less time to follow, so it is attenuated more and lags more.`,
            action: { type: 'modify', id: slowest.id, omega: targetOmega },
        });
    }

    // Add: a unit-amplitude component well above the cutoff frequency.
    const addedOmega = Math.min(MAX_OMEGA, Number((10 / sensor.tau).toFixed(1)));
    const added = getComponentResponse(
        { id: 0, amplitude: 1, omega: addedOmega, phase: 0 },
        sensor,
    );
    const addedCorrect =
        added.magnitude > 0.85 ? 'full' : added.magnitude > 0.4 ? 'partial' : 'small';

    scenarios.push({
        id: 'add',
        prompt: `You add a new component with A = 1 and ω = ${addedOmega.toFixed(1)} rad/s (ωτ = ${added.omegaTau.toFixed(2)}). The combined input gains a ripple of amplitude 1. How large is that ripple in the steady-state output?`,
        options: [
            { value: 'full', label: 'About K · 1, it passes almost unchanged' },
            { value: 'partial', label: 'Noticeably reduced, roughly K · 0.5 to 0.85' },
            { value: 'small', label: 'Strongly attenuated, K · 0.4 or less' },
        ],
        correctValue: addedCorrect,
        explanation: `At ωτ = ${added.omegaTau.toFixed(2)}, M = ${added.magnitude.toFixed(4)}, so the output ripple is K · M = ${(sensor.gain * added.magnitude).toFixed(3)} with φ = ${added.phaseLagDegrees.toFixed(2)}°. Components above ωc = ${(1 / sensor.tau).toFixed(2)} rad/s are filtered out by the sensor.`,
        action: { type: 'add', component: { amplitude: 1, omega: addedOmega, phase: 0 } },
    });

    // Remove: the fastest component, while others remain.
    const fastest = byFrequency[byFrequency.length - 1];
    if (fastest && components.length >= 2) {
        const removed = getComponentResponse(fastest, sensor);

        scenarios.push({
            id: 'remove',
            prompt: `You remove x${fastest.id} (ω = ${fastest.omega.toFixed(2)} rad/s). What happens to the output amplitudes K·A·M of the components that remain?`,
            options: [
                { value: 'unchanged', label: 'They stay exactly the same' },
                { value: 'larger', label: 'They grow to fill the gap' },
                { value: 'smaller', label: 'They all shrink' },
            ],
            correctValue: 'unchanged',
            explanation: `The sensor is linear, so every component is attenuated independently. Removing x${fastest.id} only subtracts its own output term, ${removed.outputAmplitude.toFixed(3)} · sin(${fastest.omega.toFixed(2)}t + …), from y(t); the remaining rows in the frequency-effects table do not change.`,
            action: { type: 'remove', id: fastest.id },
        });
    }

    return scenarios;
}

export function PredictionExercise({
    configuration,
    onModify,
    onAdd,
    onRemove,
}: PredictionExerciseProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [checkedScenarios, setCheckedScenarios] = useState<PredictionScenario[] | null>(null);
    const [applied, setApplied] = useState<Record<string, boolean>>({});

    // Questions follow the live experiment until they are checked, then stay frozen.
    const scenarios = checkedScenarios ?? getScenarios(configuration);
    const submitted = checkedScenarios !== null;
    const allAnswered = scenarios.every((scenario) => answers[scenario.id] !== undefined);

    function selectAnswer(scenarioId: string, value: string) {
        setAnswers((current) => ({
            ...current,
            [scenarioId]: value,
        }));
    }

    function applyScenario(scenario: PredictionScenario) {
        const { action } = scenario;
        const exists = (id: number) =>
            configuration.components.some((component) => component.id === id);

        if (action.type === 'modify' && exists(action.id)) onModify(action.id, action.omega);
        if (action.type === 'add') onAdd(action.component);
        if (action.type === 'remove' && exists(action.id)) onRemove(action.id);

        setApplied((current) => ({ ...current, [scenario.id]: true }));
    }

    function resetPrediction() {
        setAnswers({});
        setCheckedScenarios(null);
        setApplied({});
    }

    return (
        <section id="prediction" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Predict, then check" icon={Lightbulb} />

            <p className="text-muted-foreground text-sm leading-6">
                These questions are built from your current components and sensor. Predict the
                effect of each change, check your answers, then apply the change and watch the plots
                above update.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Modify, add, and remove a component</CardTitle>

                    <CardDescription>
                        Predict how the combined signal and the sensor output respond before
                        checking the explanation.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {scenarios.map((scenario, scenarioIndex) => (
                        <fieldset key={scenario.id} disabled={submitted} className="space-y-2">
                            <legend className="mb-2 text-sm font-medium">
                                {scenarioIndex + 1}. {scenario.prompt}
                            </legend>

                            <div className="grid gap-2 sm:grid-cols-2">
                                {scenario.options.map((option) => {
                                    const isSelected = answers[scenario.id] === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => selectAnswer(scenario.id, option.value)}
                                            className={[
                                                'rounded-lg border p-3 text-left text-sm transition-colors',
                                                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                                                isSelected
                                                    ? 'border-primary bg-accent text-accent-foreground'
                                                    : 'border-border hover:bg-muted',
                                            ].join(' ')}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </fieldset>
                    ))}

                    {scenarios.length < 3 && !submitted && (
                        <p className="text-muted-foreground text-xs">
                            Add at least two components to unlock every question.
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        {!submitted ? (
                            <Button
                                type="button"
                                disabled={!allAnswered}
                                onClick={() => setCheckedScenarios(scenarios)}
                            >
                                Check predictions
                            </Button>
                        ) : (
                            <Button type="button" variant="outline" onClick={resetPrediction}>
                                <RotateCcw />
                                Retry with current experiment
                            </Button>
                        )}
                    </div>

                    {submitted && (
                        <div className="space-y-3" role="status">
                            {scenarios.map((scenario) => {
                                const isCorrect = answers[scenario.id] === scenario.correctValue;
                                const correctOption = scenario.options.find(
                                    (option) => option.value === scenario.correctValue,
                                );

                                return (
                                    <div
                                        key={scenario.id}
                                        className="border-border space-y-3 rounded-lg border p-3"
                                    >
                                        <p className="text-sm font-medium">{scenario.prompt}</p>

                                        <p className="text-muted-foreground flex items-start gap-2 text-xs leading-5">
                                            {isCorrect ? (
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-success mt-0.5 shrink-0"
                                                />
                                            ) : (
                                                <CircleX
                                                    size={16}
                                                    className="text-destructive mt-0.5 shrink-0"
                                                />
                                            )}

                                            <span>
                                                <strong className="text-foreground">
                                                    {isCorrect ? 'Correct.' : 'Review this one.'}
                                                </strong>{' '}
                                                {correctOption?.label}. {scenario.explanation}
                                            </span>
                                        </p>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            disabled={applied[scenario.id]}
                                            onClick={() => applyScenario(scenario)}
                                        >
                                            <Play />
                                            {applied[scenario.id]
                                                ? 'Applied to the experiment'
                                                : 'Apply this change'}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
