import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import {
    getSensorResponse,
    type SensorChallenge,
    type SensorEstimate,
} from '@/features/sensor-challenge/domain/sensor-challenge';

interface SensorResponseChartProps {
    challenge: SensorChallenge;
    estimate?: SensorEstimate;
    revealed: boolean;
}

export function SensorResponseChart({
    challenge,
    estimate,
    revealed,
}: SensorResponseChartProps) {
    const theme = useChartTheme();
    const times = challenge.samples.map((sample) => sample.time);
    const data: Data[] = [
        {
            x: times,
            y: challenge.samples.map((sample) => sample.measurement),
            type: 'scatter',
            mode: 'markers',
            name: 'Noisy sensor measurements',
            marker: { color: '#3978c5', size: 5, opacity: 0.62 },
            hovertemplate: 't = %{x:.3f} s<br>y = %{y:.4f}<extra></extra>',
        },
    ];

    if (revealed) {
        data.push({
            x: times,
            y: challenge.samples.map((sample) => sample.response),
            type: 'scatter',
            mode: 'lines',
            name: 'Actual response',
            line: { color: '#159b98', width: 2.5 },
            hovertemplate: 't = %{x:.3f} s<br>y = %{y:.4f}<extra></extra>',
        });
    }

    if (revealed && estimate) {
        data.push({
            x: times,
            y: times.map((time) => getSensorResponse(estimate, time)),
            type: 'scatter',
            mode: 'lines',
            name: 'Your predicted response',
            line: { color: '#d69a35', width: 2, dash: 'dash' },
            hovertemplate: 't = %{x:.3f} s<br>y = %{y:.4f}<extra></extra>',
        });
    }

    const layout: Partial<Layout> = {
        autosize: true,
        height: 360,
        margin: { l: 58, r: 24, t: 20, b: 62 },
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
            title: { text: 'Normalized output' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        legend: { orientation: 'h', y: -0.24 },
        hovermode: 'x unified',
    };

    return (
        <div className="h-[360px] min-h-[360px] w-full min-w-0">
            <Plot
                data={data}
                layout={layout}
                config={{
                    responsive: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
            />
        </div>
    );
}
