import { useEffect, useState } from 'react';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    CircleX,
} from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';

import type { FirstOrderInputType } from '@/features/first-order-time/domain/first-order-time.ts';

interface PredictionOption {
    value: string;
    label: string;
}

interface PredictionQuestion {
    id: string;
    prompt: string;
    options: PredictionOption[];
    correct: string;
    explanation: string;
}

const STEP_QUESTIONS: PredictionQuestion[] = [
    {
        id: 'fraction-at-tau',
        prompt:
            'At t = τ, what percentage of the final output KA has the step response reached?',
        options: [
            { value: '36.8', label: '36.8%' },
            { value: '63.2', label: '63.2%' },
            { value: '86.5', label: '86.5%' },
            { value: '95.0', label: '95.0%' },
        ],
        correct: '63.2',
        explanation:
            'One time constant corresponds to 1 − e⁻¹ = 63.2% of the final value for a first-order step response.',
    },
    {
        id: 'fraction-at-three-tau',
        prompt:
            'At t = 3τ, what percentage of KA has the step response reached?',
        options: [
            { value: '86.5', label: '86.5%' },
            { value: '95.0', label: '95.0%' },
            { value: '98.2', label: '98.2%' },
            { value: '99.3', label: '99.3%' },
        ],
        correct: '95.0',
        explanation:
            'After three time constants the output reaches 1 − e⁻³ = 95.0% of KA; only about 5% of the final value remains as error.',
    },
    {
        id: 'tau-increase',
        prompt:
            'If τ increases while K and A stay fixed, how does the step response change?',
        options: [
            { value: 'slower', label: 'The response becomes slower' },
            { value: 'faster', label: 'The response becomes faster' },
            { value: 'same', label: 'The response is unchanged' },
        ],
        correct: 'slower',
        explanation:
            'τ sets the response speed. A larger τ takes longer to reach the same fraction of KA, while the final value KA is unchanged.',
    },
];

const RAMP_QUESTIONS: PredictionQuestion[] = [
    {
        id: 'ramp-error-tau',
        prompt:
            'If τ increases while K and the ramp slope A stay fixed, what happens to the steady-state tracking error KAτ?',
        options: [
            { value: 'increases', label: 'It increases' },
            { value: 'decreases', label: 'It decreases' },
            { value: 'same', label: 'It stays the same' },
        ],
        correct: 'increases',
        explanation:
            'The steady-state tracking error is KAτ, so it grows in direct proportion to the time constant.',
    },
    {
        id: 'ramp-lag-gain',
        prompt:
            'Does the equivalent time lag of a first-order ramp response depend on the system gain K?',
        options: [
            {
                value: 'yes',
                label: 'Yes — a larger K increases the lag',
            },
            {
                value: 'no',
                label: 'No — the lag equals τ for any K',
            },
            {
                value: 'only',
                label: 'Only when K is greater than 1',
            },
        ],
        correct: 'no',
        explanation:
            'In steady state y(t) ≈ KA(t − τ), so the output lags the ideal ramp by exactly τ. The gain scales the amplitude and the tracking error, not the lag.',
    },
];

const QUESTION_SETS: Record<FirstOrderInputType, PredictionQuestion[]> = {
    step: STEP_QUESTIONS,
    ramp: RAMP_QUESTIONS,
};

interface PredictionExerciseProps {
    inputType: FirstOrderInputType;
}

export function PredictionExercise({
                                       inputType,
                                   }: PredictionExerciseProps) {
    const questions = QUESTION_SETS[inputType];

    const [questionIndex, setQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setQuestionIndex(0);
        setAnswer(null);
        setChecked(false);
    }, [inputType]);

    const activeIndex = Math.min(
        questionIndex,
        questions.length - 1,
    );
    const question = questions[activeIndex];
    const isCorrect = answer === question.correct;
    const isLastQuestion = activeIndex === questions.length - 1;

    function checkPrediction() {
        if (answer === null) return;
        setChecked(true);
    }

    function advance() {
        setQuestionIndex(
            isLastQuestion ? 0 : activeIndex + 1,
        );
        setAnswer(null);
        setChecked(false);
    }

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
                        {inputType === 'step'
                            ? 'Predict how a first-order sensor responds to a step input before revealing each answer.'
                            : 'Predict how a first-order sensor tracks a ramp input before revealing each answer.'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>
                            Question {activeIndex + 1} of {questions.length}
                        </span>

                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                            {inputType === 'step' ? 'Step input' : 'Ramp input'}
                        </span>
                    </div>

                    <p className="text-sm font-medium">{question.prompt}</p>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {question.options.map((option) => {
                            const isSelected = answer === option.value;
                            const isCorrectOption =
                                checked && option.value === question.correct;
                            const isWrongSelection =
                                checked && isSelected && !isCorrect;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    disabled={checked}
                                    aria-pressed={isSelected}
                                    onClick={() => {
                                        setAnswer(option.value);
                                        setChecked(false);
                                    }}
                                    className={[
                                        'rounded-lg border p-3 text-left text-sm transition-colors',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                        'disabled:cursor-default',
                                        isCorrectOption
                                            ? 'border-success bg-success/5 text-success'
                                            : isWrongSelection
                                                ? 'border-destructive bg-destructive/5 text-destructive'
                                                : isSelected
                                                    ? 'border-brand bg-accent text-accent-foreground'
                                                    : 'border-border hover:bg-muted',
                                    ].join(' ')}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {checked ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={advance}
                            >
                                {isLastQuestion ? 'Start over' : 'Next question'}

                                {!isLastQuestion && <ArrowRight />}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                disabled={answer === null}
                                onClick={checkPrediction}
                            >
                                Check prediction
                            </Button>
                        )}

                        {checked && (
                            <div
                                className="flex items-start gap-2 text-sm"
                                role="status"
                            >
                                {isCorrect ? (
                                    <CheckCircle2
                                        size={17}
                                        className="mt-0.5 shrink-0 text-success"
                                    />
                                ) : (
                                    <CircleX
                                        size={17}
                                        className="mt-0.5 shrink-0 text-destructive"
                                    />
                                )}

                                <div className="min-w-0 space-y-1">
                                    <p
                                        className={
                                            isCorrect
                                                ? 'text-success'
                                                : 'text-destructive'
                                        }
                                    >
                                        {isCorrect ? 'Correct.' : 'Not quite.'}
                                    </p>

                                    <p className="text-muted-foreground">
                                        {question.explanation}
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
