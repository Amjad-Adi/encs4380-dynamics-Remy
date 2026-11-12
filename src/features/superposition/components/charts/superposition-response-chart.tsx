import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import {
    INPUT_COLOR,
    OUTPUT_COLOR,
    STEADY_STATE_COLOR,
    type SuperpositionPoint,
} from '@/features/superposition/domain/superposition';

interface SuperpositionResponseChartProps {
    points: SuperpositionPoint[];
    tau: number;
}

export function SuperpositionResponseChart({ points, tau }: SuperpositionResponseChartProps) {
    const theme = useChartTheme();
    const time = points.map((point) => point.time);
    const settlingTime = 5 * tau;

    const data: Data[] = [
        {
            x: time,
            y: points.map((point) => point.input),
            type: 'scatter',
            mode: 'lines',
            name: 'Combined input x(t)',
            line: { color: INPUT_COLOR, width: 2, dash: 'dash' },
            hovertemplate: '%{y:.4f}',
        },
        {
            x: time,
            y: points.map((point) => point.steadyStateOutput),
            type: 'scatter',
            mode: 'lines',
            name: 'Steady-state output y_ss(t)',
            line: { color: STEADY_STATE_COLOR, width: 1.6, dash: 'dot' },
            hovertemplate: '%{y:.4f}',
        },
        {
            x: time,
            y: points.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: 'Sensor output y(t)',
            line: { color: OUTPUT_COLOR, width: 2.8 },
            hovertemplate: '%{y:.4f}',
        },
    ];

    const shapes: NonNullable<Partial<Layout>['shapes']> = [
        {
            type: 'line',
            xref: 'x',
            yref: 'paper',
            x0: settlingTime,
            x1: settlingTime,
            y0: 0,
            y1: 1,
            line: { color: theme.muted, dash: 'dash', width: 1 },
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 360,
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
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        shapes,
        annotations: [
            {
                x: settlingTime,
                y: 1,
                xref: 'x',
                yref: 'paper',
                text: 't = 5τ',
                showarrow: false,
                xanchor: 'left',
                yanchor: 'top',
                font: { color: theme.muted, size: 10 },
            },
        ],
        legend: { orientation: 'h', y: -0.22 },
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
