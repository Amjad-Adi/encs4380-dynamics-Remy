import { MousePointer2, RotateCcw } from 'lucide-react';

import { ParameterControl } from '@/components/shared/parameter-control';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    POLE_LIMIT,
    formatNumber,
    getPoleSummary,
    getPoles,
    getPresets,
    type ComplexPole,
    type PoleCharacteristics,
    type PoleConfiguration,
    type PolePreset,
    type SystemOrder,
} from '@/features/pole-explorer/domain/pole-explorer';

const ORDER_OPTIONS: Array<{
    order: SystemOrder;
    label: string;
    equation: string;
}> = [
    {
        order: 'first',
        label: 'First-order',
        equation: 'G(s) = −p / (s − p)',
    },
    {
        order: 'second',
        label: 'Second-order',
        equation: 's₁,₂ = σ ± jωd',
    },
];

interface PoleControlsProps {
    configuration: PoleConfiguration;
    characteristics: PoleCharacteristics;
    onOrderChange: (order: SystemOrder) => void;
    onPresetSelect: (preset: PolePreset) => void;
    onPoleChange: (index: number, pole: ComplexPole) => void;
    onConjugatePairChange: (
        realPart: number,
        imaginaryPart: number,
    ) => void;
    onReset: () => void;
}

export function PoleControls({
    configuration,
    characteristics,
    onOrderChange,
    onPresetSelect,
    onPoleChange,
    onConjugatePairChange,
    onReset,
}: PoleControlsProps) {
    const poles = getPoles(configuration);
    const presets = getPresets(configuration.order);
    const bothReal = poles.every(
        (pole) => Math.abs(pole.imaginary) < 1e-9,
    );

    function isPresetActive(preset: PolePreset) {
        const current = poles.map(poleKey).sort();
        const target = preset.poles.map(poleKey).sort();

        return (
            current.length === target.length &&
            current.every((value, index) => value === target[index])
        );
    }

    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">
                        Pole placement
                    </CardTitle>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset pole explorer"
                        title="Reset experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>

                <CardDescription>
                    Drag poles in the s-plane or use the controls below.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-7">
                <div className="space-y-3">
                    <p className="text-sm font-medium">System order</p>

                    <div className="grid grid-cols-2 gap-2">
                        {ORDER_OPTIONS.map((option) => (
                            <Button
                                key={option.order}
                                type="button"
                                variant={
                                    configuration.order === option.order
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => {
                                    if (
                                        configuration.order !==
                                        option.order
                                    ) {
                                        onOrderChange(option.order);
                                    }
                                }}
                                className="h-auto flex-col items-start gap-0.5 py-2"
                                aria-pressed={
                                    configuration.order === option.order
                                }
                            >
                                <span>{option.label}</span>

                                <span className="font-mono text-[10px] font-normal opacity-75">
                                    {option.equation}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium">
                        Pole presets
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        {presets.map((preset) => (
                            <Button
                                key={preset.id}
                                type="button"
                                variant={
                                    isPresetActive(preset)
                                        ? 'secondary'
                                        : 'outline'
                                }
                                onClick={() => onPresetSelect(preset)}
                                className="h-auto flex-col items-start gap-0.5 py-2 text-left"
                                aria-pressed={isPresetActive(preset)}
                            >
                                <span className="text-xs font-medium">
                                    {preset.label}
                                </span>

                                <span className="font-mono text-[10px] font-normal opacity-75">
                                    {preset.description}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>

                <Separator />

                {configuration.order === 'first' && (
                    <ParameterControl
                        id="pole-first-real"
                        label="Pole location (p)"
                        value={poles[0].real}
                        min={-POLE_LIMIT}
                        max={POLE_LIMIT}
                        step={0.1}
                        unit="s⁻¹"
                        description="Negative is stable"
                        onChange={(value) =>
                            onPoleChange(0, {
                                real: value,
                                imaginary: 0,
                            })
                        }
                    />
                )}

                {configuration.order === 'second' && bothReal && (
                    <>
                        <ParameterControl
                            id="pole-first-real"
                            label="Pole 1 real part (p₁)"
                            value={poles[0].real}
                            min={-POLE_LIMIT}
                            max={POLE_LIMIT}
                            step={0.1}
                            unit="s⁻¹"
                            description="Along the real axis"
                            onChange={(value) =>
                                onPoleChange(0, {
                                    real: value,
                                    imaginary: 0,
                                })
                            }
                        />

                        <ParameterControl
                            id="pole-second-real"
                            label="Pole 2 real part (p₂)"
                            value={poles[1].real}
                            min={-POLE_LIMIT}
                            max={POLE_LIMIT}
                            step={0.1}
                            unit="s⁻¹"
                            description="Drag one pole off-axis to pair them"
                            onChange={(value) =>
                                onPoleChange(1, {
                                    real: value,
                                    imaginary: 0,
                                })
                            }
                        />
                    </>
                )}

                {configuration.order === 'second' && !bothReal && (
                    <>
                        <ParameterControl
                            id="pole-real-part"
                            label="Real part (σ)"
                            value={Number(
                                characteristics.realPart.toFixed(2),
                            )}
                            min={-POLE_LIMIT}
                            max={POLE_LIMIT}
                            step={0.1}
                            unit="s⁻¹"
                            description="Distance from the jω axis"
                            onChange={(value) =>
                                onConjugatePairChange(
                                    value,
                                    characteristics.imaginaryPart,
                                )
                            }
                        />

                        <ParameterControl
                            id="pole-imaginary-part"
                            label="Imaginary part (ωd)"
                            value={Number(
                                characteristics.imaginaryPart.toFixed(2),
                            )}
                            min={0}
                            max={POLE_LIMIT}
                            step={0.1}
                            unit="rad/s"
                            description="Damped oscillation frequency"
                            onChange={(value) =>
                                onConjugatePairChange(
                                    characteristics.realPart,
                                    value,
                                )
                            }
                        />
                    </>
                )}

                <div className="rounded-lg bg-muted/60 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold">
                        <MousePointer2 size={13} />
                        Current poles
                    </p>

                    <p className="mt-2 font-mono text-sm">
                        {getPoleSummary(poles)}
                    </p>

                    {configuration.order === 'first' ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                            τ ={' '}
                            {formatNumber(
                                characteristics.timeConstant ?? 0,
                                2,
                            )}{' '}
                            s
                        </p>
                    ) : (
                        <p className="mt-1 text-xs text-muted-foreground">
                            ζ ={' '}
                            {characteristics.dampingRatio === null
                                ? '—'
                                : formatNumber(
                                      characteristics.dampingRatio,
                                      3,
                                  )}{' '}
                            · ωn ={' '}
                            {characteristics.naturalFrequency === null
                                ? '—'
                                : `${formatNumber(
                                      characteristics.naturalFrequency,
                                      3,
                                  )} rad/s`}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function poleKey(pole: ComplexPole): string {
    return `${pole.real.toFixed(2)}:${pole.imaginary.toFixed(2)}`;
}
