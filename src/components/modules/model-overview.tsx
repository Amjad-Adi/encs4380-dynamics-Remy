
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
                <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:p-6">
                    {items.map((item, index) => (
                        <div
                            key={item.title}
                            className="contents"
                        >
                            {index > 0 && (
                                <div className="hidden h-16 w-px bg-border md:block" />
                            )}

                            <div className="min-w-0 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {item.title}
                                    </p>

                                    {item.badge && (
                                        <Badge
                                            variant="outline"
                                            className="text-[10px]"
                                        >
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
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    );
}
