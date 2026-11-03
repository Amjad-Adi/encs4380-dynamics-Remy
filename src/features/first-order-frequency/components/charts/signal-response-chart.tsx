import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme.ts';
import { generateSignalResponse } from '@/features/first-order-frequency/domain/first-order-frequency.ts';

interface SignalResponseChartProps {
    tau: number;
    omega: number;
}

export function SignalResponseChart({ tau, omega }: SignalResponseChartProps) {
    const theme = useChartTheme();
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
        font: {
            family: 'Geist Variable, sans-serif',
            color: theme.foreground,
            size: 11,
        },
        xaxis: {
            title: { text: 'Time (s)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        yaxis: {
            title: { text: 'Amplitude' },
            range: [-1.15, 1.15],
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        legend: { orientation: 'h', y: -0.25 },
        hovermode: 'x unified',
    };

    return (
        <div className="h-[330px] min-h-[330px] w-full min-w-0">
            <Plot
                data={traces}
                layout={layout}
                config={{ responsive: true, displaylogo: false }}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
