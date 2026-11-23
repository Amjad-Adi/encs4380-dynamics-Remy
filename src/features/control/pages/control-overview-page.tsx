import { Cpu, LayoutGrid, Scale } from 'lucide-react';

import { Equation } from '@/components/modules/equation';
import { ModuleCard } from '@/components/modules/module-card';
import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionHeading } from '@/components/modules/section-heading';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { CONTROL_MODULES } from '@/models/modules';

import { ConsistencyCheck } from '../components/consistency-check';
import { CONTROL_OVERVIEW_SECTIONS } from '../components/control-overview-sections';

/** Homework 1 building blocks each Control module reuses. */
const MODULE_TAGS: Record<string, string[]> = {
    '/control/pid-playground': ['Module 1 plant', 'Module 3 plant', 'Module 7 RK4'],
    '/control/slow-sensor-pid': ['P1 loop', 'First-order sensor', 'Module 7 RK4'],
    '/control/digital-pid': ['Module 1 & 3 plants', 'Zero-order hold', 'P1 reference'],
    '/control/tuning-challenge': ['Module 4 random plants', 'P1 loop', 'Shared metrics'],
    '/control/my-system': ['Module 1 plant', 'P3 sampled loop', 'ESP32 sketch'],
};

const CORE_ITEMS = [
    {
        title: 'Plant library',
        source: 'Modules 1 & 3',
        equations: [String.raw`G_1(s)=\frac{K}{\tau s+1}`, String.raw`G_2(s)=\frac{1}{ms^2+bs+k}`],
        description:
            'One first-order and one mass–spring–damper model for every module. Standard-form plants (ωn, ζ) are converted to m, b, k.',
    },
    {
        title: 'PID law',
        source: 'P1 – P4, MySystem',
        equations: [
            String.raw`u=\operatorname{sat}\!\left(K_pe+K_i\!\int e\,dt-K_d\dot y_m\right)`,
        ],
        description:
            'Derivative on the measurement, actuator saturation and conditional anti-windup, in continuous and sampled form.',
    },
    {
        title: 'Numerical engine',
        source: 'Module 7',
        equations: [String.raw`x_{n+1}=x_n+\tfrac{h}{6}(k_1+2k_2+2k_3+k_4)`],
        description:
            'The Module 7 RK4 step, generalised to state vectors, integrates every loop. Digital loops add a zero-order hold.',
    },
    {
        title: 'Performance metrics',
        source: 'Module 3 levels',
        equations: [String.raw`t_r^{10\text{–}90\%},\ M_p,\ t_s^{2\%},\ e_{ss}=r-y_\infty`],
        description:
            'One calculation for every module, measured against y(∞); P4 measures against the setpoint for its spec.',
    },
];

export default function ControlOverviewPage() {
    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    badge="HOMEWORK 2"
                    systemType="Feedback control"
                    title="Control"
                    kicker="Feedback control laboratory"
                    parent={{ to: '/', label: 'Home' }}
                    description="Close the loop around the sensors and systems from Homework 1. Four PID modules and a real micromouse motor design share one plant library, one PID law, one RK4 engine and one set of performance metrics."
                    nextModule={{
                        to: CONTROL_MODULES[0].path,
                        label: 'Start with P1: PID playground →',
                    }}
                    live={false}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={CONTROL_OVERVIEW_SECTIONS} />
            </Reveal>

            <Reveal>
                <section id="modules" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Modules" icon={LayoutGrid} />
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {CONTROL_MODULES.map((module) => (
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
                <section id="shared-core" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Shared simulation core" icon={Cpu} />
                    <p className="text-muted-foreground max-w-3xl text-sm leading-6">
                        Every Control module runs on{' '}
                        <code className="font-mono text-xs">features/control/domain</code>, which is
                        built from Homework 1 code rather than beside it.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {CORE_ITEMS.map((item) => (
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
                <section id="consistency" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Cross-module consistency" icon={Scale} />
                    <ConsistencyCheck />
                </section>
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
