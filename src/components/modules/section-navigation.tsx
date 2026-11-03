
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-is-mobile';

export interface ModuleSection {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface SectionNavigationProps {
    sections: ModuleSection[];
}

export function SectionNavigation({
                                      sections,
                                  }: SectionNavigationProps) {
    const isMobile = useIsMobile();
    const [activeSection, setActiveSection] = useState(
        sections[0]?.id ?? '',
    );

    useEffect(() => {
        const elements = sections
            .map(({ id }) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        if (!elements.length) return;

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

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [sections]);

    if (isMobile) return null;

    return (
        <nav
            aria-label="Module sections"
            className="sticky top-2 z-30 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-border/80 bg-background/90 p-1.5 shadow-sm backdrop-blur-xl sm:mx-0 sm:gap-2"
        >
            {sections.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;

                return (
                    <a
                        key={id}
                        href={`#${id}`}
                        aria-current={isActive ? 'location' : undefined}
                        className={[
                            'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                            'focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        ].join(' ')}
                    >
                        <Icon size={14} />
                        {label}
                    </a>
                );
            })}
        </nav>
    );
}
