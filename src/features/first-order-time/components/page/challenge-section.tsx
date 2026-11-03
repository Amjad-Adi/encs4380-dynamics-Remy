import { Gauge } from 'lucide-react';

import { PredictionExercise } from '../prediction-exercise';

import { SectionHeading } from './section-heading';

export function ChallengeSection() {
    return (
        <section
            id="challenge"
    className="scroll-mt-24 space-y-3"
    >
    <SectionHeading
        title="Test your understanding"
    icon={Gauge}
    />

    <p className="text-sm leading-6 text-muted-foreground">
        Predict the system behavior before revealing the result.
        Use the concepts from the experiment to evaluate your
    understanding.
    </p>

    <PredictionExercise />
    </section>
);
}