import {
    Activity,
    Gauge,
    Scale,
    SlidersHorizontal,
    Wrench,
} from 'lucide-react';

import { SharedParameterSummary } from '@/components/modules/parameter-summary';
import type { PhysicalParameters } from '@/features/second-order/domain/second-order';

interface ParameterSummaryProps {
    parameters: PhysicalParameters;
    dampingRatio: number;
    naturalFrequency: number;
}

export function ParameterSummary({
    parameters,
    dampingRatio,
    naturalFrequency,
}: ParameterSummaryProps) {
    return (
        <SharedParameterSummary
            ariaLabel="Current second-order system parameters"
            items={[
                {
                    label: 'Mass (m)',
                    value: parameters.m.toFixed(2),
                    unit: 'kg',
                    description: 'Moving mass',
                    icon: Scale,
                },
                {
                    label: 'Damping (b)',
                    value: parameters.b.toFixed(2),
                    unit: 'N·s/m',
                    description: 'Viscous damping coefficient',
                    icon: SlidersHorizontal,
                },
                {
                    label: 'Stiffness (k)',
                    value: parameters.k.toFixed(2),
                    unit: 'N/m',
                    description: 'Spring stiffness',
                    icon: Wrench,
                },
                {
                    label: 'Damping ratio (ζ)',
                    value: dampingRatio.toFixed(4),
                    description: 'Derived from m, b, and k',
                    icon: Gauge,
                },
                {
                    label: 'Natural frequency (ωn)',
                    value: naturalFrequency.toFixed(3),
                    unit: 'rad/s',
                    description: 'Undamped natural frequency',
                    icon: Activity,
                },
            ]}
        />
    );
}
