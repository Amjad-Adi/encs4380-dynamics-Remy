import { Activity, Gauge, Clock3, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PIDMetricsProps = {
    riseTime?: number | null;
    settlingTime?: number | null;
    overshoot?: number | null;
    steadyStateError?: number | null;
};

function formatValue(value?: number | null, suffix = ""): string {
    if (value === undefined || value === null || !Number.isFinite(value)) {
        return "—";
    }

    return `${value.toFixed(2)}${suffix}`;
}

export function PIDMetrics({
                               riseTime,
                               settlingTime,
                               overshoot,
                               steadyStateError,
                           }: PIDMetricsProps) {
    const metrics = [
        {
            label: "Rise Time",
            value: formatValue(riseTime, " s"),
            description: "Time required to reach the target",
            icon: Activity,
        },
        {
            label: "Overshoot",
            value: formatValue(overshoot, " %"),
            description: "Maximum response above the target",
            icon: Gauge,
        },
        {
            label: "Settling Time",
            value: formatValue(settlingTime, " s"),
            description: "Time required to stabilize",
            icon: Clock3,
        },
        {
            label: "Steady-State Error",
            value: formatValue(steadyStateError),
            description: "Final difference from the target",
            icon: Target,
        },
    ];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Live performance metrics</CardTitle>
                <p className="text-muted-foreground text-xs">
                    Calculated from the simulated system response.
                </p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {metrics.map(({ label, value, description, icon: Icon }) => (
                    <div className="bg-muted/50 min-w-0 rounded-lg p-3" key={label}>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <Icon size={14} />
                            {label}
                        </div>
                        <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
                            {value}
                        </p>
                        <p className="text-muted-foreground mt-1 text-[11px] leading-5">
                            {description}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}