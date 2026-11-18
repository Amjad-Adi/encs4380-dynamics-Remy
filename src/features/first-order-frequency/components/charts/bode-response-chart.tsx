import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';

import {
    generateBodeResponse,
    getFrequencyResponse,
} from '@/features/first-order-frequency/domain/first-order-frequency.ts';

interface BodeResponseChartProps {
    tau: number;
    omega: number;
}

export function BodeResponseChart({ tau, omega }: BodeResponseChartProps) {
    const points = generateBodeResponse(tau);
    const selected = getFrequencyResponse(tau, omega);
    const cutoff = 1 / tau;

    const commonXAxis = {
        type: 'log' as const,
        title: { text: 'Angular frequency ω (rad/s)' },
        showgrid: true,
    };

    const magnitudeData: Data[] = [
        {
            x: points.map((point) => point.frequency),
            y: points.map((point) => point.magnitudeDb),
            type: 'scatter',
            mode: 'lines',
            name: 'Magnitude',
            line: { color: '#3978c5', width: 2.5 },
        },
        {
            x: [omega],
            y: [selected.magnitudeDb],
            type: 'scatter',
            mode: 'markers',
            name: 'Selected ω',
            marker: { color: '#159b98', size: 10 },
        },
        {
            x: [cutoff],
            y: [-3.0103],
            type: 'scatter',
            mode: 'markers',
            name: 'Cutoff (−3 dB)',
            marker: { color: '#d69a35', size: 9, symbol: 'diamond' },
        },
    ];

    const phaseData: Data[] = [
        {
            x: points.map((point) => point.frequency),
            y: points.map((point) => point.phaseDegrees),
            type: 'scatter',
            mode: 'lines',
            name: 'Phase',
            line: { color: '#3978c5', width: 2.5 },
        },
        {
            x: [omega],
            y: [selected.phaseDegrees],
            type: 'scatter',
            mode: 'markers',
            name: 'Selected ω',
            marker: { color: '#159b98', size: 10 },
        },
        {
            x: [cutoff],
            y: [-45],
            type: 'scatter',
            mode: 'markers',
            name: 'Cutoff (−45°)',
            marker: { color: '#d69a35', size: 9, symbol: 'diamond' },
        },
    ];

    const baseLayout: Partial<Layout> = {
        autosize: true,
        height: 330,
        margin: { l: 58, r: 18, t: 25, b: 65 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: commonXAxis,
        hovermode: 'closest',
        showlegend: false,
    };

    const magnitudeLayout: Partial<Layout> = {
        ...baseLayout,
        yaxis: {
            title: { text: 'Magnitude (dB)' },
        },
        shapes: [
            {
                type: 'line',
                x0: cutoff,
                x1: cutoff,
                y0: -60,
                y1: 1,
                line: { color: '#d69a35', dash: 'dash', width: 1.5 },
            },
            {
                type: 'line',
                x0: cutoff / 1000,
                x1: cutoff * 100,
                y0: -3.0103,
                y1: -3.0103,
                line: { color: 'var(--border)', dash: 'dot', width: 1 },
            },
        ],
    };

    const phaseLayout: Partial<Layout> = {
        ...baseLayout,
        yaxis: {
            title: { text: 'Phase (degrees)' },
            range: [-95, 5],
        },
        shapes: [
            {
                type: 'line',
                x0: cutoff,
                x1: cutoff,
                y0: -95,
                y1: 5,
                line: { color: '#d69a35', dash: 'dash', width: 1.5 },
            },
            {
                type: 'line',
                x0: cutoff / 1000,
                x1: cutoff * 100,
                y0: -45,
                y1: -45,
                line: { color: 'var(--border)', dash: 'dot', width: 1 },
            },
        ],
    };

    return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-semibold">
                    Magnitude response
                </p>
                <ThemedPlot
                    data={magnitudeData}
                    layout={magnitudeLayout}
                    className="h-[330px] min-h-[330px] w-full min-w-0"
                />
            </div>
            <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-semibold">Phase response</p>
                <ThemedPlot
                    data={phaseData}
                    layout={phaseLayout}
                    className="h-[330px] min-h-[330px] w-full min-w-0"
                />
            </div>
        </div>
    );
}
