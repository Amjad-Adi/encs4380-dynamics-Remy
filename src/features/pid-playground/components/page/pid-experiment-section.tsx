import type { ComponentProps } from 'react';
import { SharedExperimentSection } from '@/components/modules/sections/experiment-section';
import type { PIDResponsePoint } from '@/features/pid-playground/domain/pid-playground';
import { PIDBlockDiagram } from '../analysis/pid-block-diagram';
import { PIDControls } from '../controls/pid-controls';
import { ClosedLoopResponseCharts } from '@/features/control/components/closed-loop-response-charts';
import { getPlaygroundLimits } from '@/features/pid-playground/domain/pid-playground';

type PIDControlsProps = ComponentProps<typeof PIDControls>;
interface PIDExperimentSectionProps extends PIDControlsProps {
    points: PIDResponsePoint[];
}
export function PIDExperimentSection(props: PIDExperimentSectionProps) {
    return (
        <SharedExperimentSection
            description="Tune the plant and PID gains. The numerical closed-loop simulation, response plots, control signal, and performance metrics update whenever a parameter changes."
            controls={<PIDControls {...props} />}
            analysis={
                <div className="space-y-4">
                    <PIDBlockDiagram plantType={props.parameters.plantType} />
                    <ClosedLoopResponseCharts
                        points={props.points}
                        limits={getPlaygroundLimits(props.parameters)}
                    />
                </div>
            }
        />
    );
}
