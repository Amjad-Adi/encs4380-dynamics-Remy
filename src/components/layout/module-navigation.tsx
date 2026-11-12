import { NavLink } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MODULES } from '@/models/modules.ts';

export function ModuleNavigation() {
    const isMobile = useIsMobile();

    if (isMobile) return null;

    return (
        <TooltipProvider>
            <nav
                aria-label="Toolkit navigation"
                className="border-b border-border bg-card"
            >
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-1 px-4 sm:px-6 lg:px-8">
                    {MODULES.map((module) => {
                        const Icon = module.icon;

                        if (!module.available) {
                            return (
                                <Tooltip key={module.number}>
                                    <TooltipTrigger
                                        render={
                                            <div
                                                aria-disabled="true"
                                                className="flex cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground/60"
                                            >
                                                <Icon size={16} />

                                                <span className="font-mono text-xs">
                                                    {module.number}
                                                </span>

                                                <span className="whitespace-nowrap">
                                                    {module.label}
                                                </span>

                                                <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] sm:inline">
                                                    Soon
                                                </span>
                                            </div>
                                        }
                                    />

                                    <TooltipContent>
                                        This module is coming soon.
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return (
                            <NavLink
                                key={module.number}
                                to={module.path}
                                end={module.path === '/'}
                                className={({ isActive }) =>
                                    [
                                        'flex items-center gap-2 border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors',
                                        isActive
                                            ? 'border-brand text-foreground font-semibold'
                                            : 'border-transparent text-muted-foreground hover:text-foreground',
                                    ].join(' ')
                                }
                            >
                                <Icon size={16} />

                                <span className="font-mono text-xs">
                                    {module.number}
                                </span>

                                <span>{module.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </TooltipProvider>
    );
}