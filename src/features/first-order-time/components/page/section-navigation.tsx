import {
    Activity,
    BookOpen,
    Gauge,
    SlidersHorizontal,
} from 'lucide-react';

const SECTIONS = [
    {
        id: 'model',
        label: 'Model',
        icon: BookOpen,
    },
    {
        id: 'experiment',
        label: 'Experiment',
        icon: SlidersHorizontal,
    },
    {
        id: 'analysis',
        label: 'Analysis',
        icon: Activity,
    },
    {
        id: 'challenge',
        label: 'Challenge',
        icon: Gauge,
    },
] as const;

export function SectionNavigation() {
    return (
        <nav
            aria-label="Module sections"
            className="sticky top-2 z-30 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-border/80 bg-background/90 p-1.5 shadow-sm backdrop-blur-xl sm:mx-0 sm:gap-2"
        >
            {SECTIONS.map(({ id, label, icon: Icon }) => (
                <a
                    key={id}
                    href={`#${id}`}
                    className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Icon size={14} />
                    {label}
                </a>
            ))}
        </nav>
    );
}