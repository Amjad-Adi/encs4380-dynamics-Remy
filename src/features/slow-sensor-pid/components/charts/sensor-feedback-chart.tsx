import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';

import type { SlowSensorPIDResponsePoint } from '../../domain/slow-sensor-pid.ts';

interface SensorFeedbackChartProps {
    points: SlowSensorPIDResponsePoint[];
}

export function SensorFeedbackChart({ points }: SensorFeedbackChartProps) {
    const traces: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.setpoint),
            type: 'scatter',
            mode: 'lines',
            name: 'Setpoint',
            line: {
                color: '#d69a35',
                width: 2,
                dash: 'dash',
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.trueOutput),
            type: 'scatter',
            mode: 'lines',
            name: 'True plant output y(t)',
            line: {
                color: '#159b98',
                width: 3,
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.measuredOutput),
            type: 'scatter',
            mode: 'lines',
            name: 'Measured sensor output ym(t)',
            line: {
                color: '#3978c5',
                width: 2.5,
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.control),
            type: 'scatter',
            mode: 'lines',
            name: 'Controller command u(t)',
            yaxis: 'y2',
            line: {
                color: '#a35bb5',
                width: 1.8,
                dash: 'dot',
            },
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 390,
        margin: {
            l: 65,
            r: 75,
            t: 25,
            b: 85,
        },
        xaxis: {
            title: { text: 'Time (s)' },
        },
        yaxis: {
            title: { text: 'Plant output / sensor measurement' },
        },
        yaxis2: {
            title: { text: 'Controller command' },
            overlaying: 'y',
            side: 'right',
            showgrid: false,
            zeroline: false,
        },
        legend: {
            orientation: 'h',
            y: -0.28,
        },
        hovermode: 'x unified',
    };

    return (
        <ThemedPlot
            data={traces}
            layout={layout}
            className="h-[390px] min-h-[390px] w-full min-w-0"
        />
    );
}