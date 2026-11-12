import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import type { NumericalOdePoint } from '@/features/numerical-ode/domain/numerical-ode';
import type { NumericalMethod } from '../controls/numerical-ode-controls';

interface NumericalOdeComparisonChartProps {
    points: NumericalOdePoint[];
    selectedMethod: NumericalMethod;
}

const METHOD_STYLES = {
    euler: { color: '#3978c5', label: 'Euler numerical solution' },
    rk4: { color: '#159b98', label: 'RK4 numerical solution' },
} as const;

export function NumericalOdeComparisonChart({
    points,
    selectedMethod,
}: NumericalOdeComparisonChartProps) {
    const theme = useChartTheme();
    const inactiveMethod = selectedMethod === 'euler' ? 'rk4' : 'euler';

    const traces: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.analytical),
            type: 'scatter',
            mode: 'lines',
            name: 'Analytical solution',
            line: { color: '#d69a35', width: 2.5 },
        },
        ...(['euler', 'rk4'] as const).map((method): Data => ({
            x: points.map((point) => point.time),
            y: points.map((point) => point[method]),
            type: 'scatter',
            mode: 'lines',
            name: METHOD_STYLES[method].label,
            opacity: method === selectedMethod ? 1 : 0.58,
            line: {
                color: METHOD_STYLES[method].color,
                width: method === selectedMethod ? 3.5 : 1.8,
                dash: method === inactiveMethod ? 'dot' : 'solid',
            },
        })),
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 420,
        margin: { l: 65, r: 25, t: 25, b: 65 },
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
            title: { text: 'Output y(t)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        legend: { orientation: 'h', y: -0.22 },
        hovermode: 'x unified',
    };

    return (
        <div className="h-[420px] min-h-[420px] w-full min-w-0">
            <Plot
                data={traces}
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
