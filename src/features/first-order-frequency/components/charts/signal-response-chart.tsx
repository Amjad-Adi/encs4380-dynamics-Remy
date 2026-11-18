import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';

import { generateSignalResponse } from '@/features/first-order-frequency/domain/first-order-frequency.ts';

interface SignalResponseChartProps {
    tau: number;
    omega: number;
}

export function SignalResponseChart({ tau, omega }: SignalResponseChartProps) {
    const points = generateSignalResponse(tau, omega);

    const traces: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.input),
            type: 'scatter',
            mode: 'lines',
            name: 'Input sin(ωt)',
            line: { color: '#98a6bb', width: 2, dash: 'dash' },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: 'Output M sin(ωt + φ)',
            line: { color: '#3978c5', width: 2.8 },
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 330,
        margin: { l: 55, r: 20, t: 20, b: 65 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            title: { text: 'Time (s)' },
        },
        yaxis: {
            title: { text: 'Amplitude' },
            range: [-1.15, 1.15],
        },
        legend: { orientation: 'h', y: -0.25 },
        hovermode: 'x unified',
    };

    return (
        <ThemedPlot
            data={traces}
            layout={layout}
            className="h-[330px] min-h-[330px] w-full min-w-0"
        />
    );
}
