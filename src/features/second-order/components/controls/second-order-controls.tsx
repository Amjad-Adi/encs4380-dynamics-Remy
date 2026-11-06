import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ParameterControl } from '@/components/shared/parameter-control';
import type { PhysicalParameters } from '@/features/second-order/domain/second-order';

interface SecondOrderControlsProps {
    parameters: PhysicalParameters;
    onParameterChange: (key: keyof PhysicalParameters, value: number) => void;
    onReset: () => void;
}

export function SecondOrderControls({
    parameters,
    onParameterChange,
    onReset,
}: SecondOrderControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">System parameters</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset second-order experiment"
                        title="Reset experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>
                    Adjust the physical mass, damping, and spring stiffness.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-7">
                <ParameterControl
                    id="second-order-mass"
                    label="Mass (m)"
                    value={parameters.m}
                    min={0.1}
                    max={10}
                    step={0.1}
                    unit="kg"
                    description="Must remain positive"
                    onChange={(value) => onParameterChange('m', value)}
                />

                <ParameterControl
                    id="second-order-damping"
                    label="Damping (b)"
                    value={parameters.b}
                    min={0}
                    max={20}
                    step={0.1}
                    unit="N·s/m"
                    description="Zero damping is allowed"
                    onChange={(value) => onParameterChange('b', value)}
                />

                <ParameterControl
                    id="second-order-stiffness"
                    label="Stiffness (k)"
                    value={parameters.k}
                    min={0.1}
                    max={100}
                    step={0.1}
                    unit="N/m"
                    description="Must remain positive"
                    onChange={(value) => onParameterChange('k', value)}
                />

                <div className="rounded-lg bg-muted/60 p-3">
                    <p className="text-xs font-semibold">Input and initial conditions</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Unit-force step input (1 N), with zero initial displacement
                        and velocity. Physical output is x(t); normalized output is
                        kx(t).
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
