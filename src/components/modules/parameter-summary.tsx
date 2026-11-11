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
        <section aria-label={ariaLabel} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {items.map(({ label, value, unit, description, icon: Icon }) => (
                <div key={label} className="border-border bg-card min-w-0 rounded-xl border p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-xs">{label}</span>

                        <Icon size={16} className="text-primary shrink-0" />
                    </div>

                    <p className="font-mono text-2xl font-semibold tracking-tight break-words tabular-nums">
                        {value}

                        {unit && (
                            <span className="text-muted-foreground ml-1 text-sm font-normal">
                                {unit}
                            </span>
                        )}
                    </p>

                    <p className="text-muted-foreground mt-1 text-xs">{description}</p>
                </div>
            ))}
        </section>
    );
}
