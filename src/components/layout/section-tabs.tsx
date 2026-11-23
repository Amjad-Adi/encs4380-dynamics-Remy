import { NavLink, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { TOOLKIT_SECTIONS, getSectionForPath } from '@/models/modules';

/**
 * Desktop switcher between Homework 1 (dynamic characteristics) and Homework 2
 * (control). The two tabs share one grid track width, so both are the same size.
 */
export function SectionTabs({ className }: { className?: string }) {
    const location = useLocation();
    const activeSection = getSectionForPath(location.pathname);

    return (
        <nav
            aria-label="Toolkit sections"
            className={cn('bg-muted/60 grid grid-cols-2 gap-1 rounded-lg p-1', className)}
        >
            {TOOLKIT_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection?.id === section.id;

                return (
                    <NavLink
                        key={section.id}
                        to={section.overview.path}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={`${section.homework}: ${section.label}`}
                        className={cn(
                            // Same weight in both states so switching homework never resizes the tabs.
                            'focus-visible:ring-ring flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none',
                            isActive
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Icon size={15} className={isActive ? 'text-brand' : undefined} />
                        <span className="xl:hidden">{section.shortLabel}</span>
                        <span className="hidden xl:inline">{section.label}</span>
                        <span className="text-muted-foreground hidden font-mono text-[10px] xl:inline">
                            {section.homework.replace('Homework ', 'HW')}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
