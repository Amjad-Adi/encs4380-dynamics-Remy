import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
}

export function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
    return (
        <Card className="hover:border-primary/30 min-w-0 transition-colors">
            <CardContent className="flex min-w-0 items-start gap-3 p-4">
                <div className="bg-accent text-accent-foreground shrink-0 rounded-lg p-2">
                    <Icon size={18} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs font-medium">{label}</p>

                    <p className="mt-1 font-mono text-xl font-semibold break-words tabular-nums">
                        {value}
                    </p>

                    <p className="text-muted-foreground mt-1 text-xs leading-5">{detail}</p>
                </div>
            </CardContent>
        </Card>
    );
}
