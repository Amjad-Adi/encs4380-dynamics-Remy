import { useState } from 'react';
import { Activity, Target } from 'lucide-react';

import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { MetricCard } from '@/components/modules/metric-card';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { Reveal } from '@/components/ui/reveal';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    GuessSensorExercise,
    SensorHints,
} from '@/features/sensor-challenge/components/exercises/guess-sensor-exercise';
import { SENSOR_CHALLENGE_SECTIONS } from '@/features/sensor-challenge/components/page/sensor-challenge-sections';
import { generateSensorChallenge } from '@/features/sensor-challenge/domain/sensor-challenge';

export default function SensorChallengePage() {
    const [challenge, setChallenge] = useState(() => generateSensorChallenge());
    const [roundKey, setRoundKey] = useState(0);
    const [attemptedRounds, setAttemptedRounds] = useState(0);
    const [correctRounds, setCorrectRounds] = useState(0);

    function newSensor() {
        setChallenge(generateSensorChallenge());
        setRoundKey((current) => current + 1);
    }

    function resetSession() {
        setAttemptedRounds(0);
        setCorrectRounds(0);
        newSensor();
    }

    function recordAttempt(earnedCredit: boolean) {
        setAttemptedRounds((current) => current + 1);
        if (earnedCredit) {
            setCorrectRounds((current) => current + 1);
        }
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    moduleNumber="04"
                    systemType="Sensor identification"
                    title="Guess the sensor"
                    description="Use a measured step response to identify a hidden sensor model and estimate its dynamic parameters. Build intuition for time constants, damping, natural frequency, and measurement noise."
                    nextModule={{
                        to: '/second-order',
                        label: '← Return to Module 03: Second-order response',
                    }}
                    onReset={resetSession}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={SENSOR_CHALLENGE_SECTIONS} />
            </Reveal>

            <Reveal>
                <section id="model" className="scroll-mt-24 space-y-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                How to play
                            </CardTitle>
                            <CardDescription>
                                Each round generates a new sensor and a noisy
                                unit-step response. The model and parameter
                                values stay hidden until you commit your
                                prediction.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-6 text-muted-foreground">
                                Choose first- or second-order, estimate τ or
                                both ζ and ωn, then submit. You earn one point
                                when the sensor type is correct and every
                                required parameter is within 10% of its actual
                                value. Compare your predicted curve with the
                                actual response and use the feedback to guide
                                your next estimate.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <MetricCard
                                    label="Full-credit rounds"
                                    value={`${correctRounds} / ${attemptedRounds}`}
                                    detail="Correct sensor type and estimates within 10%"
                                    icon={Target}
                                />
                                <MetricCard
                                    label="Session accuracy"
                                    value={
                                        attemptedRounds === 0
                                            ? '—'
                                            : `${Math.round((correctRounds / attemptedRounds) * 100)}%`
                                    }
                                    detail="Full-credit rounds divided by submitted predictions"
                                    icon={Activity}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </Reveal>

            <Reveal>
                <GuessSensorExercise
                    key={roundKey}
                    challenge={challenge}
                    onSubmit={recordAttempt}
                    onNewSensor={newSensor}
                />
            </Reveal>

            <Reveal>
                <SensorHints />
            </Reveal>

            <Reveal>
                <ModuleFooter
                    assumptions="Simulated unit-step measurements of stable first- and underdamped second-order sensors, with additive Gaussian measurement noise. The normalized response has unit steady-state gain; noise is generated once per round and remains fixed while you inspect the challenge."
                />
            </Reveal>
        </main>
    );
}
