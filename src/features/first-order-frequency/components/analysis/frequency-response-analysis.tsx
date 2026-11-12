import { Activity, Clock3, Gauge, Waves } from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';
import { MetricCard } from '@/components/modules/metric-card';
import { getFrequencyResponse } from '@/features/first-order-frequency/domain/first-order-frequency.ts';
import { SignalResponseChart } from '../charts/signal-response-chart.tsx';
import { BodeResponseChart } from '../charts/bode-response-chart.tsx';

interface FrequencyResponseAnalysisProps {
    tau: number;
    omega: number;
}

export function FrequencyResponseAnalysis({ tau, omega }: FrequencyResponseAnalysisProps) {
    const response = getFrequencyResponse(tau, omega);
    const cutoff = response.cutoffFrequency;

    return (
        <div className="min-w-0 space-y-4">
            <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">
                                Steady-state sinusoidal response
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Compare the input sinusoid with the attenuated and phase-shifted
                                output.
                            </CardDescription>
                        </div>
                        <Badge variant="outline">ωτ = {(omega * tau).toFixed(3)}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="min-w-0">
                    <SignalResponseChart tau={tau} omega={omega} />
                    <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                        <span className="inline-flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#98a6bb]" />
                            Input sin(ωt)
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#3978c5]" />
                            Output M sin(ωt + φ)
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Amplitude ratio (M)"
                    value={response.magnitude.toFixed(4)}
                    detail="Output amplitude / input amplitude"
                    icon={Waves}
                />
                <MetricCard
                    label="Phase lag (φ)"
                    value={`${response.phaseDegrees.toFixed(2)}°`}
                    detail="Negative phase indicates output lag"
                    icon={Activity}
                />
                <MetricCard
                    label="Cutoff frequency (ωc)"
                    value={cutoff.toFixed(3)}
                    detail="ωc = 1/τ (rad/s)"
                    icon={Gauge}
                />
                <MetricCard
                    label="Amplitude error (δ)"
                    value={response.amplitudeError.toFixed(4)}
                    detail={`${(response.amplitudeError * 100).toFixed(2)}% relative to ideal amplitude`}
                    icon={Clock3}
                />
            </div>

            <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-base">Bode response</CardTitle>
                            <CardDescription className="mt-1">
                                Frequency-domain magnitude and phase for the current time constant.
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="border-chart-3/40 text-foreground">
                            ωc = {cutoff.toFixed(3)} rad/s
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="min-w-0">
                    <BodeResponseChart tau={tau} omega={omega} />
                    <p className="text-muted-foreground mt-1 text-xs leading-5">
                        Blue: response curve · teal: selected frequency · orange dashed: cutoff. At
                        ω = ωc, M = 0.7071 (−3.01 dB) and φ = −45°.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
