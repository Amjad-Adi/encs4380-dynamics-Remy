import { Clock3, Gauge, Layers, Zap } from 'lucide-react';

import { SharedParameterSummary } from '@/components/modules/parameter-summary';
import type { SuperpositionConfiguration } from '@/features/superposition/domain/superposition';

interface ParameterSummaryProps {
    configuration: SuperpositionConfiguration;
}

export function ParameterSummary({ configuration }: ParameterSummaryProps) {
    const { components, sensor } = configuration;

    const items = [
        {
            label: 'Active components',
            value: components.length.toString(),
            description: 'x(t) = Σ xᵢ(t)',
            icon: Layers,
        },
        {
            label: 'Sensor gain (K)',
            value: sensor.gain.toFixed(2),
            description: 'Static sensitivity',
            icon: Zap,
        },
        {
            label: 'Time constant (τ)',
            value: sensor.tau.toFixed(2),
            unit: 's',
            description: 'Transient decays as e^(−t/τ)',
            icon: Clock3,
        },
        {
            label: 'Cutoff frequency',
            value: (1 / sensor.tau).toFixed(3),
            unit: 'rad/s',
            description: 'ωc = 1/τ',
            icon: Gauge,
        },
    ];

    return <SharedParameterSummary items={items} ariaLabel="Current superposition experiment" />;
}
