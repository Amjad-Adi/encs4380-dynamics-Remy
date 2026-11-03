import { NavLink } from 'react-router-dom';
import {
    Activity,
    AudioWaveform,
    Gauge,
    ScanSearch,
} from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const modules = [
    {
        number: '01',
        label: 'Time response',
        path: 'time-response',
        icon: Activity,
        available: true,
    },
    {
        number: '02',
        label: 'Frequency response',
        path: 'frequency-response',
        icon: AudioWaveform,
        available: true,
    },
    {
        number: '03',
        label: 'Second-order',
        path: 'second-order',
        icon: Gauge,
        available: false,
    },
    {
        number: '04',
        label: 'Sensor challenge',
        path: 'sensor-challenge',
        icon: ScanSearch,
        available: false,
    },
];

export function ModuleNavigation() {
    return (
        <TooltipProvider>
            <nav
                aria-label="Toolkit modules"
                className="border-b border-border bg-card"
            >
                <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
                    {modules.map((module) => {
                        const Icon = module.icon;

                        if (!module.available) {
                            return (
                                <Tooltip key={module.number}>
                                    <TooltipTrigger
                                        render={
                                            <div
                                                aria-disabled="true"
                                                className="flex shrink-0 cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm text-muted-foreground/60"
                                            />
                                        }
                                    >
                                        <Icon size={16} />

                                        <span className="font-mono text-xs">
                                            {module.number}
                                        </span>

                                        <span>{module.label}</span>

                                        <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] sm:inline">
                                            Soon
                                        </span>
                                    </TooltipTrigger>

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
                                className={({ isActive }) =>
                                    [
                                        'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors',
                                        isActive
                                            ? 'border-brand font-semibold text-foreground'
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