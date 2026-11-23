import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ModuleFooter } from '@/components/modules/module-footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { TOOLKIT_SECTIONS, type ToolkitSection } from '@/models/modules';

function SectionPanel({ section }: { section: ToolkitSection }) {
    const Icon = section.icon;
    const isControl = section.id === 'control';

    return (
        <section
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="bg-card ring-foreground/10 flex min-w-0 scroll-mt-24 flex-col gap-5 rounded-2xl p-5 ring-1 sm:p-6"
        >
            <div className="flex items-start gap-4">
                <span className="bg-accent text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
                    <Icon size={22} aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1">
                    <Badge
                        variant="outline"
                        className="border-primary/30 bg-primary/5 text-primary font-mono text-[10px]"
                    >
                        {section.homework.toUpperCase()}
                    </Badge>
                    <h2
                        id={`${section.id}-title`}
                        className="text-xl font-bold tracking-tight sm:text-2xl"
                    >
                        {section.label}
                    </h2>
                </div>
            </div>

            <p className="text-muted-foreground text-sm leading-6">{section.description}</p>

            <ul className="divide-border -mx-2 divide-y">
                {section.modules.map((module) => {
                    const ModuleIcon = module.icon;
                    return (
                        <li key={module.path}>
                            <Link
                                to={module.path}
                                className="hover:bg-muted/60 group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors"
                            >
                                <ModuleIcon
                                    size={16}
                                    className="text-muted-foreground group-hover:text-primary shrink-0"
                                    aria-hidden="true"
                                />
                                <span className="text-primary w-7 shrink-0 font-mono text-xs font-semibold">
                                    {module.number}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {module.label}
                                </span>
                                <ChevronRight
                                    size={15}
                                    className="text-muted-foreground shrink-0 opacity-60 group-hover:opacity-100"
                                    aria-hidden="true"
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <Button
                render={<Link to={section.overview.path} />}
                nativeButton={false}
                variant={isControl ? 'default' : 'outline'}
                className="mt-auto h-11 w-full gap-2 sm:w-fit"
            >
                Open the {section.label} section
                <ArrowRight size={15} />
            </Button>
        </section>
    );
}

export default function HomePage() {
    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <header className="max-w-3xl space-y-4">
                    <p className="text-primary text-sm font-medium">
                        ENCS4380 · Interfacing Techniques · Birzeit University
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Dynamic Characteristics Toolkit
                    </h1>
                    <p className="text-muted-foreground text-sm leading-7 sm:text-base">
                        Interactive simulations of measurement-system dynamics and the feedback
                        loops built around them. Homework 1 models the sensors; Homework 2 closes
                        the loop with PID control on the same models. Everything runs in your
                        browser.
                    </p>
                    <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                        {TOOLKIT_SECTIONS.map((section) => (
                            <Button
                                key={section.id}
                                render={<Link to={section.overview.path} />}
                                nativeButton={false}
                                variant={section.id === 'control' ? 'default' : 'outline'}
                                className="h-11 gap-2"
                            >
                                <section.icon size={15} />
                                {section.homework}: {section.label}
                            </Button>
                        ))}
                    </div>
                </header>
            </Reveal>

            <Reveal>
                <div className="grid items-stretch gap-5 lg:grid-cols-2">
                    {TOOLKIT_SECTIONS.map((section) => (
                        <SectionPanel key={section.id} section={section} />
                    ))}
                </div>
            </Reveal>

            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
