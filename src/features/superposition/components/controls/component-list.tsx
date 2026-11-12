import { Plus, Trash2 } from 'lucide-react';

import { Equation } from '@/components/modules/equation';
import { ParameterControl } from '@/components/shared/parameter-control';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getComponentColor,
    getComponentExpression,
    getComponentResponse,
    MAX_AMPLITUDE,
    MAX_OMEGA,
    MAX_PHASE,
    MIN_AMPLITUDE,
    MIN_OMEGA,
    MIN_PHASE,
    toDegrees,
    type SensorParameters,
    type SinusoidComponent,
} from '@/features/superposition/domain/superposition';

interface ComponentListProps {
    components: SinusoidComponent[];
    sensor: SensorParameters;
    onAdd: () => void;
    onRemove: (id: number) => void;
    onChange: (id: number, changes: Partial<Omit<SinusoidComponent, 'id'>>) => void;
}

export function ComponentList({
    components,
    sensor,
    onAdd,
    onRemove,
    onChange,
}: ComponentListProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Sinusoidal components</CardTitle>
                    <Badge variant="outline">{components.length} active</Badge>
                </div>
                <CardDescription>
                    Add as many components as you like. Each one is configured independently.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {components.length === 0 && (
                    <p className="border-border text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                        No components yet. The input is x(t) = 0.
                    </p>
                )}

                {components.map((component) => (
                    <ComponentEditor
                        key={component.id}
                        component={component}
                        sensor={sensor}
                        onRemove={() => onRemove(component.id)}
                        onChange={(changes) => onChange(component.id, changes)}
                    />
                ))}

                <Button type="button" variant="outline" className="w-full gap-2" onClick={onAdd}>
                    <Plus size={15} />
                    Add component
                </Button>
            </CardContent>
        </Card>
    );
}

interface ComponentEditorProps {
    component: SinusoidComponent;
    sensor: SensorParameters;
    onRemove: () => void;
    onChange: (changes: Partial<Omit<SinusoidComponent, 'id'>>) => void;
}

function ComponentEditor({ component, sensor, onRemove, onChange }: ComponentEditorProps) {
    const color = getComponentColor(component.id);
    const response = getComponentResponse(component, sensor);

    return (
        <div
            className="border-border space-y-5 rounded-lg border border-l-4 p-3"
            style={{ borderLeftColor: color }}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <p className="font-mono text-sm font-semibold">x{component.id}(t)</p>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    aria-label={`Remove component x${component.id}`}
                    title="Remove component"
                    className="hover:text-destructive"
                >
                    <Trash2 size={15} />
                </Button>
            </div>

            <div className="bg-muted/60 rounded-md px-2 text-sm">
                <Equation expression={getComponentExpression(component, component.id)} />
            </div>

            <ParameterControl
                id={`component-${component.id}-amplitude`}
                label="Amplitude (A)"
                value={component.amplitude}
                min={MIN_AMPLITUDE}
                max={MAX_AMPLITUDE}
                step={0.1}
                unit=""
                onChange={(amplitude) => onChange({ amplitude })}
            />

            <ParameterControl
                id={`component-${component.id}-omega`}
                label="Frequency (ω)"
                value={component.omega}
                min={MIN_OMEGA}
                max={MAX_OMEGA}
                step={0.1}
                unit="rad/s"
                onChange={(omega) => onChange({ omega })}
            />

            <ParameterControl
                id={`component-${component.id}-phase`}
                label="Phase (φ)"
                value={component.phase}
                min={MIN_PHASE}
                max={MAX_PHASE}
                step={0.01}
                unit="rad"
                description={`${toDegrees(component.phase).toFixed(1)}°`}
                onChange={(phase) => onChange({ phase })}
            />

            <div className="text-muted-foreground grid grid-cols-2 gap-2 font-mono text-xs">
                <span>M = {response.magnitude.toFixed(4)}</span>
                <span>φ = {response.phaseLagDegrees.toFixed(2)}°</span>
            </div>
        </div>
    );
}
