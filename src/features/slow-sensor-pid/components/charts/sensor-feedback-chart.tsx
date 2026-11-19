import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme.ts';

import type { SlowSensorPIDResponsePoint } from '../../domain/slow-sensor-pid.ts';

interface SensorFeedbackChartProps {
    points: SlowSensorPIDResponsePoint[];
}

export function SensorFeedbackChart({ points }: SensorFeedbackChartProps) {
    const theme = useChartTheme();

    const traces: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.setpoint),
            type: 'scatter',
            mode: 'lines',
            name: 'Setpoint',
            line: {
                color: '#d69a35',
                width: 2,
                dash: 'dash',
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.trueOutput),
            type: 'scatter',
            mode: 'lines',
            name: 'True plant output y(t)',
            line: {
                color: '#159b98',
                width: 3,
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.measuredOutput),
            type: 'scatter',
            mode: 'lines',
            name: 'Measured sensor output ym(t)',
            line: {
                color: '#3978c5',
                width: 2.5,
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.control),
            type: 'scatter',
            mode: 'lines',
            name: 'Controller command u(t)',
            yaxis: 'y2',
            line: {
                color: '#a35bb5',
                width: 1.8,
                dash: 'dot',
            },
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 390,

        margin: {
            l: 65,
            r: 75,
            t: 25,
            b: 85,
        },

        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',

        font: {
            family: 'Geist Variable, sans-serif',
            color: theme.foreground,
            size: 12,
        },

        xaxis: {
            title: { text: 'Time (s)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },

        yaxis: {
            title: { text: 'Plant output / sensor measurement' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },

        yaxis2: {
            title: { text: 'Controller command' },
            overlaying: 'y',
            side: 'right',
            showgrid: false,
            zeroline: false,
            color: theme.muted,
        },

        legend: {
            orientation: 'h',
            y: -0.28,
        },

        hovermode: 'x unified',
    };

    return (
        <div className="h-[390px] min-h-[390px] w-full min-w-0">
            <Plot
                data={traces}
                layout={layout}
                config={{
                    responsive: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                useResizeHandler
            />
        </div>
    );
}
