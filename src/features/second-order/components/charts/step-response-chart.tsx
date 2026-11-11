import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import { generateStepResponse, type PhysicalParameters } from '@/features/second-order/domain';
interface StepResponseChartProps {
    parameters: PhysicalParameters;
    duration: number;
}

export function StepResponseChart({ parameters, duration }: StepResponseChartProps) {
    const theme = useChartTheme();
    const points = useMemo(
        () => generateStepResponse(parameters, duration),
        [parameters, duration],
    );

    const data: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.displacement),
            type: 'scatter',
            mode: 'lines',
            name: 'Displacement x(t)',
            line: { color: '#159b98', width: 2.8 },
            hovertemplate: 't = %{x:.3f} s<br>x = %{y:.5f} m<extra></extra>',
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.normalizedResponse),
            type: 'scatter',
            mode: 'lines',
            name: 'Normalized response kx(t)',
            yaxis: 'y2',
            line: { color: '#3978c5', width: 2, dash: 'dash' },
            hovertemplate: 't = %{x:.3f} s<br>kx = %{y:.5f}<extra></extra>',
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 350,
        margin: { l: 62, r: 62, t: 20, b: 62 },
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
            title: { text: 'Displacement x(t) (m)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        yaxis2: {
            title: { text: 'Normalized kx(t)' },
            overlaying: 'y',
            side: 'right',
            showgrid: false,
            zeroline: false,
            color: theme.muted,
        },
        legend: { orientation: 'h', y: -0.24 },
        hovermode: 'x unified',
        shapes: [
            {
                type: 'line',
                x0: 0,
                x1: duration,
                y0: 1 / parameters.k,
                y1: 1 / parameters.k,
                line: { color: '#d69a35', dash: 'dot', width: 1.5 },
            },
        ],
    };

    return (
        <div className="h-[350px] min-h-[350px] w-full min-w-0">
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
