import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';
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
            hovertemplate: '%{y:.4f}<extra></extra>',
        },
        {
            x: time,
            y: points.map((point) => point.steadyStateOutput),
            type: 'scatter',
            mode: 'lines',
            name: 'Steady-state output y_ss(t)',
            line: { color: STEADY_STATE_COLOR, width: 1.6, dash: 'dot' },
            hovertemplate: '%{y:.4f}<extra></extra>',
        },
        {
            x: time,
            y: points.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: 'Sensor output y(t)',
            line: { color: OUTPUT_COLOR, width: 2.8 },
            hovertemplate: '%{y:.4f}<extra></extra>',
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
            line: { color: 'var(--chart-axis)', dash: 'dash', width: 1 },
        },
    ];

    const layout: Partial<Layout> = {
        height: 360,
        margin: { l: 55, r: 20, t: 20, b: 65 },
        xaxis: {
            title: { text: 'Time (s)' },
        },
        yaxis: {
            title: { text: 'Amplitude' },
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
                font: { color: 'var(--chart-axis)', size: 10 },
            },
        ],
        legend: { orientation: 'h', y: -0.22 },
        hovermode: 'x unified',
    };

    return <ThemedPlot data={data} layout={layout} className="h-[360px] min-h-[360px]" />;
}
