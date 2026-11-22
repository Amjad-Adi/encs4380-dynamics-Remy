import type { ComponentProps } from 'react';
import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';
import type {
    PIDPlaygroundParameters,
    PIDResponsePoint,
} from '@/features/pid-playground/domain/pid-playground';
import type { TuningSpec } from '@/features/tuning-challenge/domain/tuning-challenge';
import { TuningControls } from '../controls/tuning-controls';
import { TuningResponseChart } from '../charts/tuning-response-chart';

type TuningControlsProps = ComponentProps<typeof TuningControls>;
interface TuningExperimentSectionProps extends TuningControlsProps {
    parameters: PIDPlaygroundParameters;
    points: PIDResponsePoint[];
    spec: TuningSpec;
}
export function TuningExperimentSection(props: TuningExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Tune the PID gains for the hidden plant. The closed loop is simulated numerically and the response, control signal, and spec results update whenever a gain changes."
            controls={<TuningControls {...props} />}
            analysis={
                <TuningResponseChart
                    parameters={props.parameters}
                    points={props.points}
                    spec={props.spec}
                />
            }
        />
    );
}
