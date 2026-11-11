import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { StateSpaceMatrices } from '@/features/second-order/domain';

interface StateSpaceCardProps {
    matrices: StateSpaceMatrices;
}

export function StateSpaceCard({ matrices }: StateSpaceCardProps) {
    const matrixGroups = [
        { name: 'A', rows: matrices.A },
        { name: 'B', rows: matrices.B },
        { name: 'C', rows: matrices.C },
    ];

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle className="text-base">Physical state-space model</CardTitle>
                <CardDescription>
                    Matrices update from the current mass, damping, and stiffness.
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-3">
                {matrixGroups.map(({ name, rows }) => (
                    <div
                        key={name}
                        className="border-border bg-muted/30 min-w-0 rounded-lg border p-3"
                    >
                        <p className="mb-2 font-mono text-sm font-semibold">{name}</p>

                        <div className="space-y-1 font-mono text-xs tabular-nums">
                            {rows.map((row, rowIndex) => (
                                <p key={`${name}-${rowIndex}`} className="break-all">
                                    [{row.map((value) => value.toFixed(4)).join(', ')}]
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
