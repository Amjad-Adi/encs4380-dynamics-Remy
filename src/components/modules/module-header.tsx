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
                    className="border-primary/30 bg-primary/5 text-primary px-3 py-1 font-mono"
                >
                    MODULE {moduleNumber}
                </Badge>

                <Badge className="bg-accent text-accent-foreground">{systemType}</Badge>

                <span className="text-muted-foreground ml-auto inline-flex items-center gap-2 text-xs">
                    <span className="relative flex size-2">
                        <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-50" />
                        <span className="bg-success relative inline-flex size-2 rounded-full" />
                    </span>
                    Live simulation
                </span>
            </div>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div className="max-w-3xl space-y-3">
                    <div className="text-primary flex items-center gap-2 text-sm font-medium">
                        <Activity size={16} />
                        Dynamic characteristics laboratory
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
            </div>
        </header>
    );
}
