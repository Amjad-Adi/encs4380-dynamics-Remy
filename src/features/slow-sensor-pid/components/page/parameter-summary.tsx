import { Activity, Gauge, Waves, SlidersHorizontal } from 'lucide-react';

import { SharedParameterSummary } from '@/components/modules/parameter-summary.tsx';
import type { SlowSensorPIDParameters } from '@/features/slow-sensor-pid/domain/slow-sensor-pid.ts';

interface ParameterSummaryProps {
    parameters: SlowSensorPIDParameters;
    overshoot: number;
}

export function ParameterSummary({ parameters, overshoot }: ParameterSummaryProps) {
    const plantDescription =
        parameters.plantType === 'first-order'
            ? `K = ${parameters.firstOrder.gain.toFixed(2)}, τp = ${parameters.firstOrder.tau.toFixed(2)} s`
            : `m = ${parameters.secondOrder.m.toFixed(2)}, b = ${parameters.secondOrder.b.toFixed(2)}, k = ${parameters.secondOrder.k.toFixed(2)}`;

    return (
        <SharedParameterSummary
            ariaLabel="Current slow-sensor PID experiment parameters"
            items={[
                {
                    label: 'Plant model',
                    value: parameters.plantType === 'first-order' ? '1st order' : '2nd order',
                    description: plantDescription,
                    icon: Waves,
                },
                {
                    label: 'Sensor time constant',
                    value: parameters.sensorTau.toFixed(2),
                    unit: 's',
                    description: 'Feedback measurement lag (τs)',
                    icon: Activity,
                },
                {
                    label: 'PID gains',
                    value: `${parameters.gains.kp.toFixed(1)} / ${parameters.gains.ki.toFixed(1)} / ${parameters.gains.kd.toFixed(1)}`,
                    description: 'Kp / Ki / Kd',
                    icon: SlidersHorizontal,
                },
                {
                    label: 'Output overshoot',
                    value: overshoot.toFixed(2),
                    unit: '%',
                    description: 'Peak true output relative to setpoint',
                    icon: Gauge,
                },
            ]}
        />
    );
}
