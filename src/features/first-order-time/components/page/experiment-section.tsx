import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '@/features/first-order-time/domain/first-order-time';

import { ExperimentControls } from '../controls/experiment-controls.tsx';
import { ResponseAnalysis } from '../analysis/response-analysis.tsx';

import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';

interface ExperimentSectionProps {
    parameters: FirstOrderParameters;
    inputType: FirstOrderInputType;
    rampError: number;
    rampLag: number;
    onParameterChange: (
        key: keyof FirstOrderParameters,
        value: number,
    ) => void;
    onInputTypeChange: (type: FirstOrderInputType) => void;
    onReset: () => void;
}

export function ExperimentSection({
                                      parameters,
                                      inputType,
                                      rampError,
                                      rampLag,
                                      onParameterChange,
                                      onInputTypeChange,
                                      onReset,
                                  }: ExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Modify the system parameters and input type. The response visualization and calculated results update as you make changes."
            controls={
                <ExperimentControls
                    parameters={parameters}
                    inputType={inputType}
                    onParameterChange={onParameterChange}
                    onInputTypeChange={onInputTypeChange}
                    onReset={onReset}
                />
            }
            analysis={
                <ResponseAnalysis
                    parameters={parameters}
                    inputType={inputType}
                    rampError={rampError}
                    rampLag={rampLag}
                />
            }
        />
    );
}