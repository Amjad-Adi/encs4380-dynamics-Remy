import { Activity, Gauge, Waves, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { FrequencyResponse } from '../../models/first-order-frequency';

interface ParameterSummaryProps {
    response: FrequencyResponse;
}

function SummaryItem({
    label,
    value,
    description,
    icon: Icon,
}: {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Icon size={16} className="shrink-0 text-primary" />
            </div>
            <p className="break-words font-mono text-2xl font-semibold tracking-tight tabular-nums">
                {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
    );
}

export function ParameterSummary({ response }: ParameterSummaryProps) {
    return (
        <section aria-label="Current frequency response metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryItem
                label="Amplitude ratio"
                value={response.magnitude.toFixed(4)}
                description="Output / input amplitude"
                icon={Waves}
            />
            <SummaryItem
                label="Phase lag"
                value={`${response.phaseDegrees.toFixed(2)}°`}
                description="Negative phase indicates lag"
                icon={Activity}
            />
            <SummaryItem
                label="Cutoff frequency"
                value={`${response.cutoffFrequency.toFixed(3)} rad/s`}
                description="ωc = 1/τ"
                icon={Gauge}
            />
            <SummaryItem
                label="Relative amplitude error"
                value={`${(response.amplitudeError * 100).toFixed(2)}%`}
                description="δ = M − 1"
                icon={Zap}
            />
        </section>
    );
}
