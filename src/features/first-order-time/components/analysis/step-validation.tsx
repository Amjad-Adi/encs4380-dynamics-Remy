import { Activity, Clock3, Gauge, TrendingDown } from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card.tsx';
import { ValidationSection } from '@/components/modules/validation-checks.tsx';

import type {
    FirstOrderParameters,
    getStepValidation,
} from '@/features/first-order-time/domain/first-order-time.ts';

const FRACTION_AT_TAU = 0.6321205588;
const FRACTION_AT_THREE_TAU = 0.9502129316;

type ValidationResults = ReturnType<typeof getStepValidation>;

interface StepValidationProps {
    results: ValidationResults;
    parameters: FirstOrderParameters;
}

export function StepValidation({ results, parameters }: StepValidationProps) {
    const finalValue = parameters.gain * parameters.amplitude;
    const valueAtTau = FRACTION_AT_TAU * finalValue;
    const valueAtThreeTau = FRACTION_AT_THREE_TAU * finalValue;
    const errorFractionAtTau = Math.exp(-1);

    const checks = results.map((result) => ({
        label: result.label,
        expected: `${result.expected.toFixed(4)} ${result.unit}`,
        calculated: `${result.actual.toFixed(4)} ${result.unit}`,
        passed: result.passed,
    }));

    return (
        <section className="space-y-4">
            <p className="text-muted-foreground text-sm leading-6">
                At t = τ = {parameters.tau.toFixed(2)} s the output reaches 63.2% of KA; at t = 3τ ={' '}
                {(3 * parameters.tau).toFixed(2)} s it reaches 95.0% of KA.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <MetricCard
                    label="Time constant"
                    value={`${parameters.tau.toFixed(2)} s`}
                    detail="Characteristic response time τ"
                    icon={Clock3}
                />

                <MetricCard
                    label="Final output"
                    value={finalValue.toFixed(3)}
                    detail="Steady-state value KA"
                    icon={Gauge}
                />

                <MetricCard
                    label="Output at τ"
                    value={valueAtTau.toFixed(3)}
                    detail="63.2% of KA"
                    icon={Activity}
                />

                <MetricCard
                    label="Output at 3τ"
                    value={valueAtThreeTau.toFixed(3)}
                    detail="95.0% of KA"
                    icon={Activity}
                />

                <MetricCard
                    label="Error fraction at τ"
                    value={`${(errorFractionAtTau * 100).toFixed(1)}%`}
                    detail="e⁻¹ of KA still remaining"
                    icon={TrendingDown}
                />
            </div>

            <ValidationSection
                checks={checks}
                description="These checks verify the 63.2% and 95.0% response fractions; all values are recalculated from the current gain K, amplitude A, and time constant τ."
            />
        </section>
    );
}
