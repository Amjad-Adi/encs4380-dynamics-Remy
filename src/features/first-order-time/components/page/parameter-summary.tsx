import {
    Activity,
    Gauge,
    Waves,
} from 'lucide-react';

import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '../../models/first-order-time.ts';

interface ParameterSummaryProps {
    parameters: FirstOrderParameters;
    inputType: FirstOrderInputType;
    rampLag: number;
    expectedStepOutput: number;
}

function formatValue(value: number, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

export function ParameterSummary({
                                     parameters,
                                     inputType,
                                     rampLag,
                                     expectedStepOutput,
                                 }: ParameterSummaryProps) {
    const items = [
        {
            label: 'System gain',
            value: formatValue(parameters.gain),
            description: 'Sensitivity (K)',
            icon: Gauge,
        },
        {
            label: 'Time constant',
            value: formatValue(parameters.tau),
            unit: 's',
            description: 'Response speed (τ)',
            icon: Activity,
        },
        {
            label: 'Input amplitude',
            value: formatValue(parameters.amplitude),
            description: 'Input magnitude (A)',
            icon: Waves,
        },
        {
            label:
                inputType === 'step'
                    ? 'Expected final output'
                    : 'Ramp tracking lag',
            value:
                inputType === 'step'
                    ? formatValue(expectedStepOutput)
                    : formatValue(rampLag),
            unit: inputType === 'ramp' ? 's' : undefined,
            description:
                inputType === 'step'
                    ? 'Steady-state output (KA)'
                    : 'Time delay (τ)',
            icon: Activity,
        },
    ];

    return (
        <section
            aria-label="Current experiment parameters"
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
            {items.map(({ label, value, unit, description, icon: Icon }) => (
                <div
                    key={label}
                    className="min-w-0 rounded-xl border border-border bg-card p-4"
                >
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                            {label}
                        </span>

                        <Icon
                            size={16}
                            className="shrink-0 text-primary"
                        />
                    </div>

                    <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
                        {value}

                        {unit && (
                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                                {unit}
                            </span>
                        )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            ))}
        </section>
    );
}