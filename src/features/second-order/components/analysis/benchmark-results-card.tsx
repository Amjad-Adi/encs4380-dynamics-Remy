import { ClipboardCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { FixedCheck } from './benchmark-checks';

interface BenchmarkResultsCardProps {
    checks: FixedCheck[];
}

export function BenchmarkResultsCard({ checks }: BenchmarkResultsCardProps) {
    const allChecksPassed = checks.every((check) => check.passed);

    return (
        <Card className="min-w-0">
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base">
                            Fixed benchmark results: m=1, b=2, k=4
                        </CardTitle>

                        <CardDescription className="mt-1">
                            Assignment reference checks; these values are fixed and do not change
                            with interactive parameters.
                        </CardDescription>
                    </div>

                    <Badge
                        variant="outline"
                        className={
                            allChecksPassed
                                ? 'border-success/30 bg-success/5 text-success'
                                : 'border-destructive/30 bg-destructive/5 text-destructive'
                        }
                    >
                        <ClipboardCheck />
                        {allChecksPassed ? 'PASS' : 'FAIL'}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                {checks.map((check) => (
                    <div
                        key={check.label}
                        className="border-border flex flex-col justify-between gap-2 rounded-lg border p-3 sm:flex-row sm:items-center"
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-medium">{check.label}</p>

                            <p className="text-muted-foreground mt-1 text-xs">
                                Expected: {check.expected}
                            </p>

                            <p className="text-muted-foreground text-xs">
                                Calculated: {check.calculated}
                            </p>
                        </div>

                        <Badge
                            variant="outline"
                            className={
                                check.passed
                                    ? 'border-success/30 bg-success/5 text-success w-fit'
                                    : 'border-destructive/30 bg-destructive/5 text-destructive w-fit'
                            }
                        >
                            {check.passed ? 'PASS' : 'FAIL'}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
