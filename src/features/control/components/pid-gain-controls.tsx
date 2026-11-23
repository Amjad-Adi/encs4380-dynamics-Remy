import { ParameterControl } from '@/components/shared/parameter-control';
import { PID_GAIN_RANGES, type PIDGains } from '@/features/control/domain';

type GainRanges = Record<keyof PIDGains, { min: number; max: number; step: number }>;

interface PIDGainControlsProps {
    idPrefix: string;
    gains: PIDGains;
    onGainChange: (key: keyof PIDGains, value: number) => void;
    ranges?: GainRanges;
    title?: string;
}

const GAINS: {
    key: keyof PIDGains;
    label: string;
    ariaLabel: string;
    unit: string;
    description: string;
}[] = [
    {
        key: 'kp',
        label: 'Proportional (Kp)',
        ariaLabel: 'Proportional gain Kp',
        unit: '-',
        description: 'Acts on present error',
    },
    {
        key: 'ki',
        label: 'Integral (Ki)',
        ariaLabel: 'Integral gain Ki',
        unit: '1/s',
        description: 'Accumulates past error',
    },
    {
        key: 'kd',
        label: 'Derivative (Kd)',
        ariaLabel: 'Derivative gain Kd',
        unit: 's',
        description: 'Damps the measured rate',
    },
];

/** Kp, Ki and Kd sliders shared by the Control modules. */
export function PIDGainControls({
    idPrefix,
    gains,
    onGainChange,
    ranges = PID_GAIN_RANGES,
    title = 'PID gains',
}: PIDGainControlsProps) {
    return (
        <div className="space-y-6">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {title}
            </p>
            {GAINS.map((gain) => (
                <ParameterControl
                    key={gain.key}
                    id={`${idPrefix}-${gain.key}`}
                    label={gain.label}
                    ariaLabel={gain.ariaLabel}
                    value={gains[gain.key]}
                    {...ranges[gain.key]}
                    unit={gain.unit}
                    description={gain.description}
                    onChange={(value) => onGainChange(gain.key, value)}
                />
            ))}
        </div>
    );
}
