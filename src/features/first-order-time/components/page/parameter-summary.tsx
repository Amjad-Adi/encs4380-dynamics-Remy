
import {
    Activity,
    Gauge,
    Waves,
} from 'lucide-react';

import {  SharedParameterSummary } from '@/components/modules/parameter-summary';

import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '@/features/first-order-time/domain/first-order-time';

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
            label: inputType === 'step'
                ? 'Expected final output'
                : 'Ramp tracking lag',
            value: inputType === 'step'
                ? formatValue(expectedStepOutput)
                : formatValue(rampLag),
            unit: inputType === 'ramp' ? 's' : undefined,
            description: inputType === 'step'
                ? 'Steady-state output (KA)'
                : 'Time delay (τ)',
            icon: Activity,
        },
    ];

    return (
        <SharedParameterSummary
            items={items}
            ariaLabel="Current experiment parameters"
        />
    );
}
