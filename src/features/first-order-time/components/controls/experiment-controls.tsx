import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { ParameterControl } from '@/components/shared/parameter-control.tsx';

import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '@/features/first-order-time/domain/first-order-time.ts';

interface ExperimentControlsProps {
    parameters: FirstOrderParameters;
    inputType: FirstOrderInputType;
    onParameterChange: (
        key: keyof FirstOrderParameters,
        value: number,
    ) => void;
    onInputTypeChange: (type: FirstOrderInputType) => void;
    onReset: () => void;
}

export function ExperimentControls({
                                       parameters,
                                       inputType,
                                       onParameterChange,
                                       onInputTypeChange,
                                       onReset,
                                   }: ExperimentControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">
                        Experiment controls
                    </CardTitle>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset experiment"
                        title="Reset experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>

                <CardDescription>
                    Change the system parameters and input signal.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-7">
                <ParameterControl
                    id="gain"
                    label="System gain (K)"
                    value={parameters.gain}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit="—"
                    description="System sensitivity"
                    onChange={(value) => onParameterChange('gain', value)}
                />

                <ParameterControl
                    id="tau"
                    label="Time constant (τ)"
                    value={parameters.tau}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit="s"
                    description="Response speed"
                    onChange={(value) => onParameterChange('tau', value)}
                />

                <ParameterControl
                    id="amplitude"
                    label={
                        inputType === 'step'
                            ? 'Step amplitude (A)'
                            : 'Ramp slope (A)'
                    }
                    value={parameters.amplitude}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit={inputType === 'step' ? 'units' : 'units/s'}
                    onChange={(value) =>
                        onParameterChange('amplitude', value)
                    }
                />

                <Separator />

                <div className="space-y-3">
                    <p className="text-sm font-medium">Input type</p>

                    <div className="grid grid-cols-2 gap-2">
                        {(['step', 'ramp'] as const).map((type) => (
                            <Button
                                key={type}
                                type="button"
                                variant={inputType === type ? 'default' : 'outline'}
                                onClick={() => onInputTypeChange(type)}
                                className="capitalize"
                                aria-pressed={inputType === type}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg bg-muted/60 p-3">
                    <p className="text-xs font-semibold">
                        Current experiment
                    </p>

                    <p className="mt-2 font-mono text-sm">
                        K = {parameters.gain.toFixed(2)}
                    </p>

                    <p className="font-mono text-sm">
                        τ = {parameters.tau.toFixed(2)} s
                    </p>

                    <p className="font-mono text-sm">
                        A = {parameters.amplitude.toFixed(2)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}