
import type { LucideIcon } from 'lucide-react';

interface SharedParameterSummaryItem {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    unit?: string;
}

interface SharedParameterSummaryProps {
    items: SharedParameterSummaryItem[];
    ariaLabel?: string;
}

export function SharedParameterSummary({
                                     items,
                                     ariaLabel = 'Current experiment parameters',
                                 }: SharedParameterSummaryProps) {
    return (
        <section
            aria-label={ariaLabel}
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
            {items.map(({ label, value, unit, description, icon: Icon }) => (
                <div
                    key={label}
                    className="min-w-0 rounded-xl border border-border bg-card p-4"
                >
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                            {label}
                        </span>

                        <Icon
                            size={16}
                            className="shrink-0 text-primary"
                        />
                    </div>

                    <p className="break-words font-mono text-2xl font-semibold tracking-tight tabular-nums">
                        {value}

                        {unit && (
                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                                {unit}
                            </span>
                        )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            ))}
        </section>
    );
}
