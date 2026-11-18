import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParameterControl } from '@/components/shared/parameter-control';
import type {
    PIDPlaygroundParameters,
    PlantType,
} from '@/features/pid-playground/domain/pid-playground';

interface PIDControlsProps {
    parameters: PIDPlaygroundParameters;
    onPlantTypeChange: (type: PlantType) => void;
    onParameterChange: (key: keyof PIDPlaygroundParameters['gains'], value: number) => void;
    onPlantParameterChange: (key: 'gain' | 'tau' | 'm' | 'b' | 'k', value: number) => void;
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
                <div className="space-y-3">
                    <p className="text-sm font-medium">Plant model</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant={parameters.plantType === 'first-order' ? 'default' : 'outline'}
                            onClick={() => onPlantTypeChange('first-order')}
                            aria-pressed={parameters.plantType === 'first-order'}
                        >
                            First order
                        </Button>
                        <Button
                            type="button"
                            variant={
                                parameters.plantType === 'second-order' ? 'default' : 'outline'
                            }
                            onClick={() => onPlantTypeChange('second-order')}
                            aria-pressed={parameters.plantType === 'second-order'}
                        >
                            Second order
                        </Button>
                    </div>
                </div>
                {parameters.plantType === 'first-order' ? (
                    <div className="space-y-6">
                        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            First-order plant
                        </p>
                        <ParameterControl
                            id="pid-plant-gain"
                            label="Plant gain (K)"
                            value={parameters.firstOrder.gain}
                            min={0.1}
                            max={5}
                            step={0.1}
                            unit="-"
                            description="Steady-state gain"
                            onChange={(value) => onPlantParameterChange('gain', value)}
                        />
                        <ParameterControl
                            id="pid-plant-tau"
                            label="Time constant (τ)"
                            value={parameters.firstOrder.tau}
                            min={0.1}
                            max={5}
                            step={0.1}
                            unit="s"
                            description="Open-loop response speed"
                            onChange={(value) => onPlantParameterChange('tau', value)}
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Second-order plant
                        </p>
                        <ParameterControl
                            id="pid-plant-mass"
                            label="Mass (m)"
                            value={parameters.secondOrder.m}
                            min={0.1}
                            max={10}
                            step={0.1}
                            unit="kg"
                            onChange={(value) => onPlantParameterChange('m', value)}
                        />
                        <ParameterControl
                            id="pid-plant-damping"
                            label="Damping (b)"
                            value={parameters.secondOrder.b}
                            min={0}
                            max={20}
                            step={0.1}
                            unit="N·s/m"
                            onChange={(value) => onPlantParameterChange('b', value)}
                        />
                        <ParameterControl
                            id="pid-plant-stiffness"
                            label="Stiffness (k)"
                            value={parameters.secondOrder.k}
                            min={0.1}
                            max={100}
                            step={0.1}
                            unit="N/m"
                            onChange={(value) => onPlantParameterChange('k', value)}
                        />
                    </div>
                )}
                <div className="space-y-6 border-t pt-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        PID gains
                    </p>
                    <ParameterControl
                        id="pid-kp"
                        label={<>Proportional gain-Kp</>}
                        ariaLabel="Proportional gain Kp"
                        value={parameters.gains.kp}
                        min={0}
                        max={30}
                        step={0.1}
                        unit="-"
                        description="Acts on present error"
                        onChange={(value) => onParameterChange('kp', value)}
                    />
                    <ParameterControl
                        id="pid-ki"
                        label={<>Integral gain-Ki</>}
                        ariaLabel="Integral gain Ki"
                        value={parameters.gains.ki}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="1/s"
                        description="Accumulates past error"
                        onChange={(value) => onParameterChange('ki', value)}
                    />
                    <ParameterControl
                        id="pid-kd"
                        label={<>Derivative gain-Kd</>}
                        ariaLabel="Derivative gain Kd"
                        value={parameters.gains.kd}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="s"
                        description="Responds to error change"
                        onChange={(value) => onParameterChange('kd', value)}
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
