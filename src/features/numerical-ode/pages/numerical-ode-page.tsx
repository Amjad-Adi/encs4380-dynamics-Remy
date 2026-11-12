import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Calculator, CheckCircle2 } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { SharedChallengeSection } from '@/components/modules/sections/challenge-section';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { NumericalOdeComparisonChart } from '@/features/numerical-ode/components/charts/numerical-ode-comparison-chart';
import { ErrorMetricsComparison } from '@/features/numerical-ode/components/analysis/error-metrics-comparison';
import {
    NumericalOdeControls,
    type NumericalMethod,
} from '@/features/numerical-ode/components/controls/numerical-ode-controls';
import { AccuracyPredictionExercise } from '@/features/numerical-ode/components/exercises/accuracy-prediction-exercise';
import { NUMERICAL_ODE_SECTIONS } from '@/features/numerical-ode/components/page/numerical-ode-sections';
import {
    generateNumericalOdeComparison,
    type NumericalOdeParameters,
} from '@/features/numerical-ode/domain/numerical-ode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DEFAULT_PARAMETERS: NumericalOdeParameters = {
    gain: 1,
    timeConstant: 1,
    amplitude: 1,
    stepSize: 0.2,
    duration: 5,
};

export default function NumericalOdePage() {
    const [parameters, setParameters] = useState({ ...DEFAULT_PARAMETERS });
    const [method, setMethod] = useState<NumericalMethod>('euler');
    const [predictionResetKey, setPredictionResetKey] = useState(0);

    const comparison = useMemo(
        () => generateNumericalOdeComparison(parameters),
        [parameters],
    );

    function updateParameter(key: keyof NumericalOdeParameters, value: number) {
        if (!Number.isFinite(value)) return;
        setParameters((current) => ({ ...current, [key]: value }));
    }

    function resetExperiment() {
        setParameters({ ...DEFAULT_PARAMETERS });
        setMethod('euler');
        setPredictionResetKey((current) => current + 1);
    }

    const stability = comparison.eulerStability;
    const isEulerStable = stability.kind === 'stable';

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <header className="space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className="border-primary/30 bg-primary/5 px-3 py-1 font-mono text-primary"
                        >
                            BONUS TOOL
                        </Badge>
                        <Badge className="bg-accent text-accent-foreground">
                            Numerical methods
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
                                Bonus – Numerical ODE Solver
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                                Compare Euler’s method and fourth-order Runge–Kutta
                                with the analytical step response of a first-order
                                system. Adjust the parameters and observe the
                                numerical solutions update in real time.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetExperiment}
                        >
                            <Calculator size={15} />
                            Reset experiment
                        </Button>
                    </div>
                </header>
            </Reveal>

            <Reveal>
                <SectionNavigation sections={NUMERICAL_ODE_SECTIONS} />
            </Reveal>

            <Reveal>
                <section id="experiment" className="scroll-mt-24 space-y-3">
                    <SectionHeading
                        title="Interactive experiment"
                        icon={Calculator}
                    />
                    <p className="text-sm leading-6 text-muted-foreground">
                        Choose a solver and tune the system and integration settings.
                        Both numerical solutions remain visible in the comparison.
                    </p>
                    <NumericalOdeControls
                        parameters={parameters}
                        method={method}
                        onParameterChange={updateParameter}
                        onMethodChange={setMethod}
                        onReset={resetExperiment}
                    />
                </section>
            </Reveal>

            <Reveal>
                <section id="comparison" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Solution comparison" icon={Activity} />
                    <Card className="min-w-0 overflow-hidden">
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base">
                                        Numerical and analytical response
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        The selected method is emphasized; all three
                                        solutions are shown at shared time points.
                                    </CardDescription>
                                </div>
                                <Badge variant="outline">
                                    {method === 'euler' ? "Euler's method selected" : 'RK4 selected'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="min-w-0">
                            <NumericalOdeComparisonChart
                                points={comparison.points}
                                selectedMethod={method}
                            />
                        </CardContent>
                    </Card>

                    <Card
                        className={
                            isEulerStable
                                ? 'border-success/30 bg-success/5'
                                : 'border-warning/40 bg-warning/5'
                        }
                    >
                        <CardContent className="flex items-start gap-3 pt-5">
                            {isEulerStable ? (
                                <CheckCircle2
                                    size={19}
                                    className="mt-0.5 shrink-0 text-success"
                                />
                            ) : (
                                <AlertTriangle
                                    size={19}
                                    className="mt-0.5 shrink-0 text-warning"
                                />
                            )}
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">
                                    Euler: {stability.kind.replaceAll('-', ' ')}
                                    {' · '}Δt/τ = {stability.stepRatio.toFixed(3)}
                                </p>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {stability.explanation}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </Reveal>

            <Reveal>
                <section id="errors" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Error metrics" icon={Activity} />
                    <ErrorMetricsComparison
                        euler={comparison.eulerError}
                        rk4={comparison.rk4Error}
                    />
                </section>
            </Reveal>

            <Reveal>
                <SharedChallengeSection description="Use the current simulation settings to predict which numerical method will have the lower overall error before revealing the measured comparison.">
                    <AccuracyPredictionExercise
                        key={[
                            predictionResetKey,
                            parameters.gain,
                            parameters.timeConstant,
                            parameters.amplitude,
                            parameters.stepSize,
                            parameters.duration,
                        ].join(':')}
                        parameters={parameters}
                        eulerError={comparison.eulerError}
                        rk4Error={comparison.rk4Error}
                    />
                </SharedChallengeSection>
            </Reveal>
        </main>
    );
}
