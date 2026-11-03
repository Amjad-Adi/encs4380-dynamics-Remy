import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
} from '@/components/ui/card';

import type { getStepValidation } from '../models/first-order-time';

type ValidationResults = ReturnType<typeof getStepValidation>;

interface StepValidationProps {
    results: ValidationResults;
}

export function StepValidation({
                                   results,
                               }: StepValidationProps) {
    return (
        <section className="space-y-4">
        <div>
            <h2 className="text-xl font-semibold">
            Step response validation
    </h2>

    <p className="mt-1 text-sm text-muted-foreground">
        Verify the characteristic response values at τ and 3τ.
    </p>
    </div>

    <div className="grid gap-3 md:grid-cols-2">
        {results.map((result) => (
                <Card key={result.label}>
                <CardContent className="flex items-start justify-between gap-4 p-4">
                <div>
                    <p className="font-medium">{result.label}</p>

                    <p className="mt-2 font-mono text-sm">
                Expected: {result.expected.toFixed(4)}
    </p>

    <p className="font-mono text-sm">
        Calculated: {result.actual.toFixed(4)}
    </p>
    </div>

    <Badge
    variant={result.passed ? 'default' : 'destructive'}
        >
        {result.passed ? 'PASS' : 'FAIL'}
        </Badge>
        </CardContent>
        </Card>
))}
    </div>
    </section>
);
}