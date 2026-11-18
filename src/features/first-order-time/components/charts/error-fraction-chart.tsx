import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';

import { generateErrorFractionData } from '@/features/first-order-time/domain/first-order-time.ts';

interface ErrorFractionChartProps {
    tau: number;
}

export function ErrorFractionChart({ tau }: ErrorFractionChartProps) {
    const points = generateErrorFractionData(tau);

    const traces: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.fraction),
            type: 'scatter',
            mode: 'lines',
            name: 'Error fraction',
            line: {
                color: '#d65d67',
                width: 2.5,
            },
        },
    ];

    const layout: Partial<Layout> = {
        autosize: true,
        height: 300,
        margin: {
            l: 70,
            r: 20,
            t: 20,
            b: 55,
        },

        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',

        xaxis: {
            title: { text: 'Time (s)' },
        },

        yaxis: {
            title: { text: 'Error fraction' },
            type: 'log',
        },

        annotations: [
            {
                x: 2.5 * tau,
                y: Math.exp(-2.5),
                text: `ln slope = −1/τ = ${(-1 / tau).toFixed(3)} s⁻¹`,
                showarrow: false,
                bgcolor: 'rgba(214,93,103,0.10)',
                borderpad: 5,
                font: {
                    size: 10,
                },
            },
        ],
    };

    return (
        <ThemedPlot
            data={traces}
            layout={layout}
            className="h-[300px] min-h-[300px] w-full min-w-0"
        />
    );
}
