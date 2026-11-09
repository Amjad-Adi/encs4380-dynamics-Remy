
import type { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
} from '@/components/ui/card';

import { SectionHeading } from '@/components/modules/section-heading';

export interface SharedModelOverviewItem {
    title: string;
    content: ReactNode;
    description?: ReactNode;
    badge?: string;
}

interface SharedModelOverviewProps {
    items: SharedModelOverviewItem[];
}

export function SharedModelOverview({ items }: SharedModelOverviewProps) {
    const standardFormItem = items.find(
        (item) => item.title === 'Standard form',
    );

    const primaryItems = items.filter(
        (item) => item.title !== 'Standard form',
    );

    function renderItem(item: SharedModelOverviewItem) {
        return (
            <div key={item.title} className="min-w-0 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.title}
                    </p>

                    {item.badge && (
                        <Badge variant="outline" className="text-[10px]">
                            {item.badge}
                        </Badge>
                    )}
                </div>

                {item.content}

                {item.description && (
                    <div className="text-xs text-muted-foreground">
                        {item.description}
                    </div>
                )}
            </div>
        );
    }

    return (
        <section
            id="model"
            className="scroll-mt-24 space-y-3"
        >
            <SectionHeading
                title="Mathematical model"
                icon={BookOpen}
            />

            <Card className="overflow-hidden border-border">
                <CardContent className="space-y-6 p-5 md:p-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {primaryItems.map(renderItem)}
                    </div>

                    {standardFormItem && (
                        <>
                            <div className="border-t border-border" />

                            {renderItem(standardFormItem)}
                        </>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
