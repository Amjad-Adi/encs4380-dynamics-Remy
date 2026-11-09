import { ClipboardCheck } from 'lucide-react';

import { SectionHeading } from '@/components/modules/section-heading';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export interface ValidationCheck {
    label: string;
    expected: string;
    calculated: string;
    passed: boolean;
}

interface ValidationChecksProps {
    checks: ValidationCheck[];
    title?: string;
}

interface ValidationSectionProps {
    checks: ValidationCheck[];
    description: string;
}

const PASS_BADGE_CLASS =
    'w-fit border-success/30 bg-success/5 text-success';

const FAIL_BADGE_CLASS =
    'w-fit border-destructive/30 bg-destructive/5 text-destructive';

export function ValidationChecks({
                                     checks,
                                     title = 'Validation results',
                                 }: ValidationChecksProps) {
    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {checks.map((check) => (
                    <div
                        key={check.label}
                        className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center"
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-medium">
                                {check.label}
                            </p>

                            <p className="mt-1 break-words text-xs text-muted-foreground">
                                Expected: {check.expected}
                                {' · '}
                                Your value: {check.calculated}
                            </p>
                        </div>

                        <Badge
                            variant="outline"
                            className={
                                check.passed
                                    ? PASS_BADGE_CLASS
                                    : FAIL_BADGE_CLASS
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

export function ValidationSection({
                                      checks,
                                      description,
                                  }: ValidationSectionProps) {
    return (
        <section className="space-y-3">
            <SectionHeading
                title="Lecture validation checks"
                icon={ClipboardCheck}
            />

            <p className="text-sm leading-6 text-muted-foreground">
                {description}
            </p>

            <ValidationChecks checks={checks} />
        </section>
    );
}
