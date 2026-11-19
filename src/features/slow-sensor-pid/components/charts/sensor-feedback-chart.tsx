
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme.ts';

import type {
    SlowSensorPIDResponsePoint,
} from '../../domain/slow-sensor-pid.ts';

interface SensorFeedbackChartProps {
    points: SlowSensorPIDResponsePoint[];
}

export function SensorFeedbackChart({
                                        points,
                                    }: SensorFeedbackChartProps) {
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
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 390,

        margin: {
            l: 65,
            r: 25,
            t: 25,
            b: 65,
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
            title: { text: 'Output' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },

        legend: {
            orientation: 'h',
            y: -0.22,
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
