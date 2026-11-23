import type { Data, Layout } from 'plotly.js';

import type { MySystemSimulation } from '@/features/my-system/domain/my-system';
import { ThemedPlot } from '@/components/shared/themed-plot';

interface MySystemResponseChartProps {
    simulation: MySystemSimulation;
    setpoint: number;
}

export function MySystemResponseChart({
    simulation,
    setpoint,
}: MySystemResponseChartProps) {
    const left = simulation.left.points;
    const right = simulation.right.points;

    const data: Data[] = [
        {
            x: left.map((point) => point.time),
            y: left.map(() => setpoint),
            type: 'scatter',
            mode: 'lines',
            name: 'Speed target',
            line: { color: '#d69a35', width: 2, dash: 'dash' },
        },
        {
            x: left.map((point) => point.time),
            y: left.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: 'Left motor speed',
            line: { color: '#159b98', width: 2.5 },
        },
        {
            x: right.map((point) => point.time),
            y: right.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: 'Right motor speed',
            line: { color: '#6478c8', width: 2.5 },
        },
        {
            x: left.map((point) => point.time),
            y: left.map((point) => point.control * 100),
            type: 'scatter',
            mode: 'lines',
            name: 'Left PWM',
            yaxis: 'y2',
            line: { color: '#159b98', width: 1.5, dash: 'dot' },
            opacity: 0.55,
        },
        {
            x: right.map((point) => point.time),
            y: right.map((point) => point.control * 100),
            type: 'scatter',
            mode: 'lines',
            name: 'Right PWM',
            yaxis: 'y2',
            line: { color: '#6478c8', width: 1.5, dash: 'dot' },
            opacity: 0.55,
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 390,
        margin: { l: 62, r: 62, t: 18, b: 72 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { title: { text: 'Time (s)' } },
        yaxis: {
            title: { text: 'Motor speed (RPM)' },
            rangemode: 'tozero',
        },
        yaxis2: {
            title: { text: 'PWM (%)' },
            overlaying: 'y',
            side: 'right',
            range: [0, 105],
            showgrid: false,
        },
        legend: { orientation: 'h', y: -0.25, x: 0 },
        hovermode: 'x unified',
    };

    return (
        <ThemedPlot
            data={data}
            layout={layout}
            className="h-[390px] min-h-[390px] w-full min-w-0"
        />
    );
}
