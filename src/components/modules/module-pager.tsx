import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    TOOLKIT_SECTIONS,
    getAdjacentModules,
    getModuleForPath,
    getModuleTitle,
} from '@/models/modules';

function PagerLink({
    to,
    title,
    direction,
}: {
    to: string;
    title: string;
    direction: 'previous' | 'next';
}) {
    const isNext = direction === 'next';

    return (
        <Link
            to={to}
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
                <span className="block truncate text-sm font-medium">{title}</span>
            </span>
        </Link>
    );
}

/**
 * Previous / overview / next links between the modules of one section. After a
 * section's last module, "next" leads to the following homework, as in the header.
 */
export function ModulePager({ className }: { className?: string }) {
    const location = useLocation();
    const module = getModuleForPath(location.pathname);
    if (!module) return null;

    const sectionIndex = TOOLKIT_SECTIONS.findIndex((candidate) => candidate.id === module.section);
    const section = TOOLKIT_SECTIONS[sectionIndex];
    const nextSection = TOOLKIT_SECTIONS[sectionIndex + 1];
    const { previous, next } = getAdjacentModules(location.pathname);
    const nextLink = next
        ? { to: next.path, title: getModuleTitle(next) }
        : nextSection
          ? {
                to: nextSection.overview.path,
                title: `${nextSection.homework} · ${nextSection.label}`,
            }
          : null;

    return (
        <nav
            aria-label={`${section.label} module pager`}
            className={cn('flex flex-col gap-3 sm:flex-row sm:items-stretch', className)}
        >
            {previous ? (
                <PagerLink
                    to={previous.path}
                    title={getModuleTitle(previous)}
                    direction="previous"
                />
            ) : (
                <span className="hidden flex-1 sm:block" />
            )}

            <Link
                to={section.overview.path}
                className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-auto gap-2 rounded-xl px-4 py-3 sm:flex-none',
                )}
            >
                <LayoutGrid size={15} aria-hidden="true" />
                {section.label} {section.overview.label.toLowerCase()}
            </Link>

            {nextLink ? (
                <PagerLink to={nextLink.to} title={nextLink.title} direction="next" />
            ) : (
                <span className="hidden flex-1 sm:block" />
            )}
        </nav>
    );
}
