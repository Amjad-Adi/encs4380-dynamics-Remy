import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useIsMobile } from '@/hooks/use-is-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getModuleTitle, getSectionForPath, type ToolkitModule } from '@/models/modules.ts';

const LINK_CLASS =
    'flex shrink-0 items-center gap-2 border-b-2 px-2.5 py-3 text-sm whitespace-nowrap transition-colors xl:px-3';

function linkClass({ isActive }: { isActive: boolean }) {
    return cn(
        LINK_CLASS,
        isActive
            ? 'border-brand text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground border-transparent',
    );
}

function ModuleNumber({ number }: { number?: string }) {
    return number ? <span className="font-mono text-xs">{number}</span> : null;
}

function UnavailableModule({ module }: { module: ToolkitModule }) {
    const Icon = module.icon;

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <div
                        aria-disabled="true"
                        className="text-muted-foreground/60 flex shrink-0 cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm"
                    >
                        <Icon size={16} />
                        <ModuleNumber number={module.number} />
                        <span className="whitespace-nowrap">{module.navLabel ?? module.label}</span>
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

/**
 * Desktop module bar: the current section's overview and modules on one line. When
 * the full labels do not fit, the other modules collapse to their numbers (the
 * current one keeps its label); if even that is too wide the line scrolls, keeping
 * the current module in view.
 */
export function ModuleNavigation() {
    const isMobile = useIsMobile();
    const location = useLocation();
    const section = getSectionForPath(location.pathname);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);
    const fullWidthRef = useRef<number | null>(null);
    const [compact, setCompact] = useState(false);

    // Re-measure the full-label width whenever the page (and so the bold item) changes.
    useLayoutEffect(() => {
        fullWidthRef.current = null;
        setCompact(false);
    }, [location.pathname]);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        const row = rowRef.current;
        if (!scroller || !row) return;

        const update = () => {
            const style = getComputedStyle(scroller);
            const available =
                scroller.clientWidth -
                parseFloat(style.paddingLeft) -
                parseFloat(style.paddingRight);
            if (!compact) fullWidthRef.current = row.getBoundingClientRect().width;
            if (fullWidthRef.current !== null) setCompact(fullWidthRef.current > available + 0.5);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(scroller);
        return () => observer.disconnect();
    }, [compact, location.pathname, isMobile]);

    useEffect(() => {
        const active = scrollerRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
        active?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }, [location.pathname, compact]);

    if (isMobile || !section) return null;

    const Overview = section.overview;

    return (
        <TooltipProvider>
            <nav aria-label={`${section.label} modules`} className="border-border bg-card border-b">
                <div
                    ref={scrollerRef}
                    className="mx-auto max-w-[1440px] [scrollbar-width:thin] overflow-x-auto px-4 sm:px-6 lg:px-8"
                >
                    <div ref={rowRef} className="mx-auto flex w-max items-center gap-x-1">
                        <NavLink to={Overview.path} end className={linkClass}>
                            <Overview.icon size={16} />
                            <span>{Overview.label}</span>
                        </NavLink>
                        <span aria-hidden="true" className="bg-border mx-1 h-5 w-px shrink-0" />

                        {section.modules.map((module) => {
                            const Icon = module.icon;

                            if (!module.available) {
                                return <UnavailableModule key={module.path} module={module} />;
                            }

                            return (
                                <NavLink
                                    key={module.path}
                                    to={module.path}
                                    title={module.label}
                                    aria-label={getModuleTitle(module)}
                                    className={linkClass}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon size={16} />
                                            <ModuleNumber number={module.number} />
                                            <span
                                                className={cn(
                                                    compact &&
                                                        !isActive &&
                                                        module.number &&
                                                        'hidden',
                                                )}
                                            >
                                                {module.navLabel ?? module.label}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </TooltipProvider>
    );
}
