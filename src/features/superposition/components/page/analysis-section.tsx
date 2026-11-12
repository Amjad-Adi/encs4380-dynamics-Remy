import { useMemo } from 'react';
import { ClipboardCheck } from 'lucide-react';

import { ValidationChecks } from '@/components/modules/validation-checks';
import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import {
    getSuperpositionValidation,
    type SuperpositionConfiguration,
} from '@/features/superposition/domain/superposition';

interface AnalysisSectionProps {
    configuration: SuperpositionConfiguration;
}

export function AnalysisSection({ configuration }: AnalysisSectionProps) {
    const checks = useMemo(
        () =>
            getSuperpositionValidation(configuration).map((result) => ({
                label: result.label,
                expected: `${result.expected.toFixed(4)} ${result.unit}`,
                calculated: `${result.actual < 1e-3 && result.actual > 0 ? result.actual.toExponential(2) : result.actual.toFixed(4)} ${result.unit}`,
                passed: result.passed,
            })),
        [configuration],
    );

    return (
        <SharedAnalysisSection
            title="Model validation checks"
            description="The first two checks run on your current signal: the analytical superposition solution is compared with a direct Runge-Kutta integration of τ dy/dt + y = K x(t). The remaining checks reproduce the lecture frequency-response values."
            icon={ClipboardCheck}
        >
            <ValidationChecks checks={checks} />
        </SharedAnalysisSection>
    );
}
