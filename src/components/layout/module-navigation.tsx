import { NavLink, useLocation } from 'react-router-dom';

import { useIsMobile } from '@/hooks/use-is-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getSectionForPath, type ToolkitModule } from '@/models/modules.ts';

const LINK_CLASS =
    'flex items-center gap-2 border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors';

function linkClass({ isActive }: { isActive: boolean }) {
    return [
        LINK_CLASS,
        isActive
            ? 'border-brand text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground border-transparent',
    ].join(' ');
}

function UnavailableModule({ module }: { module: ToolkitModule }) {
    const Icon = module.icon;

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <div
                        aria-disabled="true"
                        className="text-muted-foreground/60 flex cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm"
                    >
                        <Icon size={16} />
                        {module.number && (
                            <span className="font-mono text-xs">{module.number}</span>
                        )}
                        <span className="whitespace-nowrap">{module.label}</span>
                        <span className="bg-muted hidden rounded-full px-2 py-0.5 text-[10px] sm:inline">
                            Soon
                        </span>
                    </div>
                }
            />
            <TooltipContent>This module is coming soon.</TooltipContent>
        </Tooltip>
    );
}

/** Desktop module bar: the modules of the section the current page belongs to. */
export function ModuleNavigation() {
    const isMobile = useIsMobile();
    const location = useLocation();
    const section = getSectionForPath(location.pathname);

    if (isMobile || !section) return null;

    const Overview = section.overview;

    return (
        <TooltipProvider>
            <nav aria-label={`${section.label} modules`} className="border-border bg-card border-b">
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-1 px-4 sm:px-6 lg:px-8">
                    {Overview && (
                        <>
                            <NavLink to={Overview.path} end className={linkClass}>
                                <Overview.icon size={16} />
                                <span>{Overview.label}</span>
                            </NavLink>
                            <span aria-hidden="true" className="bg-border mx-1 h-5 w-px" />
                        </>
                    )}

                    {section.modules.map((module) => {
                        const Icon = module.icon;

                        if (!module.available) {
                            return <UnavailableModule key={module.path} module={module} />;
                        }

                        return (
                            <NavLink key={module.path} to={module.path} className={linkClass}>
                                <Icon size={16} />
                                {module.number && (
                                    <span className="font-mono text-xs">{module.number}</span>
                                )}
                                <span>{module.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </TooltipProvider>
    );
}
