import { PredictionExercise } from '../excercises/prediction-exercise.tsx';

import { SharedChallengeSection } from '@/components/modules/sections/challenge-section';

export function ChallengeSection() {
    return (
        <SharedChallengeSection
            description="Predict the system behavior before revealing the result. Use the concepts from the experiment to evaluate your understanding."
        >
            <PredictionExercise />
        </SharedChallengeSection>
    );
}