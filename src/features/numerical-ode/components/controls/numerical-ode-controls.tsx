import { RotateCcw } from 'lucide-react';

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

import type { NumericalOdeParameters } from '@/features/numerical-ode/domain/numerical-ode';

export type NumericalMethod = 'euler' | 'rk4';

interface NumericalOdeControlsProps {
    parameters: NumericalOdeParameters;
    method: NumericalMethod;
    onParameterChange: (key: keyof NumericalOdeParameters, value: number) => void;
    onMethodChange: (method: NumericalMethod) => void;
    onReset: () => void;
}

export function NumericalOdeControls({
    parameters,
    method,
    onParameterChange,
    onMethodChange,
    onReset,
}: NumericalOdeControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Solver controls</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset numerical ODE experiment"
                        title="Reset experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>
                    Adjust the system, integration interval, and method. Results
                    recalculate immediately.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <ParameterControl
                    id="ode-gain"
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
                    id="ode-time-constant"
                    label="Time constant (τ)"
                    value={parameters.timeConstant}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit="s"
                    description="Response speed"
                    onChange={(value) => onParameterChange('timeConstant', value)}
                />
                <ParameterControl
                    id="ode-amplitude"
                    label="Step amplitude (A)"
                    value={parameters.amplitude}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit="units"
                    description="Input step size"
                    onChange={(value) => onParameterChange('amplitude', value)}
                />

                <Separator />

                <ParameterControl
                    id="ode-step-size"
                    label="Step size (Δt)"
                    value={parameters.stepSize}
                    min={0.01}
                    max={2}
                    step={0.01}
                    unit="s"
                    description="Integration interval"
                    onChange={(value) => onParameterChange('stepSize', value)}
                />
                <ParameterControl
                    id="ode-duration"
                    label="Simulation duration"
                    value={parameters.duration}
                    min={0.1}
                    max={10}
                    step={0.1}
                    unit="s"
                    description="End time"
                    onChange={(value) => onParameterChange('duration', value)}
                />

                <Separator />

                <fieldset className="space-y-3">
                    <legend className="text-sm font-medium">Numerical method</legend>
                    <div className="grid grid-cols-2 gap-2">
                        {([
                            ['euler', "Euler's method"],
                            ['rk4', 'Fourth-order RK'],
                        ] as const).map(([value, label]) => (
                            <Button
                                key={value}
                                type="button"
                                variant={method === value ? 'default' : 'outline'}
                                onClick={() => onMethodChange(value)}
                                aria-pressed={method === value}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </fieldset>

                <div className="rounded-lg bg-muted/60 p-3" aria-live="polite">
                    <p className="text-xs font-semibold">Current experiment</p>
                    <p className="mt-2 font-mono text-sm">
                        K = {parameters.gain.toFixed(2)} · τ = {parameters.timeConstant.toFixed(2)} s
                    </p>
                    <p className="font-mono text-sm">
                        A = {parameters.amplitude.toFixed(2)} · Δt = {parameters.stepSize.toFixed(2)} s
                    </p>
                    <p className="font-mono text-sm">
                        Duration = {parameters.duration.toFixed(2)} s
                    </p>
                    <p className="mt-2 text-sm font-medium">
                        Selected: {method === 'euler' ? "Euler's method" : 'Fourth-order Runge–Kutta'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
