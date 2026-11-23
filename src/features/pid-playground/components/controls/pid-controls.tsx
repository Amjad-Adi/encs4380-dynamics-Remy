import { RotateCcw } from 'lucide-react';

import { ParameterControl } from '@/components/shared/parameter-control';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PIDGainControls } from '@/features/control/components/pid-gain-controls';
import { PlantModelControls } from '@/features/control/components/plant-model-controls';
import type { PlantParameterKey } from '@/features/control/domain';
import type {
    PIDPlaygroundParameters,
    PlantType,
} from '@/features/pid-playground/domain/pid-playground';

interface PIDControlsProps {
    parameters: PIDPlaygroundParameters;
    onPlantTypeChange: (type: PlantType) => void;
    onParameterChange: (key: keyof PIDPlaygroundParameters['gains'], value: number) => void;
    onPlantParameterChange: (key: PlantParameterKey, value: number) => void;
    onSetpointChange: (value: number) => void;
    onOutputLimitChange: (key: 'outputMin' | 'outputMax', value: number) => void;
    onReset: () => void;
}

export function PIDControls({
    parameters,
    onPlantTypeChange,
    onParameterChange,
    onPlantParameterChange,
    onSetpointChange,
    onOutputLimitChange,
    onReset,
}: PIDControlsProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Controller and plant</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        aria-label="Reset PID experiment"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
                <CardDescription>
                    Choose a plant, then tune its feedback controller.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-7">
                <PlantModelControls
                    idPrefix="pid"
                    selection={parameters}
                    onPlantTypeChange={onPlantTypeChange}
                    onPlantParameterChange={onPlantParameterChange}
                />
                <div className="border-t pt-6">
                    <PIDGainControls
                        idPrefix="pid"
                        gains={parameters.gains}
                        onGainChange={onParameterChange}
                    />
                </div>
                <div className="space-y-6 border-t pt-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Reference and actuator
                    </p>
                    <ParameterControl
                        id="pid-setpoint"
                        label="Setpoint"
                        value={parameters.setpoint}
                        min={0.1}
                        max={5}
                        step={0.1}
                        unit="units"
                        onChange={onSetpointChange}
                    />
                    <ParameterControl
                        id="pid-output-min"
                        label="Minimum control output"
                        value={parameters.outputMin}
                        min={-100}
                        max={0}
                        step={1}
                        unit="units"
                        onChange={(value) => onOutputLimitChange('outputMin', value)}
                    />
                    <ParameterControl
                        id="pid-output-max"
                        label="Maximum control output"
                        value={parameters.outputMax}
                        min={1}
                        max={100}
                        step={1}
                        unit="units"
                        onChange={(value) => onOutputLimitChange('outputMax', value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
