import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import {
    TOOLKIT_SECTIONS,
    formatModuleLabel,
    getAdjacentModules,
    getModuleForPath,
    type ToolkitModule,
} from '@/models/modules';

function PagerLink({
    module,
    direction,
}: {
    module: ToolkitModule;
    direction: 'previous' | 'next';
}) {
    const isNext = direction === 'next';

    return (
        <Link
            to={module.path}
            className={cn(
                'bg-card ring-foreground/10 hover:ring-primary/40 group flex min-w-0 flex-1 items-center gap-3 rounded-xl p-3 ring-1 transition-shadow hover:shadow-sm sm:p-4',
                isNext && 'flex-row-reverse text-right',
            )}
        >
            {isNext ? (
                <ArrowRight size={16} className="text-primary shrink-0" aria-hidden="true" />
            ) : (
                <ArrowLeft size={16} className="text-primary shrink-0" aria-hidden="true" />
            )}
            <span className="min-w-0">
                <span className="text-muted-foreground block text-[11px]">
                    {isNext ? 'Next' : 'Previous'}
                </span>
                <span className="block truncate text-sm font-medium">
                    {formatModuleLabel(module)}
                </span>
            </span>
        </Link>
    );
}

/** Previous / overview / next links between the modules of one section. */
export function ModulePager({ className }: { className?: string }) {
    const location = useLocation();
    const module = getModuleForPath(location.pathname);
    if (!module) return null;

    const section = TOOLKIT_SECTIONS.find((candidate) => candidate.id === module.section)!;
    const { previous, next } = getAdjacentModules(location.pathname);

    return (
        <nav
            aria-label={`${section.label} module pager`}
            className={cn('flex flex-col gap-3 sm:flex-row sm:items-stretch', className)}
        >
            {previous ? (
                <PagerLink module={previous} direction="previous" />
            ) : (
                <span className="hidden flex-1 sm:block" />
            )}

            {section.overview && (
                <Link
                    to={section.overview.path}
                    className="text-muted-foreground hover:text-primary ring-foreground/10 bg-card flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm ring-1 transition-colors sm:flex-none"
                >
                    <LayoutGrid size={15} aria-hidden="true" />
                    {section.label} {section.overview.label.toLowerCase()}
                </Link>
            )}

            {next ? (
                <PagerLink module={next} direction="next" />
            ) : (
                <span className="hidden flex-1 sm:block" />
            )}
        </nav>
    );
}
