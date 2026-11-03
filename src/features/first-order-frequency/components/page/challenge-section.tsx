import { Gauge } from 'lucide-react';

import { FrequencyPredictionExercise } from '../frequency-prediction-exercise';
import { SectionHeading } from './section-heading';

export function ChallengeSection({ tau }: { tau: number }) {
    return (
        <section id="challenge" className="scroll-mt-24 space-y-3">
            <SectionHeading title="Test your understanding" icon={Gauge} />
            <p className="text-sm leading-6 text-muted-foreground">
                Predict how the sensor responds to faster-changing inputs before
                revealing the comparison.
            </p>
            <FrequencyPredictionExercise tau={tau} />
        </section>
    );
}
