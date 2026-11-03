import {
    Activity,
    BookOpen,
    Gauge,
    SlidersHorizontal,
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-is-mobile';

import { Separator } from '@/components/ui/separator';
import {useEffect, useState} from "react";

const SECTIONS = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'analysis', label: 'Analysis', icon: Activity },
    { id: 'challenge', label: 'Challenge', icon: Gauge },
] as const;

export function SectionNavigation() {
    const isMobile = useIsMobile();
    const [activeSection, setActiveSection] = useState('model');

    useEffect(() => {
        const sections = SECTIONS
            .map(({ id }) => document.getElementById(id))
            .filter((section): section is HTMLElement => section !== null);

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top,
                    );

                if (visibleSections.length > 0) {
                    setActiveSection(visibleSections[0].target.id);
                }
            },
            {
                rootMargin: '-15% 0px -70% 0px',
                threshold: 0,
            },
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    if (isMobile) return null;

    return (
        <nav
            aria-label="Module sections"
            className="sticky top-2 z-30 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-border/80 bg-background/90 p-1.5 shadow-sm backdrop-blur-xl sm:mx-0 sm:gap-2"
        >
            {SECTIONS.map(({ id, label, icon: Icon }) => (
                <a
                    key={id}
                    href={`#${id}`}
                    aria-current={
                        activeSection === id ? 'location' : undefined
                    }
                    className={[
                        'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                        'focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        activeSection === id
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    ].join(' ')}
                >
                    <Icon size={14} />
                    {label}
                </a>
            ))}
        </nav>
    );
}