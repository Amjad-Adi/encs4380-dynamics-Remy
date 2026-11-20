import type { SimulationSample } from "../../domain/pid-types";
import type { Data, Layout } from "plotly.js";
import { ThemedPlot } from "@/components/shared/themed-plot";

interface PIDResponseChartProps {
    samples: SimulationSample[];
}

export function PIDResponseChart({ samples }: PIDResponseChartProps) {
    const data: Data[] = [
        {
            x: samples.map((sample) => sample.time),
            y: samples.map((sample) => sample.setpoint),
            type: "scatter",
            mode: "lines",
            name: "Setpoint",
            line: { color: "#d69a35", width: 2, dash: "dash" },
        },
        {
            x: samples.map((sample) => sample.time),
            y: samples.map((sample) => sample.output),
            type: "scatter",
            mode: "lines",
            name: "System output",
            line: { color: "#159b98", width: 3 },
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 350,
        margin: { l: 62, r: 62, t: 20, b: 62 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: { text: "Time (s)" } },
        yaxis: { title: { text: "Output" } },
        legend: { orientation: "h", y: -0.24 },
        hovermode: "x unified",
    };

    return (
        <ThemedPlot
            data={data}
            layout={layout}
            className="h-[350px] min-h-[350px] w-full min-w-0"
        />
    );
}