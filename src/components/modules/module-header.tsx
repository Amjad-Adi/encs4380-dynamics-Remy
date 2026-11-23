import { Activity, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    getModuleBadge,
    getModuleForPath,
    getPageLinks,
    getSectionForPath,
    type NavigationLink,
} from '@/models/modules';

interface ModuleHeaderProps {
    /** Overrides the badge number; normally taken from the module registry. */
    moduleNumber?: string;
    /** Overrides the badge text, e.g. "HOMEWORK 2" on an overview page. */
    badge?: string;
    systemType: string;
    title: string;
    description: string;
    /** Overrides the kicker; normally the section's laboratory name. */
    kicker?: string;
    /**
     * Back link above the badges and continue link under the description. Both are
     * derived from the registry; pass a link to override it or null to hide it.
     */
    parent?: NavigationLink | null;
    nextModule?: NavigationLink | null;
    /** Omit to hide the reset button (overview pages). */
    onReset?: () => void;
    live?: boolean;
}

export function ModuleHeader({
    moduleNumber,
    badge,
    systemType,
    title,
    description,
    kicker,
    parent,
    nextModule,
    onReset,
    live = true,
}: ModuleHeaderProps) {
    const { pathname } = useLocation();
    const links = getPageLinks(pathname);
    const module = getModuleForPath(pathname);
    const section = getSectionForPath(pathname);

    const parentLink = parent === undefined ? links.parent : parent;
    const nextLink = nextModule === undefined ? links.next : nextModule;
    const badgeText =
        badge ?? (moduleNumber ? `MODULE ${moduleNumber}` : module ? getModuleBadge(module) : '');
    const kickerText = kicker ?? section?.laboratory ?? 'Dynamic characteristics laboratory';

    return (
        <header className="space-y-5">
            {parentLink && (
                <Link
                    to={parentLink.to}
                    className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                >
                    <ArrowLeft size={13} />
                    {parentLink.label}
                </Link>
            )}

            <div className="flex flex-wrap items-center gap-2">
                <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/5 text-primary px-3 py-1 font-mono"
                >
                    {badgeText}
                </Badge>

                <Badge className="bg-accent text-accent-foreground">{systemType}</Badge>

                {live && (
                    <span className="text-muted-foreground ml-auto inline-flex items-center gap-2 text-xs">
                        <span className="relative flex size-2">
                            <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-50" />
                            <span className="bg-success relative inline-flex size-2 rounded-full" />
                        </span>
                        Live simulation
                    </span>
                )}
            </div>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div className="max-w-3xl space-y-3">
                    <div className="text-primary flex items-center gap-2 text-sm font-medium">
                        <Activity size={16} />
                        {kickerText}
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        {title}
                    </h1>

                    <p className="text-muted-foreground max-w-2xl text-sm leading-7 sm:text-base">
                        {description}
                    </p>

                    {nextLink && (
                        <Link
                            to={nextLink.to}
                            className="text-primary inline-flex text-xs font-medium underline-offset-4 hover:underline"
                        >
                            {nextLink.label}
                        </Link>
                    )}
                </div>

                {onReset && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onReset}
                        className="group hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive w-fit shrink-0 gap-2 transition-colors"
                    >
                        <RotateCcw
                            size={15}
                            className="transition-transform duration-500 group-hover:-rotate-180"
                        />
                        Reset experiment
                    </Button>
                )}
            </div>
        </header>
    );
}
