import { ClipboardCheck } from 'lucide-react';

import { ValidationChecks } from '@/components/modules/validation-checks';

import { getFrequencyValidation } from '@/features/first-order-frequency/domain/first-order-frequency';

import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';

export function AnalysisSection() {
    const checks = getFrequencyValidation().map((result) => ({
        label: result.label,
        expected: `${result.expected.toFixed(2)} ${result.unit}`,
        calculated: `${result.actual.toFixed(3)} ${result.unit}`,
        passed: result.passed,
    }));

    return (
        <SharedAnalysisSection
            title="Lecture validation checks"
            description="These fixed checks reproduce the first-order frequency-response values specified in the homework document."
            icon={ClipboardCheck}
        >
            <ValidationChecks checks={checks} />
        </SharedAnalysisSection>
    );
}
