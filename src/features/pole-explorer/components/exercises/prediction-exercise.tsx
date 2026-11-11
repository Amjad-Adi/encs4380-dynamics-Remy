import { useState } from 'react';
import { CheckCircle2, CircleX, Lightbulb, RotateCcw } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PredictionOption {
    value: string;
    label: string;
}

interface PredictionQuestion {
    id: string;
    prompt: string;
    options: PredictionOption[];
    correctValue: string;
    explanation: string;
}

const QUESTIONS: PredictionQuestion[] = [
    {
        id: 'distance',
        prompt: 'You move a stable pole farther to the left, away from the imaginary axis. What happens to the step response?',
        options: [
            {
                value: 'faster',
                label: 'It settles faster',
            },
            {
                value: 'slower',
                label: 'It settles more slowly',
            },
            {
                value: 'forever',
                label: 'It oscillates forever',
            },
            {
                value: 'unstable',
                label: 'It becomes unstable',
            },
        ],
        correctValue: 'faster',
        explanation:
            'A larger negative real part means a faster decaying exponential. The time constant 1/|σ| shrinks, so the response reaches its final value sooner.',
    },
    {
        id: 'rhp',
        prompt: 'A pole crosses the imaginary axis into the right half-plane. What happens to the step response?',
        options: [
            {
                value: 'bounded',
                label: 'It stays bounded',
            },
            {
                value: 'grows',
                label: 'It grows without bound',
            },
            {
                value: 'constant',
                label: 'It remains constant',
            },
            {
                value: 'zero',
                label: 'It becomes exactly zero',
            },
        ],
        correctValue: 'grows',
        explanation:
            'A right-half-plane pole has a positive real part, so the response contains a growing exponential term. The system is unstable.',
    },
    {
        id: 'imaginary',
        prompt: 'You move a complex pole pair farther from the real axis (larger ωd) while keeping the real part fixed. What changes?',
        options: [
            {
                value: 'frequency',
                label: 'The oscillation frequency increases',
            },
            {
                value: 'stop',
                label: 'The response stops oscillating',
            },
            {
                value: 'zero-settling',
                label: 'The settling time becomes zero',
            },
            {
                value: 'real',
                label: 'The poles become real',
            },
        ],
        correctValue: 'frequency',
        explanation:
            'The imaginary part is the damped oscillation frequency ωd. Moving the poles away from the real axis increases ωd, so the response oscillates faster.',
    },
];

export function PredictionExercise() {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const allAnswered = QUESTIONS.every((question) => answers[question.id] !== undefined);

    function selectAnswer(questionId: string, value: string) {
        setAnswers((current) => ({
            ...current,
            [questionId]: value,
        }));
    }

    function resetPrediction() {
        setAnswers({});
        setSubmitted(false);
    }

    return (
        <section id="prediction" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Predict, then check" icon={Lightbulb} />

            <p className="text-muted-foreground text-sm leading-6">
                Use the s-plane to reason about how pole movement changes stability, damping, and
                speed. Answer all three questions, then check your reasoning.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Moving poles in the s-plane</CardTitle>

                    <CardDescription>
                        Predict the effect of each change before checking the explanation.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {QUESTIONS.map((question, questionIndex) => (
                        <fieldset key={question.id} disabled={submitted} className="space-y-2">
                            <legend className="mb-2 text-sm font-medium">
                                {questionIndex + 1}. {question.prompt}
                            </legend>

                            <div className="grid gap-2 sm:grid-cols-2">
                                {question.options.map((option) => {
                                    const isSelected = answers[question.id] === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => selectAnswer(question.id, option.value)}
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

                    <div className="flex flex-wrap items-center gap-3">
                        {!submitted ? (
                            <Button
                                type="button"
                                disabled={!allAnswered}
                                onClick={() => setSubmitted(true)}
                            >
                                Check predictions
                            </Button>
                        ) : (
                            <Button type="button" variant="outline" onClick={resetPrediction}>
                                <RotateCcw />
                                Retry predictions
                            </Button>
                        )}
                    </div>

                    {submitted && (
                        <div className="space-y-3" role="status">
                            {QUESTIONS.map((question) => {
                                const answer = answers[question.id];
                                const isCorrect = answer === question.correctValue;
                                const correctOption = question.options.find(
                                    (option) => option.value === question.correctValue,
                                );

                                return (
                                    <div
                                        key={question.id}
                                        className="border-border rounded-lg border p-3"
                                    >
                                        <p className="text-sm font-medium">{question.prompt}</p>

                                        <p className="text-muted-foreground mt-2 flex items-start gap-2 text-xs leading-5">
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
                                                {correctOption?.label}. {question.explanation}
                                            </span>
                                        </p>
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
