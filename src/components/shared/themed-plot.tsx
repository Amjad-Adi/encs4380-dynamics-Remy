import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import { cn } from '@/lib/utils';

interface ThemedPlotProps {
    data: Data[];
    layout: Partial<Layout>;
    config?: Partial<Config>;
    className?: string;
}

export function ThemedPlot({ data, layout, config, className }: ThemedPlotProps) {
    const theme = useChartTheme();

    const themedLayout: Partial<Layout> = {
        ...layout,
        autosize: layout.autosize ?? true,
        paper_bgcolor: layout.paper_bgcolor ?? 'rgba(0,0,0,0)',
        plot_bgcolor: layout.plot_bgcolor ?? 'rgba(0,0,0,0)',
        font: {
            family: 'Geist Variable, sans-serif',
            color: theme.foreground,
            size: 11,
            ...layout.font,
        },
        hoverlabel: {
            bgcolor: theme.popover,
            bordercolor: theme.border,
            align: 'left',
            namelength: -1,
            ...layout.hoverlabel,
            font: {
                family: 'Geist Variable, sans-serif',
                color: theme.popoverForeground,
                size: 12,
                ...layout.hoverlabel?.font,
            },
        },
        xaxis: {
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
            ...layout.xaxis,
        },
        yaxis: {
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
            ...layout.yaxis,
        },
        yaxis2: {
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
            ...layout.yaxis2,
        },
    };

    return (
        <div className={cn('h-full w-full min-w-0', className)}>
            <Plot
                data={data}
                layout={themedLayout}
                config={{
                    responsive: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    ...config,
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
            />
        </div>
    );
}
