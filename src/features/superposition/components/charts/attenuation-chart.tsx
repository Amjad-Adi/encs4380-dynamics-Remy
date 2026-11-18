import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';
import {
    getComponentColor,
    getComponentResponse,
    MAX_OMEGA,
    MIN_OMEGA,
    OUTPUT_COLOR,
    STEADY_STATE_COLOR,
    type SensorParameters,
    type SinusoidComponent,
} from '@/features/superposition/domain/superposition';

const CURVE_SAMPLES = 300;

interface AttenuationChartProps {
    components: SinusoidComponent[];
    sensor: SensorParameters;
}

export function AttenuationChart({ components, sensor }: AttenuationChartProps) {
    // Sweep the full component frequency range on a logarithmic axis.
    const minLog = Math.log10(MIN_OMEGA);
    const maxLog = Math.log10(MAX_OMEGA);
    const curve = Array.from({ length: CURVE_SAMPLES }, (_, index) => {
        const omega = 10 ** (minLog + (index / (CURVE_SAMPLES - 1)) * (maxLog - minLog));

        return {
            omega,
            ...getComponentResponse({ id: 0, amplitude: 1, omega, phase: 0 }, sensor),
        };
    });

    const responses = components.map((component) => getComponentResponse(component, sensor));
    const cutoff = 1 / sensor.tau;

    const data: Data[] = [
        {
            x: curve.map((point) => point.omega),
            y: curve.map((point) => point.magnitude),
            type: 'scatter',
            mode: 'lines',
            name: 'M(ω)',
            line: { color: OUTPUT_COLOR, width: 2.4 },
            hovertemplate: 'ω = %{x:.2f} rad/s<br>M = %{y:.4f}<extra></extra>',
        },
        {
            x: curve.map((point) => point.omega),
            y: curve.map((point) => point.phaseLagDegrees),
            type: 'scatter',
            mode: 'lines',
            name: 'φ(ω)',
            yaxis: 'y2',
            line: { color: STEADY_STATE_COLOR, width: 2, dash: 'dash' },
            hovertemplate: 'ω = %{x:.2f} rad/s<br>φ = %{y:.2f}°<extra></extra>',
        },
        ...components.map((component, index): Data => ({
            x: [component.omega],
            y: [responses[index].magnitude],
            type: 'scatter',
            mode: 'markers',
            name: `x${component.id}`,
            marker: { color: getComponentColor(component.id), size: 11 },
            hovertemplate: `x${component.id}: ω = %{x:.2f} rad/s<br>M = %{y:.4f}<extra></extra>`,
        })),
        ...components.map((component, index): Data => ({
            x: [component.omega],
            y: [responses[index].phaseLagDegrees],
            type: 'scatter',
            mode: 'markers',
            name: `x${component.id} phase`,
            yaxis: 'y2',
            showlegend: false,
            marker: {
                color: getComponentColor(component.id),
                size: 9,
                symbol: 'diamond',
            },
            hovertemplate: `x${component.id}: ω = %{x:.2f} rad/s<br>φ = %{y:.2f}°<extra></extra>`,
        })),
    ];

    const layout: Partial<Layout> = {
        height: 340,
        margin: { l: 60, r: 60, t: 20, b: 65 },
        xaxis: {
            title: { text: 'Angular frequency ω (rad/s)' },
            type: 'log',
            range: [minLog, Math.log10(25)],
        },
        yaxis: {
            title: { text: 'Amplitude ratio M' },
            range: [0, 1.05],
        },
        yaxis2: {
            title: { text: 'Phase lag φ (°)' },
            overlaying: 'y',
            side: 'right',
            range: [-95, 0],
            tick0: 0,
            dtick: 15,
            showgrid: false,
        },
        shapes:
            cutoff >= MIN_OMEGA && cutoff <= MAX_OMEGA
                ? [
                      {
                          type: 'line',
                          xref: 'x',
                          yref: 'paper',
                          x0: cutoff,
                          x1: cutoff,
                          y0: 0,
                          y1: 1,
                          line: {
                              color: 'var(--chart-axis)',
                              dash: 'dash',
                              width: 1,
                          },
                      },
                  ]
                : [],
        legend: { orientation: 'h', y: -0.25 },
        hovermode: 'closest',
    };

    return <ThemedPlot data={data} layout={layout} className="h-[340px] min-h-[340px]" />;
}
