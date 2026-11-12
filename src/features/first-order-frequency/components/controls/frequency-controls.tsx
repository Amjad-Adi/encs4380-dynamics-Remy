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

interface FrequencyControlsProps {
    tau: number;
    omega: number;
    onTauChange: (value: number) => void;
    onOmegaChange: (value: number) => void;
    onReset: () => void;
}

export function FrequencyControls({
    tau,
    omega,
    onTauChange,
    onOmegaChange,
    onReset,
}: FrequencyControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Experiment controls</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset frequency experiment"
                        title="Reset experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>
                    Change the sensor time constant and the input frequency.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-7">
                <ParameterControl
                    id="frequency-tau"
                    label="Time constant (τ)"
                    value={tau}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit="s"
                    description="Larger τ moves the cutoff to a lower frequency."
                    onChange={onTauChange}
                />

                <ParameterControl
                    id="angular-frequency"
                    label="Angular frequency (ω)"
                    value={omega}
                    min={0.01}
                    max={20}
                    step={0.01}
                    unit="rad/s"
                    description="Higher ω means a faster-changing input."
                    onChange={onOmegaChange}
                />

                <Separator />

                <div className="bg-muted/60 rounded-lg p-3">
                    <p className="text-xs font-semibold">Current experiment</p>
                    <p className="mt-2 font-mono text-sm">τ = {tau.toFixed(3)} s</p>
                    <p className="font-mono text-sm">ω = {omega.toFixed(3)} rad/s</p>
                    <p className="font-mono text-sm">ωτ = {(omega * tau).toFixed(3)}</p>
                    <p className="text-muted-foreground mt-2 text-xs leading-5">
                        The model assumes a unity-gain input sinusoid and omits startup transients.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
