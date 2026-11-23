import { ParameterControl } from '@/components/shared/parameter-control';
import { Button } from '@/components/ui/button';
import {
    PLANT_PARAMETER_RANGES,
    getSecondOrderCharacteristics,
    type PlantParameterKey,
    type PlantSelection,
    type PlantType,
} from '@/features/control/domain';

interface PlantModelControlsProps {
    /** Prefix for element ids so several panels can share a page. */
    idPrefix: string;
    selection: PlantSelection;
    onPlantTypeChange: (plantType: PlantType) => void;
    onPlantParameterChange: (key: PlantParameterKey, value: number) => void;
    /** Label for τ; P2 uses τp to tell it apart from the sensor's τs. */
    tauLabel?: string;
}

const PLANT_OPTIONS: { value: PlantType; label: string }[] = [
    { value: 'first-order', label: 'First order' },
    { value: 'second-order', label: 'Second order' },
];

/**
 * Plant selector shared by P1, P2 and P3: the Module 1 first-order plant K/(τs + 1)
 * or the Module 3 mass–spring–damper 1/(ms² + bs + k).
 */
export function PlantModelControls({
    idPrefix,
    selection,
    onPlantTypeChange,
    onPlantParameterChange,
    tauLabel = 'Time constant (τ)',
}: PlantModelControlsProps) {
    const control = (key: PlantParameterKey, label: string, unit: string, description?: string) => {
        const value =
            key === 'gain' || key === 'tau'
                ? selection.firstOrder[key]
                : selection.secondOrder[key];
        return (
            <ParameterControl
                id={`${idPrefix}-plant-${key}`}
                label={label}
                value={value}
                {...PLANT_PARAMETER_RANGES[key]}
                unit={unit}
                description={description}
                onChange={(next) => onPlantParameterChange(key, next)}
            />
        );
    };

    const { omegaN, zeta } = getSecondOrderCharacteristics(selection.secondOrder);

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <p className="text-sm font-medium" id={`${idPrefix}-plant-model-label`}>
                    Plant model
                </p>
                <div
                    className="grid grid-cols-2 gap-2"
                    role="group"
                    aria-labelledby={`${idPrefix}-plant-model-label`}
                >
                    {PLANT_OPTIONS.map((option) => (
                        <Button
                            key={option.value}
                            type="button"
                            variant={selection.plantType === option.value ? 'default' : 'outline'}
                            aria-pressed={selection.plantType === option.value}
                            onClick={() => onPlantTypeChange(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {selection.plantType === 'first-order' ? (
                <div className="space-y-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        First-order plant · Module 1
                    </p>
                    {control('gain', 'Plant gain (K)', '-', 'Steady-state gain')}
                    {control('tau', tauLabel, 's', 'Open-loop response speed')}
                </div>
            ) : (
                <div className="space-y-6">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Second-order plant · Module 3
                    </p>
                    {control('m', 'Mass (m)', 'kg')}
                    {control('b', 'Damping (b)', 'N·s/m')}
                    {control('k', 'Stiffness (k)', 'N/m')}
                    <p className="bg-muted/50 text-muted-foreground rounded-lg px-3 py-2 font-mono text-xs">
                        ωn = {omegaN.toFixed(3)} rad/s · ζ = {zeta.toFixed(3)} · K = 1/k ={' '}
                        {(1 / selection.secondOrder.k).toFixed(3)}
                    </p>
                </div>
            )}
        </div>
    );
}
