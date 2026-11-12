import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import {
    getComponentColor,
    type SinusoidComponent,
    type SuperpositionPoint,
} from '@/features/superposition/domain/superposition';

export type ComponentView = 'input' | 'output';

interface ComponentSignalsChartProps {
    components: SinusoidComponent[];
    points: SuperpositionPoint[];
    view: ComponentView;
}

export function ComponentSignalsChart({ components, points, view }: ComponentSignalsChartProps) {
    const theme = useChartTheme();
    const time = points.map((point) => point.time);

    const data: Data[] = components.map((component, index) => ({
        x: time,
        y: points.map((point) =>
            view === 'input' ? point.components[index] : point.componentOutputs[index],
        ),
        type: 'scatter',
        mode: 'lines',
        name: view === 'input' ? `x${component.id}(t)` : `y${component.id}(t)`,
        line: { color: getComponentColor(component.id), width: 2 },
        hovertemplate: '%{y:.4f}',
    }));

    const layout: Partial<Layout> = {
        autosize: true,
        height: 300,
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
            title: { text: view === 'input' ? 'Component xᵢ(t)' : 'Contribution yᵢ(t)' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },
        legend: { orientation: 'h', y: -0.25 },
        showlegend: true,
        hovermode: 'x unified',
    };

    return (
        <div className="h-[300px] min-h-[300px] w-full min-w-0">
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
