import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import {
    generateStepResponse,
    type PoleConfiguration,
    type ResponseMetrics,
} from '@/features/pole-explorer/domain/pole-explorer';

const RESPONSE_COLOR = '#159b98';
const STEADY_STATE_COLOR = '#d69a35';
const PEAK_COLOR = '#d65d67';
const SETTLING_COLOR = '#3978c5';

interface StepResponseChartProps {
    configuration: PoleConfiguration;
    duration: number;
    metrics: ResponseMetrics;
}

export function StepResponseChart({ configuration, duration, metrics }: StepResponseChartProps) {
    const theme = useChartTheme();
    const points = useMemo(
        () => generateStepResponse(configuration, duration),
        [configuration, duration],
    );

    const data: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.value),
            type: 'scatter',
            mode: 'lines',
            name: 'Step response',
            line: { color: RESPONSE_COLOR, width: 2.8 },
            hovertemplate: 't = %{x:.3f} s<br>y = %{y:.4f}<extra></extra>',
        },
    ];

    if (metrics.peakTime !== null && metrics.overshootPercent !== null) {
        data.push({
            x: [metrics.peakTime],
            y: [1 + metrics.overshootPercent / 100],
            type: 'scatter',
            mode: 'markers',
            name: 'First peak',
            marker: {
                color: PEAK_COLOR,
                size: 9,
                line: { color: PEAK_COLOR, width: 1 },
            },
            hovertemplate: 'First peak<br>t = %{x:.3f} s<br>y = %{y:.4f}<extra></extra>',
        });
    }

    const shapes: NonNullable<Partial<Layout>['shapes']> = [
        {
            type: 'rect',
            xref: 'x',
            yref: 'y',
            x0: 0,
            x1: duration,
            y0: 0.98,
            y1: 1.02,
            fillcolor: RESPONSE_COLOR,
            opacity: 0.08,
            line: { width: 0 },
            layer: 'below',
        },
        {
            type: 'line',
            xref: 'x',
            yref: 'y',
            x0: 0,
            x1: duration,
            y0: 1,
            y1: 1,
            line: {
                color: STEADY_STATE_COLOR,
                dash: 'dot',
                width: 1.5,
            },
        },
    ];

    if (metrics.settlingTime !== null) {
        shapes.push({
            type: 'line',
            xref: 'x',
            yref: 'paper',
            x0: metrics.settlingTime,
            x1: metrics.settlingTime,
            y0: 0,
            y1: 1,
            line: {
                color: SETTLING_COLOR,
                dash: 'dash',
                width: 1.5,
            },
        });
    }

    const layout: Partial<Layout> = {
        autosize: true,
        height: 360,
        margin: { l: 62, r: 20, t: 20, b: 62 },
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
            title: { text: 'Step response y(t)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        shapes,
        showlegend: false,
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
