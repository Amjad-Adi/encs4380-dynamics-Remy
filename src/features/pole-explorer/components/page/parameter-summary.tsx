import { Activity, Clock3, Crosshair, Gauge, Layers, ShieldCheck } from 'lucide-react';

import { SharedParameterSummary } from '@/components/modules/parameter-summary';
import {
    formatNumber,
    getPoleSummary,
    getPoles,
    type PoleCharacteristics,
    type PoleConfiguration,
} from '@/features/pole-explorer/domain/pole-explorer';
import {
    getStabilityLabel,
    STABILITY_DESCRIPTIONS,
} from '@/features/pole-explorer/components/pole-labels';

interface ParameterSummaryProps {
    configuration: PoleConfiguration;
    characteristics: PoleCharacteristics;
}

export function ParameterSummary({ configuration, characteristics }: ParameterSummaryProps) {
    const poles = getPoles(configuration);
    const bothReal = poles.every((pole) => Math.abs(pole.imaginary) < 1e-9);

    const items =
        configuration.order === 'first'
            ? [
                  {
                      label: 'System order',
                      value: 'First-order',
                      description: 'One real pole',
                      icon: Layers,
                  },
                  {
                      label: 'Pole location (p)',
                      value: getPoleSummary(poles),
                      description: 'Position in the s-plane',
                      icon: Crosshair,
                  },
                  {
                      label: 'Time constant (τ)',
                      value: formatNumber(characteristics.timeConstant ?? 0, 3),
                      unit: 's',
                      description: '1 / |p|',
                      icon: Clock3,
                  },
                  {
                      label: 'Stability',
                      value: getStabilityLabel(characteristics.stability),
                      description: STABILITY_DESCRIPTIONS[characteristics.stability],
                      icon: ShieldCheck,
                  },
              ]
            : [
                  {
                      label: 'System order',
                      value: 'Second-order',
                      description: 'Two poles',
                      icon: Layers,
                  },
                  {
                      label: 'Pole locations',
                      value: getPoleSummary(poles),
                      description: bothReal ? 'Real poles on the σ axis' : 'σ ± jωd in the s-plane',
                      icon: Crosshair,
                  },
                  {
                      label: 'Damping ratio (ζ)',
                      value:
                          characteristics.dampingRatio === null
                              ? '-'
                              : formatNumber(characteristics.dampingRatio, 3),
                      description: 'Derived from σ and ωn',
                      icon: Gauge,
                  },
                  {
                      label: 'Natural frequency (ωn)',
                      value:
                          characteristics.naturalFrequency === null
                              ? '-'
                              : formatNumber(characteristics.naturalFrequency, 3),
                      unit: characteristics.naturalFrequency === null ? undefined : 'rad/s',
                      description: 'Distance from the origin',
                      icon: Activity,
                  },
              ];

    return <SharedParameterSummary ariaLabel="Current pole configuration" items={items} />;
}
