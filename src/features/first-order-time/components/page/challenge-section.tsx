import type { FirstOrderInputType } from '@/features/first-order-time/domain/first-order-time.ts';

import { PredictionExercise } from '../excercises/prediction-exercise.tsx';

import { SharedChallengeSection } from '@/components/modules/sections/challenge-section';

interface ChallengeSectionProps {
    inputType: FirstOrderInputType;
}

export function ChallengeSection({
                                     inputType,
                                 }: ChallengeSectionProps) {
    return (
        <SharedChallengeSection
            description="Predict the system behavior before revealing the result. Use the concepts from the experiment to evaluate your understanding."
        >
            <PredictionExercise inputType={inputType} />
        </SharedChallengeSection>
    );
}