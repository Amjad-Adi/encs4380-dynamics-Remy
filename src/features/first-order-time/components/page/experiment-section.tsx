import { SlidersHorizontal } from 'lucide-react';

import type {
    FirstOrderInputType,
    FirstOrderParameters,
} from '../../models/first-order-time';

import { ExperimentControls } from '../experiment-controls';
import { ResponseAnalysis } from '../response-analysis';

import { SectionHeading } from './section-heading';

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
        <section
            id="experiment"
            className="scroll-mt-24 space-y-3"
        >
            <SectionHeading
                title="Interactive experiment"
                icon={SlidersHorizontal}
            />

            <p className="text-sm leading-6 text-muted-foreground">
                Modify the system parameters and input type. The response
                visualization and calculated results update as you make
                changes.
            </p>

            <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="min-w-0">
                    <ExperimentControls
                        parameters={parameters}
                        inputType={inputType}
                        onParameterChange={onParameterChange}
                        onInputTypeChange={onInputTypeChange}
                        onReset={onReset}
                    />
                </div>

                <div className="min-w-0">
                    <ResponseAnalysis
                        parameters={parameters}
                        inputType={inputType}
                        rampError={rampError}
                        rampLag={rampLag}
                    />
                </div>
            </div>
        </section>
    );
}