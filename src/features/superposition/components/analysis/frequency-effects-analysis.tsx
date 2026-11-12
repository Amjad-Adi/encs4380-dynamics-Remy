import { Equation } from '@/components/modules/equation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    getComponentColor,
    getComponentResponse,
    getOutputExpression,
    type SuperpositionConfiguration,
} from '@/features/superposition/domain/superposition';
import { AttenuationChart } from '../charts/attenuation-chart';

interface FrequencyEffectsAnalysisProps {
    configuration: SuperpositionConfiguration;
}

export function FrequencyEffectsAnalysis({ configuration }: FrequencyEffectsAnalysisProps) {
    const { components, sensor } = configuration;

    // Sort by frequency so the growing attenuation and lag read top to bottom.
    const rows = [...components]
        .sort((a, b) => a.omega - b.omega)
        .map((component) => ({
            component,
            response: getComponentResponse(component, sensor),
        }));

    return (
        <div className="min-w-0 space-y-4">
            <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-base">
                                Steady-state effect on each component
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Sorted by frequency. Higher ω gives a smaller amplitude ratio and a
                                larger phase lag.
                            </CardDescription>
                        </div>
                        <Badge variant="outline">ωc = {(1 / sensor.tau).toFixed(3)} rad/s</Badge>
                    </div>
                </CardHeader>
                <CardContent className="min-w-0">
                    {rows.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center text-sm">
                            No components to analyze.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Component</TableHead>
                                    <TableHead className="text-right">ω (rad/s)</TableHead>
                                    <TableHead className="text-right">ωτ</TableHead>
                                    <TableHead className="text-right">M</TableHead>
                                    <TableHead className="text-right">φ (°)</TableHead>
                                    <TableHead className="text-right">Input A</TableHead>
                                    <TableHead className="text-right">Output K·A·M</TableHead>
                                    <TableHead className="text-right">Time lag (s)</TableHead>
                                    <TableHead>Steady-state output</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map(({ component, response }) => (
                                    <TableRow key={component.id}>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-2 font-mono font-semibold">
                                                <span
                                                    className="size-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor: getComponentColor(
                                                            component.id,
                                                        ),
                                                    }}
                                                />
                                                x{component.id}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {component.omega.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {response.omegaTau.toFixed(3)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {response.magnitude.toFixed(4)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {response.phaseLagDegrees.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {response.inputAmplitude.toFixed(3)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {response.outputAmplitude.toFixed(3)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {response.timeLag.toFixed(3)}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            <Equation
                                                expression={getOutputExpression(
                                                    component,
                                                    sensor,
                                                    component.id,
                                                )}
                                                displayMode={false}
                                                className="py-0"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-base">Amplitude ratio and phase lag</CardTitle>
                    <CardDescription className="mt-1">
                        Each component sits at its own frequency on the sensor response curves.
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                    <AttenuationChart components={components} sensor={sensor} />
                    <p className="text-muted-foreground mt-1 text-xs leading-5">
                        Blue: amplitude ratio M(ω) · orange dashed: phase lag φ(ω) · circles and
                        diamonds: active components · grey dashed: cutoff ωc = 1/τ, where M = 0.7071
                        and φ = −45°.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
