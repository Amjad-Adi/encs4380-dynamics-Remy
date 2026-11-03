import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Calculator } from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Equation } from '@/components/modules/equation.tsx';

import {
    getFrequencyResponse,
    getMaximumFrequency,
} from '@/features/first-order-frequency/domain/first-order-frequency.ts';

interface DynamicErrorCalculatorProps {
    tau: number;
    omega: number;
}

export function DynamicErrorCalculator({
    tau,
    omega,
}: DynamicErrorCalculatorProps) {
    const [tolerance, setTolerance] = useState(10);
    const response = getFrequencyResponse(tau, omega);
    const maximumFrequency = useMemo(
        () => getMaximumFrequency(tau, tolerance),
        [tau, tolerance],
    );
    const isWithinTolerance = response.amplitudeLossPercent <= tolerance;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calculator size={18} className="text-brand" />
                    <CardTitle className="text-base">Dynamic-error calculator</CardTitle>
                </div>
                <CardDescription>
                    Determine the highest input frequency that keeps amplitude loss
                    within a selected tolerance.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                    <Equation
                        expression={String.raw`\delta=M-1,\qquad \omega_{\max}=\frac{1}{\tau}\sqrt{\frac{1}{(1-\epsilon)^2}-1}`}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="amplitude-tolerance">
                            Allowable amplitude loss
                        </Label>
                        <span className="font-mono text-sm font-semibold tabular-nums">
                            {tolerance}%
                        </span>
                    </div>
                    <Input
                        id="amplitude-tolerance"
                        type="number"
                        min={1}
                        max={50}
                        step={1}
                        value={tolerance}
                        onChange={(event) => {
                            const value = Number(event.target.value);
                            if (Number.isFinite(value)) {
                                setTolerance(Math.min(50, Math.max(1, value)));
                            }
                        }}
                        className="max-w-32 font-mono"
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                        Amplitude loss is measured relative to the ideal output amplitude.
                        Phase error is not included in this tolerance.
                    </p>
                </div>

                <div className="rounded-lg bg-muted/60 p-4">
                    <p className="text-xs font-semibold text-muted-foreground">
                        Maximum permitted angular frequency
                    </p>
                    <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
                        {maximumFrequency.toFixed(3)}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            rad/s
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Equivalent frequency: {(maximumFrequency / (2 * Math.PI)).toFixed(3)} Hz
                    </p>
                </div>

                <div
                    className={[
                        'flex items-start gap-3 rounded-lg border p-3 text-sm',
                        isWithinTolerance
                            ? 'border-success/30 bg-success/5'
                            : 'border-warning/30 bg-warning/5',
                    ].join(' ')}
                    role="status"
                >
                    {isWithinTolerance ? (
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                    ) : (
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
                    )}
                    <div className="min-w-0">
                        <p className="font-medium">
                            {isWithinTolerance
                                ? 'Current frequency is within tolerance.'
                                : 'Current frequency exceeds the amplitude-loss tolerance.'}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Current amplitude loss: {response.amplitudeLossPercent.toFixed(2)}%.
                            {` `}Selected ω = {omega.toFixed(3)} rad/s; limit = {maximumFrequency.toFixed(3)} rad/s.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">δ = M − 1</Badge>
                    <Badge variant="outline">M ≥ {((100 - tolerance) / 100).toFixed(2)}</Badge>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTolerance(10)}
                    >
                        Reset tolerance
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
