import { ClipboardCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { getFrequencyValidation } from '@/features/first-order-frequency/domain/first-order-frequency';

import {  SharedAnalysisSection } from '@/components/modules/sections/analysis-section';

export function AnalysisSection() {
    const results = getFrequencyValidation();

    return (
        <SharedAnalysisSection
            title="Lecture validation checks"
            description="These fixed checks reproduce the first-order frequency-response values specified in the homework document."
            icon={ClipboardCheck}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Validation results
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {results.map((result) => (
                        <div
                            key={result.label}
                            className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium">
                                    {result.label}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Expected: {result.expected.toFixed(2)} {result.unit}
                                    {' · '}
                                    Calculated: {result.actual.toFixed(3)} {result.unit}
                                </p>
                            </div>

                            <Badge
                                variant="outline"
                                className={
                                    result.passed
                                        ? 'w-fit border-success/30 bg-success/5 text-success'
                                        : 'w-fit border-destructive/30 bg-destructive/5 text-destructive'
                                }
                            >
                                {result.passed ? 'PASS' : 'CHECK'}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </SharedAnalysisSection>
    );
}