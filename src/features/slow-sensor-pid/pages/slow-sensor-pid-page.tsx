import { useMemo, useState } from 'react';
import {
    Activity,
    Settings2,
    BarChart3,
    BookOpen,
} from 'lucide-react';

import { ModuleHeader } from '@/components/modules/module-header.tsx';
import { ModuleFooter } from '@/components/modules/module-footer.tsx';
import { SectionNavigation } from '@/components/modules/section-navigation.tsx';
import { Reveal } from '@/components/ui/reveal';
import { useIsMobile } from '@/hooks/use-is-mobile.ts';

import {
    simulateSlowSensorPID,
    type SlowSensorPIDParameters,
} from '../domain/slow-sensor-pid.ts';

import { SensorFeedbackChart } from '../components/charts/sensor-feedback-chart.tsx';
import { PredictionExercise } from '../components/exercises/prediction-exercise.tsx';
import { SLOW_SENSOR_PID_SECTIONS } from '../components/page/slow-sensor-pid-sections.ts';

const DEFAULT_PARAMETERS: SlowSensorPIDParameters = {
    plantType: 'first-order',
    firstOrder: {
        gain: 1,
        tau: 1,
    },
    secondOrder: {
        m: 1,
        b: 2,
        k: 4,
    },

    gains: {
        kp: 9,
        ki: 0,
        kd: 0,
    },
    setpoint: 1,
    outputMin: 0,
    outputMax: 100,
    sensorTau: 0.2,
};

type NumericInputKey =
    | 'sensorTau'
    | 'setpoint'
    | 'outputMin'
    | 'outputMax'
    | 'kp'
    | 'ki'
    | 'kd';

type NumericInputValues = Record<NumericInputKey, string>;
type NumericInputErrors = Partial<Record<NumericInputKey, string>>;

const DEFAULT_INPUT_VALUES: NumericInputValues = {
    sensorTau: String(DEFAULT_PARAMETERS.sensorTau),
    setpoint: String(DEFAULT_PARAMETERS.setpoint),
    outputMin: String(DEFAULT_PARAMETERS.outputMin),
    outputMax: String(DEFAULT_PARAMETERS.outputMax),
    kp: String(DEFAULT_PARAMETERS.gains.kp),
    ki: String(DEFAULT_PARAMETERS.gains.ki),
    kd: String(DEFAULT_PARAMETERS.gains.kd),
};

export default function SlowSensorPIDPage() {
    const isMobile = useIsMobile();

    const [parameters, setParameters] =
        useState<SlowSensorPIDParameters>({
            ...DEFAULT_PARAMETERS,
            gains: { ...DEFAULT_PARAMETERS.gains },
        });
    const [inputValues, setInputValues] =
        useState<NumericInputValues>(DEFAULT_INPUT_VALUES);
    const [inputErrors, setInputErrors] = useState<NumericInputErrors>({});

    const points = useMemo(
        () => simulateSlowSensorPID(parameters, 10, 6001),
        [parameters],
    );

    const metrics = useMemo(() => {
        const maxTrueOutput = Math.max(
            ...points.map((point) => point.trueOutput),
        );

        const maxMeasuredOutput = Math.max(
            ...points.map((point) => point.measuredOutput),
        );

        const overshoot =
            parameters.setpoint > 0
                ? Math.max(
                    0,
                    ((maxTrueOutput - parameters.setpoint) /
                        Math.abs(parameters.setpoint)) *
                    100,
                )
                : parameters.setpoint < 0
                    ? Math.max(
                        0,
                        ((parameters.setpoint -
                            Math.min(
                                ...points.map((point) => point.trueOutput),
                            )) /
                            Math.abs(parameters.setpoint)) *
                        100,
                    )
                    : 0;

        const finalPoint = points[points.length - 1];

        return {
            maxTrueOutput,
            maxMeasuredOutput,
            overshoot,
            finalTrueOutput: finalPoint?.trueOutput ?? 0,
            finalMeasuredOutput: finalPoint?.measuredOutput ?? 0,
        };
    }, [points, parameters.setpoint]);

    function updateNumericInput(key: NumericInputKey, value: string) {
        const nextValues = {
            ...inputValues,
            [key]: value,
        };
        const nextErrors: NumericInputErrors = {};
        const numericValues = {} as Record<NumericInputKey, number>;

        for (const inputKey of Object.keys(nextValues) as NumericInputKey[]) {
            const numericValue = Number(nextValues[inputKey]);
            const isFiniteValue =
                nextValues[inputKey].trim() !== '' &&
                Number.isFinite(numericValue);

            if (!isFiniteValue) {
                nextErrors[inputKey] =
                    inputKey === 'sensorTau'
                        ? 'Enter a positive sensor time constant.'
                        : inputKey === 'kp' ||
                            inputKey === 'ki' ||
                            inputKey === 'kd'
                            ? 'Enter a nonnegative gain.'
                            : 'Enter a valid number.';
                continue;
            }

            numericValues[inputKey] = numericValue;

            if (inputKey === 'sensorTau' && numericValue <= 0) {
                nextErrors[inputKey] =
                    'Enter a positive sensor time constant.';
            } else if (
                (inputKey === 'kp' ||
                    inputKey === 'ki' ||
                    inputKey === 'kd') &&
                numericValue < 0
            ) {
                nextErrors[inputKey] = 'Enter a nonnegative gain.';
            }
        }

        const hasValidOutputLimits =
            nextErrors.outputMin === undefined &&
            nextErrors.outputMax === undefined &&
            numericValues.outputMin < numericValues.outputMax;

        if (
            numericValues.outputMin !== undefined &&
            numericValues.outputMax !== undefined &&
            !hasValidOutputLimits
        ) {
            const message = 'Minimum must be less than maximum.';
            nextErrors.outputMin = message;
            nextErrors.outputMax = message;
        }

        setInputValues(nextValues);
        setInputErrors(nextErrors);

        const numericValue = numericValues[key];
        const isValid =
            numericValue !== undefined &&
            nextErrors[key] === undefined &&
            (key !== 'outputMin' &&
                key !== 'outputMax'
                ? true
                : hasValidOutputLimits);

        if (!isValid) return;

        setParameters((current) =>
            key === 'kp' || key === 'ki' || key === 'kd'
                ? {
                    ...current,
                    gains: {
                        ...current.gains,
                        [key]: numericValue,
                    },
                }
                : {
                    ...current,
                    [key]: numericValue,
                },
        );
    }

    function resetExperiment() {
        setParameters({
            ...DEFAULT_PARAMETERS,
            gains: { ...DEFAULT_PARAMETERS.gains },
        });
        setInputValues(DEFAULT_INPUT_VALUES);
        setInputErrors({});
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="P2"
                    systemType="PID control with sensor dynamics"
                    title="Slow sensor in the feedback loop"
                    description="Investigate how sensor lag affects closed-loop PID performance. Compare the true plant output with the delayed sensor measurement and observe how feedback delay can increase overshoot and cause oscillations."
                    onReset={resetExperiment}
                />
            </Reveal>

            {!isMobile && (
                <Reveal>
                    <SectionNavigation sections={SLOW_SENSOR_PID_SECTIONS} />
                </Reveal>
            )}

            {/* Model overview */}
            <Reveal>
                <section
                    id="model"
                    className="scroll-mt-24 space-y-5"
                >
                    <div className="flex items-center gap-2">
                        <Activity className="text-primary" size={20} />
                        <h2 className="text-2xl font-bold">
                            Sensor feedback model
                        </h2>
                    </div>

                    <div className="bg-card border-border grid gap-5 rounded-xl border p-5 md:grid-cols-2">
                        <div className="space-y-3">
                            <h3 className="font-semibold">
                                First-order sensor
                            </h3>

                            <p className="text-muted-foreground text-sm leading-7">
                                The sensor does not measure the plant output
                                instantly. Its measured output follows the
                                actual output with a time delay.
                            </p>

                            <div className="bg-muted rounded-lg p-4 text-center font-mono text-sm">
                                Hs(s) = 1 / (τs s + 1)
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold">
                                Feedback error
                            </h3>

                            <p className="text-muted-foreground text-sm leading-7">
                                The PID controller receives the measured
                                sensor output instead of the true plant
                                output.
                            </p>

                            <div className="bg-muted rounded-lg p-4 text-center font-mono text-sm">
                                e(t) = r(t) - ym(t)
                            </div>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-7">
                        Increasing the sensor time constant τs makes the
                        measured signal respond more slowly. The controller
                        may therefore continue correcting the system even
                        after the true output has already reached or exceeded
                        the setpoint.
                    </p>
                </section>
            </Reveal>

            {/* Experiment */}
            <Reveal>
                <section
                    id="experiment"
                    className="scroll-mt-24 space-y-6"
                >
                    <div className="flex items-center gap-2">
                        <Settings2 className="text-primary" size={20} />
                        <h2 className="text-2xl font-bold">
                            Interactive experiment
                        </h2>
                    </div>

                    <div className="bg-card border-border rounded-xl border p-5 space-y-6">
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <label className="space-y-2">
                                <span className="text-sm font-medium">
                                    Plant type
                                </span>

                                <select
                                    value={parameters.plantType}
                                    onChange={(event) =>
                                        setParameters((current) => ({
                                            ...current,
                                            plantType: event.target.value as
                                                | 'first-order'
                                                | 'second-order',
                                        }))
                                    }
                                    className="bg-background border-border w-full rounded-lg border p-2.5 text-sm"
                                >
                                    <option value="first-order">
                                        First-order
                                    </option>
                                    <option value="second-order">
                                        Second-order
                                    </option>
                                </select>
                            </label>

                            <label className="space-y-2">
                                <span className="text-sm font-medium">
                                    Sensor time constant τs (s)
                                </span>

                                <input
                                    type="number"
                                    min="0.01"
                                    max="5"
                                    step="0.05"
                                    value={inputValues.sensorTau}
                                    aria-invalid={Boolean(inputErrors.sensorTau)}
                                    onChange={(event) =>
                                        updateNumericInput(
                                            'sensorTau',
                                            event.target.value,
                                        )
                                    }
                                    className="bg-background border-border w-full rounded-lg border p-2.5 text-sm"
                                />
                                {inputErrors.sensorTau && (
                                    <span className="text-destructive text-xs">
                                        {inputErrors.sensorTau}
                                    </span>
                                )}
                            </label>

                            <label className="space-y-2">
                                <span className="text-sm font-medium">
                                    Setpoint
                                </span>

                                <input
                                    type="number"
                                    step="0.1"
                                    value={inputValues.setpoint}
                                    aria-invalid={Boolean(inputErrors.setpoint)}
                                    onChange={(event) =>
                                        updateNumericInput(
                                            'setpoint',
                                            event.target.value,
                                        )
                                    }
                                    className="bg-background border-border w-full rounded-lg border p-2.5 text-sm"
                                />
                                {inputErrors.setpoint && (
                                    <span className="text-destructive text-xs">
                                        {inputErrors.setpoint}
                                    </span>
                                )}
                            </label>

                            <label className="space-y-2">
                                <span className="text-sm font-medium">
                                    Minimum controller output
                                </span>

                                <input
                                    type="number"
                                    value={inputValues.outputMin}
                                    aria-invalid={Boolean(inputErrors.outputMin)}
                                    onChange={(event) =>
                                        updateNumericInput(
                                            'outputMin',
                                            event.target.value,
                                        )
                                    }
                                    className="bg-background border-border w-full rounded-lg border p-2.5 text-sm"
                                />
                                {inputErrors.outputMin && (
                                    <span className="text-destructive text-xs">
                                        {inputErrors.outputMin}
                                    </span>
                                )}
                            </label>

                            <label className="space-y-2">
                                <span className="text-sm font-medium">
                                    Maximum controller output
                                </span>

                                <input
                                    type="number"
                                    value={inputValues.outputMax}
                                    aria-invalid={Boolean(inputErrors.outputMax)}
                                    onChange={(event) =>
                                        updateNumericInput(
                                            'outputMax',
                                            event.target.value,
                                        )
                                    }
                                    className="bg-background border-border w-full rounded-lg border p-2.5 text-sm"
                                />
                                {inputErrors.outputMax && (
                                    <span className="text-destructive text-xs">
                                        {inputErrors.outputMax}
                                    </span>
                                )}
                            </label>
                        </div>

                        <p className="text-muted-foreground text-sm">
                            These limits apply to the controller signal sent
                            to the plant, not directly to the plant output.
                        </p>

                        <div className="border-border border-t pt-5 space-y-4">
                            <h3 className="font-semibold">
                                PID controller gains
                            </h3>

                            <div className="grid gap-5 sm:grid-cols-3">
                                {(['kp', 'ki', 'kd'] as const).map(
                                    (gain) => (
                                        <label
                                            key={gain}
                                            className="space-y-2"
                                        >
                                            <span className="text-sm font-medium">
                                                {gain.toUpperCase()}
                                            </span>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={inputValues[gain]}
                                                aria-invalid={Boolean(inputErrors[gain])}
                                                onChange={(event) =>
                                                    updateNumericInput(
                                                        gain,
                                                        event.target.value,
                                                    )
                                                }
                                                className="bg-background border-border w-full rounded-lg border p-2.5 text-sm"
                                            />
                                            {inputErrors[gain] && (
                                                <span className="text-destructive text-xs">
                                                    {inputErrors[gain]}
                                                </span>
                                            )}
                                        </label>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border-border rounded-xl border p-4 sm:p-6 space-y-4">
                        <div>
                            <h3 className="font-semibold">
                                Closed-loop response
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Compare the setpoint, true plant output,
                                and sensor measurement.
                            </p>
                        </div>

                        <SensorFeedbackChart points={points} />
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section
                    id="prediction"
                    className="scroll-mt-24 space-y-5"
                >
                    <PredictionExercise parameters={parameters} />
                </section>
            </Reveal>

            {/* Analysis */}
            <Reveal>
                <section
                    id="analysis"
                    className="scroll-mt-24 space-y-5"
                >
                    <div className="flex items-center gap-2">
                        <BarChart3 className="text-primary" size={20} />
                        <h2 className="text-2xl font-bold">
                            Performance analysis
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            label="Maximum true output"
                            value={metrics.maxTrueOutput}
                        />

                        <MetricCard
                            label="Maximum measured output"
                            value={metrics.maxMeasuredOutput}
                        />

                        <MetricCard
                            label="True output overshoot (direction-aware)"
                            value={metrics.overshoot}
                            suffix="%"
                        />

                        <MetricCard
                            label="Final true/measured output difference"
                            value={Math.abs(
                                metrics.finalTrueOutput -
                                metrics.finalMeasuredOutput,
                            )}
                        />
                    </div>

                    <div className="bg-muted/50 rounded-xl p-5 space-y-2">
                        <h3 className="font-semibold">
                            What should you observe?
                        </h3>

                        <p className="text-muted-foreground text-sm leading-7">
                            Increase τs and observe how the measured output
                            falls behind the true plant output. Depending on
                            the plant and PID gains, this delay can produce
                            excessive overshoot and oscillatory behavior.
                        </p>
                        <p className="text-muted-foreground text-xs leading-6">
                            Overshoot is measured in the direction of the
                            setpoint. The final true/measured output
                            difference measures sensor lag at the final sample;
                            it is not the steady-state tracking error.
                        </p>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}

interface MetricCardProps {
    label: string;
    value: number;
    suffix?: string;
}

function MetricCard({
                        label,
                        value,
                        suffix = '',
                    }: MetricCardProps) {
    return (
        <div className="bg-card border-border rounded-xl border p-4 space-y-2">
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-2xl font-bold font-mono">
                {Number.isFinite(value) ? value.toFixed(3) : '—'}
                {suffix}
            </p>
        </div>
    );
}
