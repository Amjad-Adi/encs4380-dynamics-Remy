import { ClipboardCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getFrequencyValidation } from '../../models/first-order-frequency';
import { SectionHeading } from './section-heading';

export function AnalysisSection() {
    const results = getFrequencyValidation();

    return (
        <section id="analysis" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Lecture validation checks" icon={ClipboardCheck} />
            <p className="text-sm leading-6 text-muted-foreground">
                These fixed checks reproduce the first-order frequency-response
                values specified in the homework document.
            </p>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Validation results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {results.map((result) => (
                        <div
                            key={result.label}
                            className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium">{result.label}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Expected: {result.expected.toFixed(result.unit === 'ms' ? 2 : 2)} {result.unit}
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
        </section>
    );
}
