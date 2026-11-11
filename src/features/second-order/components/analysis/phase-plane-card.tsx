import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PhysicalParameters } from '@/features/second-order/domain';

import { PhasePlaneChart } from '../charts/phase-plane-chart';

interface PhasePlaneCardProps {
    parameters: PhysicalParameters;
    duration: number;
}

export function PhasePlaneCard({ parameters, duration }: PhasePlaneCardProps) {
    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle className="text-base">Phase-plane trajectory</CardTitle>
                <CardDescription>
                    Displacement versus velocity for the current system under a 1 N step from rest.
                </CardDescription>
            </CardHeader>

            <CardContent className="min-w-0">
                <PhasePlaneChart parameters={parameters} duration={duration} />
            </CardContent>
        </Card>
    );
}
