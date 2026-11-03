import { Activity } from 'lucide-react';

import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '../../models/first-order-time';

import { StepValidation } from '../step-validation';
import { RampAnalysis } from '../ramp-analysis';
import { ErrorFractionAnalysis } from '../error-fraction-analysis';

import { SectionHeading } from './section-heading';

interface AnalysisSectionProps {
    inputType: FirstOrderInputType;
    parameters: FirstOrderParameters;
    validation: ReturnType<
        typeof import('../../models/first-order-time').getStepValidation
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
    return (
        <section
            id="analysis"
            className="scroll-mt-24 space-y-5"
        >
            <SectionHeading
                title={
                    inputType === 'step'
                        ? 'Step response analysis'
                        : 'Ramp response analysis'
                }
                icon={Activity}
            />

            {inputType === 'step' ? (
                <div className="space-y-5">
                    <StepValidation results={validation} />

                    <ErrorFractionAnalysis
                        tau={parameters.tau}
                    />
                </div>
            ) : (
                <RampAnalysis
                    rampError={rampError}
                    rampLag={rampLag}
                />
            )}
        </section>
    );
}