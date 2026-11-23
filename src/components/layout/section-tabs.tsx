import { NavLink, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { TOOLKIT_SECTIONS, getSectionForPath } from '@/models/modules';

/** Desktop switcher between Homework 1 (dynamic characteristics) and Homework 2 (control). */
export function SectionTabs({ className }: { className?: string }) {
    const location = useLocation();
    const activeSection = getSectionForPath(location.pathname);

    return (
        <nav
            aria-label="Toolkit sections"
            className={cn('bg-muted/60 flex items-center gap-1 rounded-lg p-1', className)}
        >
            {TOOLKIT_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection?.id === section.id;

                return (
                    <NavLink
                        key={section.id}
                        to={section.entryPath}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
                            isActive
                                ? 'bg-background text-foreground font-semibold shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Icon size={15} className={isActive ? 'text-brand' : undefined} />
                        <span>{section.label}</span>
                        <span className="text-muted-foreground hidden font-mono text-[10px] xl:inline">
                            {section.homework.replace('Homework ', 'HW')}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
