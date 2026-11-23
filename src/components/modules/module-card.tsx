import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ToolkitModule } from '@/models/modules';

interface ModuleCardProps {
    module: ToolkitModule;
    /** Short tags, e.g. which Homework 1 components the module builds on. */
    tags?: string[];
    compact?: boolean;
    className?: string;
}

/** Linked summary card for a toolkit module. */
export function ModuleCard({ module, tags, compact = false, className }: ModuleCardProps) {
    const Icon = module.icon;

    return (
        <Link
            to={module.path}
            className={cn(
                'group bg-card ring-foreground/10 hover:ring-primary/40 focus-visible:ring-ring flex min-w-0 flex-col gap-3 rounded-xl p-4 ring-1 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none',
                compact ? 'sm:p-4' : 'sm:p-5',
                className,
            )}
        >
            <div className="flex items-start gap-3">
                <span className="bg-accent text-accent-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon size={19} aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                    {module.number && (
                        <span className="text-primary font-mono text-[11px] font-semibold tracking-wide uppercase">
                            Module {module.number}
                        </span>
                    )}
                    <h3 className="text-base leading-snug font-semibold tracking-tight">
                        {module.label}
                    </h3>
                </div>

                <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="text-muted-foreground group-hover:text-primary mt-1 shrink-0 transition-transform group-hover:translate-x-0.5"
                />
            </div>

            {!compact && (
                <p className="text-muted-foreground text-sm leading-6">{module.description}</p>
            )}

            {tags && tags.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="outline"
                            className="text-muted-foreground h-auto py-0.5 text-[10px] font-normal whitespace-normal"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}
        </Link>
    );
}
