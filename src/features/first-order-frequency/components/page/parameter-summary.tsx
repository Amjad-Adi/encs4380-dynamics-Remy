
import {
    Activity,
    Gauge,
    Waves,
    Zap,
} from 'lucide-react';

import {  SharedParameterSummary } from '@/components/modules/parameter-summary';

import type { FrequencyResponse } from '@/features/first-order-frequency/domain/first-order-frequency';

interface ParameterSummaryProps {
    response: FrequencyResponse;
}

export function ParameterSummary({ response }: ParameterSummaryProps) {
    const items = [
        {
            label: 'Amplitude ratio',
            value: response.magnitude.toFixed(4),
            description: 'Output / input amplitude',
            icon: Waves,
        },
        {
            label: 'Phase lag',
            value: `${response.phaseDegrees.toFixed(2)}°`,
            description: 'Negative phase indicates lag',
            icon: Activity,
        },
        {
            label: 'Cutoff frequency',
            value: response.cutoffFrequency.toFixed(3),
            unit: 'rad/s',
            description: 'ωc = 1/τ',
            icon: Gauge,
        },
        {
            label: 'Relative amplitude error',
            value: `${(response.amplitudeError * 100).toFixed(2)}%`,
            description: 'δ = M − 1',
            icon: Zap,
        },
    ];

    return (
        <SharedParameterSummary
            items={items}
            ariaLabel="Current frequency response metrics"
        />
    );
}
