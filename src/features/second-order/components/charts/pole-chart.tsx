import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import {
    getEigenvaluesOfA,
    getSystemPoles,
    type PhysicalParameters,
} from '@/features/second-order/domain';
interface PoleChartProps {
    parameters: PhysicalParameters;
}

export function PoleChart({ parameters }: PoleChartProps) {
    const theme = useChartTheme();
    const poles = useMemo(() => getSystemPoles(parameters), [parameters]);
    const eigenvalues = useMemo(() => getEigenvaluesOfA(parameters), [parameters]);
    const data: Data[] = [
        {
            x: poles.map((pole) => pole.real),
            y: poles.map((pole) => pole.imaginary),
            type: 'scatter',
            mode: 'markers',
            name: 'Transfer-function poles',
            marker: {
                color: '#d65d67',
                size: 12,
                symbol: 'x',
                line: { width: 2 },
            },
            customdata: poles.map((_, index) => index + 1),
            hovertemplate:
                'Pole %{customdata}<br>Real = %{x:.4f} s⁻¹<br>Imaginary = %{y:.4f} rad/s<extra></extra>',
        },
        {
            x: eigenvalues.map((eigenvalue) => eigenvalue.real),
            y: eigenvalues.map((eigenvalue) => eigenvalue.imaginary),
            type: 'scatter',
            mode: 'markers',
            name: 'Eigenvalues of A',
            marker: {
                color: '#159b98',
                size: 20,
                symbol: 'circle-open',
                line: { color: '#159b98', width: 2 },
            },
            customdata: eigenvalues.map((_, index) => index + 1),
            hovertemplate:
                'Eigenvalue %{customdata}<br>Real = %{x:.4f} s⁻¹<br>Imaginary = %{y:.4f} rad/s<extra></extra>',
        },
    ];
    const extent = Math.max(
        1,
        ...[...poles, ...eigenvalues].flatMap((point) => [
            Math.abs(point.real),
            Math.abs(point.imaginary),
        ]),
    );
    const layout: Partial<Layout> = {
        autosize: true,
        height: 300,
        margin: { l: 60, r: 20, t: 18, b: 75 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            family: 'Geist Variable, sans-serif',
            color: theme.foreground,
            size: 11,
        },
        xaxis: {
            title: { text: 'Real part (s⁻¹)' },
            range: [-1.25 * extent, 1.25 * extent],
            gridcolor: theme.grid,
            zerolinecolor: theme.muted,
            color: theme.muted,
        },
        yaxis: {
            title: { text: 'Imaginary part (rad/s)' },
            range: [-1.25 * extent, 1.25 * extent],
            gridcolor: theme.grid,
            zerolinecolor: theme.muted,
            color: theme.muted,
            scaleanchor: 'x',
            scaleratio: 1,
        },
        legend: { orientation: 'h', y: -0.3 },
        hovermode: 'closest',
    };

    return (
        <div className="h-[300px] min-h-[300px] w-full min-w-0">
            <Plot
                data={data}
                layout={layout}
                config={{ responsive: true, displaylogo: false }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
            />
        </div>
    );
}
