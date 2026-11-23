import { Activity, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ModuleHeaderProps {
    moduleNumber?: string;
    /** Replaces the default "MODULE nn" badge text, e.g. "CONTROL · P1". */
    badge?: string;
    systemType: string;
    title: string;
    description: string;
    /** Line above the title; defaults to the Homework 1 laboratory name. */
    kicker?: string;
    /** Link back to the section overview, shown above the badges. */
    parent?: {
        to: string;
        label: string;
    };
    nextModule?: {
        to: string;
        label: string;
    };
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
    kicker = 'Dynamic characteristics laboratory',
    parent,
    nextModule,
    onReset,
    live = true,
}: ModuleHeaderProps) {
    return (
        <header className="space-y-5">
            {parent && (
                <Link
                    to={parent.to}
                    className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                >
                    <ArrowLeft size={13} />
                    {parent.label}
                </Link>
            )}

            <div className="flex flex-wrap items-center gap-2">
                <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/5 text-primary px-3 py-1 font-mono"
                >
                    {badge ?? `MODULE ${moduleNumber}`}
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
                        {kicker}
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        {title}
                    </h1>

                    <p className="text-muted-foreground max-w-2xl text-sm leading-7 sm:text-base">
                        {description}
                    </p>

                    {nextModule && (
                        <Link
                            to={nextModule.to}
                            className="text-primary inline-flex text-xs font-medium underline-offset-4 hover:underline"
                        >
                            {nextModule.label}
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
