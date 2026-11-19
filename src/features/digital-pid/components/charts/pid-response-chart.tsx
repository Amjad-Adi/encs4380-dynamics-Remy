import type { SimulationSample } from "../../domain/pid-types";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

interface PIDResponseChartProps {
    samples: SimulationSample[];
}

export function PIDResponseChart({ samples }: PIDResponseChartProps) {
    return (
        <section className="pid-response-chart">
            <h2>System Response</h2>

            <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={samples}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="time"
                            label={{
                                value: "Time (seconds)",
                                position: "insideBottom",
                                offset: -5,
                            }}
                        />

                        <YAxis
                            label={{
                                value: "Output",
                                angle: -90,
                                position: "insideLeft",
                            }}
                        />

                        <Tooltip />
                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="setpoint"
                            name="Setpoint"
                            stroke="#8884d8"
                            strokeDasharray="5 5"
                            dot={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="output"
                            name="System Output"
                            stroke="#82ca9d"
                            dot={false}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}