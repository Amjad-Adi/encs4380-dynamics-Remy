import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';

interface ThemedPlotProps {
    data: Data[];
    layout: Partial<Layout>;
    config?: Partial<Config>;
    className?: string;
}

export function ThemedPlot({ data, layout, config, className }: ThemedPlotProps) {
    const theme = useChartTheme();
    const isMobile = useIsMobile();

    // On phones every pixel of plot width counts: trim wide side margins (axis titles still
    // get room through automargin) and use a slightly smaller legend font. Charts with a
    // right-hand axis keep their right margin for its labels.
    const hasRightAxis = layout.yaxis2 !== undefined;
    const margin =
        isMobile && layout.margin
            ? {
                  ...layout.margin,
                  l: Math.min(layout.margin.l ?? 50, 48),
                  r: hasRightAxis ? layout.margin.r : Math.min(layout.margin.r ?? 15, 12),
              }
            : layout.margin;

    const themedLayout: Partial<Layout> = {
        ...layout,
        margin,
        legend: isMobile
            ? { ...layout.legend, font: { size: 10, ...layout.legend?.font } }
            : layout.legend,
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
            automargin: true,
            ...layout.xaxis,
        },
        yaxis: {
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
            automargin: true,
            ...layout.yaxis,
        },
        yaxis2: {
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
            automargin: true,
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
                    // The toolbar covers the plot on touch screens; pinch and tap still work.
                    displayModeBar: isMobile ? false : 'hover',
                    ...config,
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
            />
        </div>
    );
}
