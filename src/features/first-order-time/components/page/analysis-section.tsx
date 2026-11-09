import { Activity } from 'lucide-react';

import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '@/features/first-order-time/domain/first-order-time';

import { StepValidation } from '../analysis/step-validation.tsx';
import { RampAnalysis } from '../analysis/ramp-analysis.tsx';
import { ErrorFractionAnalysis } from '../analysis/error-fraction-analysis.tsx';

import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';

interface AnalysisSectionProps {
    inputType: FirstOrderInputType;
    parameters: FirstOrderParameters;
    validation: ReturnType<
        typeof import('@/features/first-order-time/domain/first-order-time').getStepValidation
    >;
    rampError: number;
    rampLag: number;
}

export function AnalysisSection({
                                    inputType,
                                    parameters,
                                    validation,
                                    rampError,
                                    rampLag,
                                }: AnalysisSectionProps) {
    const isStep = inputType === 'step';

    return (
        <SharedAnalysisSection
            title={isStep ? 'Step response analysis' : 'Ramp response analysis'}
            description={
                isStep
                    ? 'The final value KA and the responses at τ and 3τ define the step behavior, while the error fraction decays exponentially.'
                    : 'A first-order sensor cannot track a ramp perfectly; its steady-state error and equivalent lag are both set by τ.'
            }
            icon={Activity}
            className="space-y-5"
        >
            {isStep ? (
                <div className="space-y-5">
                    <StepValidation
                        results={validation}
                        parameters={parameters}
                    />

                    <ErrorFractionAnalysis tau={parameters.tau} />
                </div>
            ) : (
                <RampAnalysis
                    rampError={rampError}
                    rampLag={rampLag}
                />
            )}
        </SharedAnalysisSection>
    );
}