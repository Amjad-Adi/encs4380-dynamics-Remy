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
            icon: "↗",
        },
        {
            label: "Overshoot",
            value: formatValue(overshoot, " %"),
            description: "Maximum response above the target",
            icon: "⌁",
        },
        {
            label: "Settling Time",
            value: formatValue(settlingTime, " s"),
            description: "Time required to stabilize",
            icon: "◷",
        },
        {
            label: "Steady-State Error",
            value: formatValue(steadyStateError),
            description: "Final difference from the target",
            icon: "◎",
        },
    ];

    return (
        <section className="pid-metrics">
            <div className="pid-metrics-header">
                <h2>Live Performance Metrics</h2>
                <p>
                    Calculated from the simulated system response.
                </p>
            </div>

            <div className="pid-metrics-grid">
                {metrics.map((metric) => (
                    <div className="pid-metric-card" key={metric.label}>
                        <div className="pid-metric-top">
                            <span className="pid-metric-icon">
                                {metric.icon}
                            </span>

                            <h3>{metric.label}</h3>
                        </div>

                        <p className="pid-metric-value">
                            {metric.value}
                        </p>

                        <p className="pid-metric-description">
                            {metric.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}