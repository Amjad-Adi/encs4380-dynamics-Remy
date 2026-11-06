import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import {
    generatePhasePlaneTrajectory,
    type PhysicalParameters,
} from '@/features/second-order/domain/second-order';

interface PhasePlaneChartProps {
    parameters: PhysicalParameters;
    duration: number;
}

export function PhasePlaneChart({
    parameters,
    duration,
}: PhasePlaneChartProps) {
    const theme = useChartTheme();
    const points = useMemo(
        () => generatePhasePlaneTrajectory(parameters, duration),
        [parameters, duration],
    );
    const data: Data[] = [
        {
            x: points.map((point) => point.displacement),
            y: points.map((point) => point.velocity),
            customdata: points.map((point) => point.time),
            type: 'scatter',
            mode: 'lines',
            name: 'Phase trajectory',
            line: { color: '#3978c5', width: 2.5 },
            hovertemplate:
                't = %{customdata:.3f} s<br>x = %{x:.5f} m<br>v = %{y:.5f} m/s<extra></extra>',
        },
        {
            x: [points[0]?.displacement ?? 0],
            y: [points[0]?.velocity ?? 0],
            type: 'scatter',
            mode: 'markers',
            name: 'Initial state',
            marker: { color: '#d69a35', size: 9 },
            hovertemplate: 'Initial state: x = 0, v = 0<extra></extra>',
        },
    ];
    const layout: Partial<Layout> = {
        autosize: true,
        height: 330,
        margin: { l: 65, r: 20, t: 20, b: 62 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            family: 'Geist Variable, sans-serif',
            color: theme.foreground,
            size: 11,
        },
        xaxis: {
            title: { text: 'Displacement x (m)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        yaxis: {
            title: { text: 'Velocity dx/dt (m/s)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        legend: { orientation: 'h', y: -0.24 },
        hovermode: 'closest',
    };

    return (
        <div className="h-[330px] min-h-[330px] w-full min-w-0">
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
