import { ArrowLeftRight, MoveVertical, ShieldAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    formatNumber,
    type PoleCharacteristics,
} from '@/features/pole-explorer/domain/pole-explorer';
import {
    getKindDescription,
    getRegimeLabel,
    getStabilityLabel,
    REGIME_REFERENCE,
} from '@/features/pole-explorer/components/pole-labels';

const STABILITY_BADGE_CLASS = {
    stable: 'border-success/30 bg-success/5 text-success',
    marginal: 'border-[#d69a35]/40 bg-[#d69a35]/10 text-[#a9761f] dark:text-[#e0b25f]',
    unstable: 'border-destructive/30 bg-destructive/5 text-destructive',
} as const;

interface StabilityAnalysisProps {
    characteristics: PoleCharacteristics;
}

const PLANE_GUIDES = [
    {
        title: 'Move a pole left',
        icon: ArrowLeftRight,
        description:
            'A larger negative real part increases the decay rate, so the response settles sooner.',
    },
    {
        title: 'Move off the real axis',
        icon: MoveVertical,
        description:
            'A larger imaginary part raises the oscillation frequency, producing more oscillations in the same time.',
    },
    {
        title: 'Cross into the RHP',
        icon: ShieldAlert,
        description:
            'Any pole with a positive real part adds a growing exponential, so the step response becomes unbounded.',
    },
];

export function StabilityAnalysis({ characteristics }: StabilityAnalysisProps) {
    const readouts =
        characteristics.order === 'first'
            ? [
                  {
                      label: 'Dominant real part',
                      value: `${formatNumber(characteristics.realPart, 2)} s⁻¹`,
                  },
                  {
                      label: 'Time constant τ',
                      value: `${formatNumber(characteristics.timeConstant ?? 0, 3)} s`,
                  },
                  {
                      label: 'Damping ratio ζ',
                      value: '-',
                  },
                  {
                      label: 'Natural frequency ωn',
                      value: '-',
                  },
              ]
            : [
                  {
                      label: 'Dominant real part',
                      value: `${formatNumber(characteristics.realPart, 2)} s⁻¹`,
                  },
                  {
                      label: 'Imaginary part',
                      value:
                          characteristics.imaginaryPart > 0
                              ? `± j${formatNumber(characteristics.imaginaryPart, 2)}`
                              : '0',
                  },
                  {
                      label: 'Damping ratio ζ',
                      value:
                          characteristics.dampingRatio === null
                              ? '-'
                              : formatNumber(characteristics.dampingRatio, 3),
                  },
                  {
                      label: 'Natural frequency ωn',
                      value:
                          characteristics.naturalFrequency === null
                              ? '-'
                              : `${formatNumber(characteristics.naturalFrequency, 3)} rad/s`,
                  },
              ];

    return (
        <div className="min-w-0 space-y-4">
            <Card className="min-w-0">
                <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">Current pole classification</CardTitle>

                            <CardDescription className="mt-1 max-w-2xl">
                                {getKindDescription(characteristics.kind)}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{getRegimeLabel(characteristics.kind)}</Badge>

                            <Badge
                                variant="outline"
                                className={STABILITY_BADGE_CLASS[characteristics.stability]}
                            >
                                {getStabilityLabel(characteristics.stability)}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {readouts.map((readout) => (
                            <div
                                key={readout.label}
                                className="border-border bg-muted/30 min-w-0 rounded-lg border p-3"
                            >
                                <p className="text-muted-foreground text-xs">{readout.label}</p>

                                <p className="mt-1 font-mono text-lg font-semibold break-words tabular-nums">
                                    {readout.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {!characteristics.standardFormValid && (
                        <p className="text-muted-foreground text-xs leading-5">
                            The two real poles have opposite signs, so the standard second-order
                            form with positive ωn² is not realizable. The right-half-plane pole
                            makes this an unstable saddle.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card className="min-w-0">
                <CardHeader>
                    <CardTitle className="text-base">Damping regimes</CardTitle>

                    <CardDescription>
                        The highlighted regime matches the current pole placement.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {REGIME_REFERENCE.map((reference) => {
                        const isActive =
                            reference.id === 'unstable'
                                ? characteristics.stability === 'unstable'
                                : characteristics.stability !== 'unstable' &&
                                  characteristics.kind === reference.id;

                        return (
                            <div
                                key={reference.id}
                                className={cn(
                                    'min-w-0 rounded-lg border p-3 transition-colors',
                                    isActive ? 'border-primary bg-accent' : 'border-border',
                                )}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium">{reference.label}</p>

                                    {isActive && (
                                        <Badge variant="outline" className="text-[10px]">
                                            Current
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-muted-foreground mt-1 font-mono text-xs">
                                    {reference.condition}
                                </p>

                                <p className="text-muted-foreground mt-2 text-xs leading-5">
                                    {reference.summary}
                                </p>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card className="min-w-0">
                <CardHeader>
                    <CardTitle className="text-base">Reading the s-plane</CardTitle>

                    <CardDescription>How moving a pole changes the time response.</CardDescription>
                </CardHeader>

                <CardContent className="grid gap-3 sm:grid-cols-3">
                    {PLANE_GUIDES.map(({ title, description, icon: Icon }) => (
                        <div key={title} className="border-border min-w-0 rounded-lg border p-3">
                            <p className="flex items-center gap-2 text-sm font-medium">
                                <Icon size={15} className="text-primary shrink-0" />
                                {title}
                            </p>

                            <p className="text-muted-foreground mt-2 text-xs leading-5">
                                {description}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
