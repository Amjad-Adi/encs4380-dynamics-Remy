import { BadgeCheck, BookOpen, LayoutGrid } from 'lucide-react';

import { Equation } from '@/components/modules/equation';
import { ModuleCard } from '@/components/modules/module-card';
import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionHeading } from '@/components/modules/section-heading';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { DYNAMICS_MODULES } from '@/models/modules';

import { DYNAMICS_OVERVIEW_SECTIONS } from '../components/dynamics-overview-sections';
import { ValidationSummary } from '../components/validation-summary';

/** What each module covers, and where Homework 2 builds on it. */
const MODULE_TAGS: Record<string, string[]> = {
    '/dynamics/time-response': ['Step & ramp', 'Validation 1–2', 'Plant in Control 01–04'],
    '/dynamics/frequency-response': ['Bode plots', 'Dynamic error', 'Validation 3–5'],
    '/dynamics/second-order': ['State space', 'Validation 6–8', 'Plant in Control 01–03'],
    '/dynamics/sensor-challenge': ['Noisy step data', 'Estimation', 'Plants in Control 04'],
    '/dynamics/pole-explorer': ['s-plane', 'Stability'],
    '/dynamics/superposition': ['Multi-tone input', 'Attenuation & lag'],
    '/dynamics/numerical-ode': ['Euler vs RK4', 'Solver in every Control module'],
};

const CORE_MODELS = [
    {
        title: 'First-order sensor',
        source: 'Module 01',
        equations: [
            String.raw`G(s)=\frac{K}{\tau s+1}`,
            String.raw`y(t)=KA\left(1-e^{-t/\tau}\right)`,
        ],
        description: 'Time constant τ sets the 63.2% point, the 3τ settling and the ramp lag.',
    },
    {
        title: 'Frequency response',
        source: 'Modules 02 & 06',
        equations: [
            String.raw`M=\frac{1}{\sqrt{1+(\omega\tau)^2}}`,
            String.raw`\phi=-\tan^{-1}(\omega\tau)`,
        ],
        description:
            'Amplitude ratio and phase lag of each input frequency; superposition sums them term by term.',
    },
    {
        title: 'Second-order system',
        source: 'Modules 03 & 05',
        equations: [
            String.raw`G(s)=\frac{K\omega_n^2}{s^2+2\zeta\omega_ns+\omega_n^2}`,
            String.raw`m\ddot x+b\dot x+kx=F`,
        ],
        description:
            'Damping ratio and natural frequency place the poles; the mass–spring–damper gives the state space.',
    },
    {
        title: 'Numerical methods',
        source: 'Module 07',
        equations: [String.raw`x_{n+1}=x_n+\tfrac{h}{6}(k_1+2k_2+2k_3+k_4)`],
        description:
            'Euler and RK4 against the exact solution; the same RK4 step drives every Homework 2 simulation.',
    },
];

export default function DynamicsOverviewPage() {
    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    badge="HOMEWORK 1"
                    systemType="Measurement systems"
                    title="Dynamic characteristics"
                    description="How sensors respond in time and frequency. Seven modules take first- and second-order measurement systems from their analytic responses to sensor identification and numerical simulation, and every validation case from the homework is checked live."
                    live={false}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={DYNAMICS_OVERVIEW_SECTIONS} />
            </Reveal>

            <Reveal>
                <section id="modules" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Modules" icon={LayoutGrid} />
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {DYNAMICS_MODULES.map((module) => (
                            <ModuleCard
                                key={module.path}
                                module={module}
                                tags={MODULE_TAGS[module.path]}
                            />
                        ))}
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section id="core-models" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Core models" icon={BookOpen} />
                    <p className="text-muted-foreground max-w-3xl text-sm leading-6">
                        The models these modules are built on. Homework 2 reuses them directly as
                        its plants, sensor and solver.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {CORE_MODELS.map((item) => (
                            <Card key={item.title} className="min-w-0">
                                <CardContent className="flex h-full flex-col gap-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                            {item.title}
                                        </p>
                                        <Badge variant="outline" className="text-[10px]">
                                            {item.source}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        {item.equations.map((expression) => (
                                            <Equation
                                                key={expression}
                                                expression={expression}
                                                className="py-1"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mt-auto text-xs leading-5">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section id="validation" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Validation" icon={BadgeCheck} />
                    <ValidationSummary />
                </section>
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
