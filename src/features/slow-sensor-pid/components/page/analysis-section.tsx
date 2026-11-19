import { Gauge } from 'lucide-react';

import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import type { SlowSensorPIDMetrics } from '../analysis/slow-sensor-pid-metrics';
import { SlowSensorPIDMetricsCard } from '../analysis/slow-sensor-pid-metrics';

export function SlowSensorPIDAnalysisSection({ metrics }: { metrics: SlowSensorPIDMetrics }) {
    return (
        <SharedAnalysisSection
            title="Performance analysis"
            icon={Gauge}
            description="The metrics are calculated from the simulated closed-loop response. Overshoot is measured in the direction of the setpoint."
        >
            <div className="space-y-4">
                <SlowSensorPIDMetricsCard metrics={metrics} />
                <div className="bg-muted/50 space-y-2 rounded-xl p-5">
                    <h3 className="font-semibold">What should you observe?</h3>
                    <p className="text-muted-foreground text-sm leading-7">
                        Increase τs and observe how the measured output falls behind the true plant
                        output. Depending on the plant and PID gains, this delay can produce
                        excessive overshoot and oscillatory behavior.
                    </p>
                    <p className="text-muted-foreground text-xs leading-6">
                        The final true/measured output difference measures sensor lag at the final
                        sample; it is not the steady-state tracking error.
                    </p>
                </div>
            </div>
        </SharedAnalysisSection>
    );
}
