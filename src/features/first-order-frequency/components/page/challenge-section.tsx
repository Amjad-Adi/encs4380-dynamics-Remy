import { FrequencyPredictionExercise } from '../excercises/frequency-prediction-exercise.tsx';

import {  SharedChallengeSection } from '@/components/modules/sections/challenge-section';

export function ChallengeSection({ tau }: { tau: number }) {
    return (
        <SharedChallengeSection
            description="Predict how the sensor responds to faster-changing inputs before revealing the comparison."
        >
            <FrequencyPredictionExercise tau={tau} />
        </SharedChallengeSection>
    );
}