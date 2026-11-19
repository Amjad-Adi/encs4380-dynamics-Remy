import { SharedChallengeSection } from '@/components/modules/sections/challenge-section.tsx';

import type { SlowSensorPIDParameters } from '../../domain/slow-sensor-pid.ts';
import { PredictionExercise } from '../exercises/prediction-exercise.tsx';

interface ChallengeSectionProps {
    parameters: SlowSensorPIDParameters;
}

export function ChallengeSection({ parameters }: ChallengeSectionProps) {
    return (
        <SharedChallengeSection description="Predict how doubling the sensor time constant changes feedback lag, true-output overshoot, and oscillatory behavior. Check your prediction against a second simulation.">
            <PredictionExercise parameters={parameters} />
        </SharedChallengeSection>
    );
}
