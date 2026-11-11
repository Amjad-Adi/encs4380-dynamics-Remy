import { Activity } from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ComplexPole } from '@/features/second-order/domain';

import { formatPole } from './format-pole';

interface EigenvaluesCardProps {
    eigenvalues: ComplexPole[];
}

export function EigenvaluesCard({ eigenvalues }: EigenvaluesCardProps) {
    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle className="text-base">Eigenvalues of A</CardTitle>
                <CardDescription>
                    Independently calculated from A; these match the roots of ms² + bs + k = 0.
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2">
                {eigenvalues.map((eigenvalue, index) => (
                    <MetricCard
                        key={`eigenvalue-${index}`}
                        label={`λ${index + 1}`}
                        value={formatPole(eigenvalue.real, eigenvalue.imaginary)}
                        detail="s⁻¹"
                        icon={Activity}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
