
import { Activity, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ModuleHeaderProps {
    moduleNumber: string;
    systemType: string;
    title: string;
    description: string;
    nextModule?: {
        to: string;
        label: string;
    };
    onReset: () => void;
}

export function ModuleHeader({
                                 moduleNumber,
                                 systemType,
                                 title,
                                 description,
                                 nextModule,
                                 onReset,
                             }: ModuleHeaderProps) {
    return (
        <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
        <Badge
            variant="outline"
    className="border-primary/30 bg-primary/5 px-3 py-1 font-mono text-primary"
        >
        MODULE {moduleNumber}
    </Badge>

    <Badge className="bg-accent text-accent-foreground">
        {systemType}
        </Badge>

        <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
    <span className="relative flex size-2">
    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
    <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
    Live simulation
    </span>
    </div>

    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
    <div className="max-w-3xl space-y-3">
    <div className="flex items-center gap-2 text-sm font-medium text-primary">
    <Activity size={16} />
    Dynamic characteristics laboratory
    </div>

    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
        </h1>

        <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
        </p>

    {nextModule && (
        <Link
            to={nextModule.to}
        className="inline-flex text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
            {nextModule.label}
            </Link>
    )}
    </div>

    <Button
    type="button"
    variant="outline"
    onClick={onReset}
    className="group w-fit shrink-0 gap-2 transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
    >
    <RotateCcw
        size={15}
    className="transition-transform duration-500 group-hover:-rotate-180"
        />
        Reset experiment
    </Button>
    </div>
    </header>
);
}
