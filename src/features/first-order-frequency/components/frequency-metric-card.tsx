import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface FrequencyMetricCardProps {
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
}

export function FrequencyMetricCard({
    label,
    value,
    detail,
    icon: Icon,
}: FrequencyMetricCardProps) {
    return (
        <Card className="min-w-0 transition-colors hover:border-primary/30">
            <CardContent className="flex min-w-0 items-start gap-3 p-4">
                <div className="shrink-0 rounded-lg bg-accent p-2 text-accent-foreground">
                    <Icon size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className="mt-1 break-words font-mono text-xl font-semibold tabular-nums">
                        {value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
                </div>
            </CardContent>
        </Card>
    );
}
