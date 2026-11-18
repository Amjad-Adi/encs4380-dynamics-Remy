import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';
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
        hovertemplate: '%{y:.4f}<extra></extra>',
    }));

    const layout: Partial<Layout> = {
        height: 300,
        margin: { l: 55, r: 20, t: 20, b: 65 },
        xaxis: {
            title: { text: 'Time (s)' },
        },
        yaxis: {
            title: { text: view === 'input' ? 'Component xᵢ(t)' : 'Contribution yᵢ(t)' },
        },
        legend: { orientation: 'h', y: -0.25 },
        showlegend: true,
        hovermode: 'x unified',
    };

    return <ThemedPlot data={data} layout={layout} className="h-[300px] min-h-[300px]" />;
}
