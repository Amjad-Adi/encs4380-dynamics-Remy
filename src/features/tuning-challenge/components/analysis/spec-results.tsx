import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    describeHiddenPlant,
    type HiddenPlant,
    type TuningEvaluation,
} from '@/features/tuning-challenge/domain/tuning-challenge';

export function SpecResults({
    evaluation,
    plant,
}: {
    evaluation: TuningEvaluation;
    plant: HiddenPlant;
}) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">Specification check</CardTitle>
                    <div className="flex items-center gap-2">
                        <Trophy className="text-primary size-4" />
                        <span className="font-mono text-xl font-semibold tabular-nums">
                            {evaluation.score}
                        </span>
                        <span className="text-muted-foreground text-xs">/ 100</span>
                    </div>
                </div>
                <CardDescription>
                    Each part is judged independently from the simulated response.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {evaluation.results.map((result) => (
                    <div
                        key={result.key}
                        className="bg-muted/50 flex items-start gap-3 rounded-lg p-3"
                    >
                        {result.pass ? (
                            <CheckCircle2 className="text-success mt-0.5 size-4 shrink-0" />
                        ) : (
                            <XCircle className="text-destructive mt-0.5 size-4 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1 space-y-1 text-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-medium">{result.label}</p>
                                <Badge variant={result.pass ? 'default' : 'destructive'}>
                                    {result.pass ? 'PASS' : 'FAIL'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-5">
                                Measured{' '}
                                <span className="text-foreground font-mono">
                                    {result.measured === null
                                        ? 'not reached'
                                        : `${result.measured.toFixed(2)} ${result.unit}`}
                                </span>
                                <span className="mx-2">·</span>Limit ≤{' '}
                                <span className="text-foreground font-mono">
                                    {result.limit} {result.unit}
                                </span>
                                <span className="mx-2">·</span>
                                {result.points.toFixed(1)} / {result.maxPoints.toFixed(1)} points
                            </p>
                        </div>
                    </div>
                ))}
                <div
                    className={[
                        'rounded-lg border p-3 text-sm',
                        evaluation.allPassed
                            ? 'border-success/30 bg-success/5'
                            : 'border-border bg-muted/40',
                    ].join(' ')}
                    role="status"
                >
                    {evaluation.allPassed ? (
                        <>
                            <p className="font-medium">Challenge solved - every part passes.</p>
                            <p className="text-muted-foreground mt-1">
                                Hidden plant: {describeHiddenPlant(plant)}
                            </p>
                        </>
                    ) : (
                        <p className="text-muted-foreground">
                            The hidden plant is revealed once all three parts pass.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
