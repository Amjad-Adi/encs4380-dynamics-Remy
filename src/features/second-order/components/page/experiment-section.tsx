import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type {
    PhysicalParameters,
    ResponseMetrics,
} from '@/features/second-order/domain/second-order';
import { SecondOrderControls } from '../controls/second-order-controls';
import { ResponseAnalysis } from '../analysis/response-analysis';

interface ExperimentSectionProps {
    parameters: PhysicalParameters;
    metrics: ResponseMetrics;
    duration: number;
    dampingRatio: number;
    naturalFrequency: number;
    isPredictionSubmitted: boolean;
    onParameterChange: (key: keyof PhysicalParameters, value: number) => void;
    onReset: () => void;
}

export function ExperimentSection({
    parameters,
    metrics,
    duration,
    dampingRatio,
    naturalFrequency,
    isPredictionSubmitted,
    onParameterChange,
    onReset,
}: ExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Change the physical system parameters to observe the live force-step response, response metrics, and pole locations."
            controls={
                <SecondOrderControls
                    parameters={parameters}
                    onParameterChange={onParameterChange}
                    onReset={onReset}
                />
            }
            analysis={
                isPredictionSubmitted ? (
                    <ResponseAnalysis
                        parameters={parameters}
                        metrics={metrics}
                        duration={duration}
                        dampingRatio={dampingRatio}
                        naturalFrequency={naturalFrequency}
                    />
                ) : (
                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Results are hidden until prediction
                            </CardTitle>
                            <CardDescription>
                                Submit your damping-regime and overshoot predictions
                                below to reveal the live response and analysis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Adjust m, b, and k, make both predictions, then check
                            them before reviewing the plots and metrics.
                        </CardContent>
                    </Card>
                )
            }
        />
    );
}
