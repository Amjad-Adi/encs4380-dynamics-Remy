
import { useMemo, useState } from 'react';
import {
    Activity,
    ArrowDown,
    BookOpen,
    Gauge,
    RotateCcw,
    SlidersHorizontal,
    Waves,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
    Card,
    CardContent,
} from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';

import { Reveal } from '@/components/shared/reveal.tsx';
import { Equation } from '../equation.tsx';
import { ExperimentControls } from '../experiment-controls.tsx';
import { ResponseAnalysis } from '../response-analysis.tsx';
import { StepValidation } from '../step-validation.tsx';
import { RampAnalysis } from '../ramp-analysis.tsx';
import { ErrorFractionAnalysis } from '../error-fraction-analysis.tsx';
import { PredictionExercise } from '../prediction-exercise.tsx';

import {
    getRampLag,
    getRampSteadyStateError,
    getStepValidation,
    type FirstOrderInputType,
    type FirstOrderParameters,
} from '../../models/first-order-time.ts';

const DEFAULT_PARAMETERS: FirstOrderParameters = {
    gain: 1,
    tau: 1,
    amplitude: 1,
};

const formatValue = (value: number, digits = 2) =>
    Number.isFinite(value) ? value.toFixed(digits) : '—';

const sectionHeading =
    'flex items-center gap-2 text-sm font-semibold tracking-tight';

const sectionDivider = 'flex-1';

const interactiveSurface =
    'rounded-xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5';

export default function FirstOrderTimePage() {
    const [parameters, setParameters] =
        useState<FirstOrderParameters>(DEFAULT_PARAMETERS);

    const [inputType, setInputType] =
        useState<FirstOrderInputType>('step');

    const validation = useMemo(
        () => getStepValidation(parameters),
        [parameters],
    );

    const rampError = getRampSteadyStateError(parameters);
    const rampLag = getRampLag(parameters.tau);

    const expectedStepOutput =
        parameters.gain * parameters.amplitude;

    const inputEquation =
        inputType === 'step'
            ? String.raw`x(t)=A\,u(t)`
            : String.raw`x(t)=At\,u(t)`;

    function updateParameter(
        key: keyof FirstOrderParameters,
        value: number,
    ) {
        if (!Number.isFinite(value)) return;

        setParameters((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function resetParameters() {
        setParameters({ ...DEFAULT_PARAMETERS });
        setInputType('step');
    }

    function changeInputType(type: FirstOrderInputType) {
        setInputType(type);
    }

    return (
        <main    id="top"
                 className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10">

            {/* -------------------------------------------------- */}
            {/* Page header                                        */}
            {/* -------------------------------------------------- */}

            <Reveal>
                <header className="space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className="border-primary/30 bg-primary/5 px-3 py-1 font-mono text-primary"
                        >
                            MODULE 01
                        </Badge>

                        <Badge className="bg-accent text-accent-foreground">
                            First-order system
                        </Badge>

                        <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
                                <span className="relative inline-flex size-2 rounded-full bg-success" />
                            </span>
                            Live simulation
                        </span>
                    </div>

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="max-w-3xl space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <Activity size={16} />
                                Dynamic characteristics laboratory
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                First-order time response
                            </h1>

                            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                                Investigate how a first-order sensor responds
                                to sudden and continuously changing inputs.
                                Adjust its parameters and observe their effects
                                on response speed, steady-state behavior, and
                                tracking error.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetParameters}
                            className="group w-fit shrink-0 gap-2 transition-all duration-200 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
                        >
                            <RotateCcw
                                size={15}
                                className="transition-transform duration-500 group-hover:-rotate-180"
                            />
                            Reset experiment
                        </Button>
                    </div>
                </header>
            </Reveal>

            {/* -------------------------------------------------- */}
            {/* Section navigation                                 */}
            {/* -------------------------------------------------- */}

            <Reveal delay={75}>
                <nav
                    aria-label="Module sections"
                    className="sticky top-2 z-30 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-border/80 bg-background/90 p-1.5 shadow-sm backdrop-blur-xl sm:mx-0 sm:gap-2"
                >
                    <a
                        href="#model"
                        className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
                    >
                        <BookOpen size={14} />
                        Model
                    </a>

                    <a
                        href="#experiment"
                        className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
                    >
                        <SlidersHorizontal size={14} />
                        Experiment
                    </a>

                    <a
                        href="#analysis"
                        className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
                    >
                        <Activity size={14} />
                        Analysis
                    </a>

                    <a
                        href="#challenge"
                        className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
                    >
                        <Gauge size={14} />
                        Challenge
                    </a>
                </nav>
            </Reveal>

            {/* -------------------------------------------------- */}
            {/* Live experiment summary                            */}
            {/* -------------------------------------------------- */}

            <Reveal delay={100}>
                <section
                    aria-label="Current experiment parameters"
                    className="grid grid-cols-2 gap-3 lg:grid-cols-4"
                >
                    <div className={`${interactiveSurface} group p-4`}>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                System gain
                            </span>
                            <Gauge
                                size={16}
                                className="text-primary transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
                            {formatValue(parameters.gain)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Sensitivity (K)
                        </p>
                    </div>

                    <div className={`${interactiveSurface} group p-4`}>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Time constant
                            </span>
                            <Activity
                                size={16}
                                className="text-primary transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
                            {formatValue(parameters.tau)}
                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                                s
                            </span>
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Response speed (τ)
                        </p>
                    </div>

                    <div className={`${interactiveSurface} group p-4`}>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Input amplitude
                            </span>
                            <Waves
                                size={16}
                                className="text-primary transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
                            {formatValue(parameters.amplitude)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Input magnitude (A)
                        </p>
                    </div>

                    <div className={`${interactiveSurface} group p-4`}>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {inputType === 'step'
                                    ? 'Expected final output'
                                    : 'Ramp tracking lag'}
                            </span>
                            <Activity
                                size={16}
                                className="text-primary transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
                            {inputType === 'step'
                                ? formatValue(expectedStepOutput)
                                : `${formatValue(rampLag)} s`}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {inputType === 'step'
                                ? 'Steady-state output (KA)'
                                : 'Time delay (τ)'}
                        </p>
                    </div>
                </section>
            </Reveal>

            {/* -------------------------------------------------- */}
            {/* Mathematical model                                 */}
            {/* -------------------------------------------------- */}

            <Reveal>
                <section id="model" className="scroll-mt-24 space-y-3">
                    <div className={sectionHeading}>
                        <BookOpen size={16} className="text-primary" />
                        <h2>Mathematical model</h2>
                        <Separator className={sectionDivider} />
                    </div>

                    <Card className="group overflow-hidden border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                        <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:p-6">
                            <div className="min-w-0 space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Governing differential equation
                                </p>

                                <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                                    <Equation
                                        expression={String.raw`\tau \frac{dy(t)}{dt}+y(t)=Kx(t)`}
                                    />
                                </div>
                            </div>

                            <Separator
                                orientation="vertical"
                                className="hidden h-16 md:block"
                            />

                            <div className="min-w-0 space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Transfer function
                                </p>

                                <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                                    <Equation
                                        expression={String.raw`G(s)=\frac{Y(s)}{X(s)}=\frac{K}{\tau s+1}`}
                                    />
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Assumes zero initial conditions.
                                </p>
                            </div>

                            <Separator
                                orientation="vertical"
                                className="hidden h-16 md:block"
                            />

                            <div className="min-w-0 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Applied input
                                    </p>

                                    <Badge
                                        variant="outline"
                                        className="text-[10px]"
                                    >
                                        {inputType.toUpperCase()}
                                    </Badge>
                                </div>

                                <div
                                    key={inputType}
                                    className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
                                >
                                    <Equation expression={inputEquation} />
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    A = input amplitude
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </Reveal>

            {/* -------------------------------------------------- */}
            {/* Experiment workspace                               */}
            {/* -------------------------------------------------- */}

            <Reveal>
                <section
                    id="experiment"
                    className="scroll-mt-24 space-y-3"
                >
                    <div className={sectionHeading}>
                        <SlidersHorizontal size={16} className="text-primary" />
                        <h2>Interactive experiment</h2>
                        <Separator className={sectionDivider} />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Modify the system parameters and input type. The
                        response visualization and calculated results update
                        as you make changes.
                    </p>

                    <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <div className="min-w-0 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                            <ExperimentControls
                                parameters={parameters}
                                inputType={inputType}
                                onParameterChange={updateParameter}
                                onInputTypeChange={changeInputType}
                                onReset={resetParameters}
                            />
                        </div>

                        <div className="min-w-0">
                            <ResponseAnalysis
                                parameters={parameters}
                                inputType={inputType}
                                rampError={rampError}
                                rampLag={rampLag}
                            />
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* -------------------------------------------------- */}
            {/* Analytical results                                 */}
            {/* -------------------------------------------------- */}

            <Reveal>
                <section
                    id="analysis"
                    className="scroll-mt-24 space-y-5"
                >
                    <div className={sectionHeading}>
                        <Activity size={16} className="text-primary" />
                        <h2>
                            {inputType === 'step'
                                ? 'Step response analysis'
                                : 'Ramp response analysis'}
                        </h2>
                        <Separator className={sectionDivider} />
                    </div>

                    <div
                        key={inputType}
                        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500"
                    >
                        {inputType === 'step' ? (
                            <div className="space-y-5">
                                <StepValidation results={validation} />

                                <ErrorFractionAnalysis
                                    tau={parameters.tau}
                                />
                            </div>
                        ) : (
                            <RampAnalysis
                                rampError={rampError}
                                rampLag={rampLag}
                            />
                        )}
                    </div>
                </section>
            </Reveal>

            {/* -------------------------------------------------- */}
            {/* Learning challenge                                 */}
            {/* -------------------------------------------------- */}

            <Reveal>
                <section
                    id="challenge"
                    className="scroll-mt-24 space-y-3"
                >
                    <div className={sectionHeading}>
                        <Gauge size={16} className="text-primary" />
                        <h2>Test your understanding</h2>
                        <Separator className={sectionDivider} />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Predict the system behavior before revealing the
                        result. Use the concepts from the experiment to
                        evaluate your understanding.
                    </p>

                    <PredictionExercise />
                </section>
            </Reveal>

            {/* -------------------------------------------------- */}
            {/* Model assumptions                                   */}
            {/* -------------------------------------------------- */}

            <Reveal>
                <footer className="border-t pt-5">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-muted p-2">
                            <BookOpen
                                size={15}
                                className="text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-foreground">
                                Model assumptions and limitations
                            </p>

                            <p className="max-w-3xl text-xs leading-6 text-muted-foreground">
                                Zero initial output, ideal first-order
                                dynamics, and no measurement noise or
                                saturation. The transfer function is defined
                                under zero initial conditions.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                        <span>Dynamic Characteristics Toolkit</span>
                        <a
                            href="#top"
                            onClick={(event) => {
                                event.preventDefault();
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                });
                            }}
                            className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                        >
                            Back to top
                            <ArrowDown
                                size={12}
                                className="rotate-180"
                            />
                        </a>
                    </div>
                </footer>
            </Reveal>
        </main>
    );
}
