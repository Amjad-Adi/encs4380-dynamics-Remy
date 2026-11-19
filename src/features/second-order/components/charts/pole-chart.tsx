import { useMemo } from 'react';
import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';
import {
    getEigenvaluesOfA,
    getSystemPoles,
    type PhysicalParameters,
} from '@/features/second-order/domain';

interface PoleChartProps {
    parameters: PhysicalParameters;
}

export function PoleChart({ parameters }: PoleChartProps) {
    const poles = useMemo(() => getSystemPoles(parameters), [parameters]);
    const eigenvalues = useMemo(() => getEigenvaluesOfA(parameters), [parameters]);

    const data: Data[] = [
        {
            x: poles.map((pole) => pole.real),
            y: poles.map((pole) => pole.imaginary),
            type: 'scatter',
            mode: 'markers',
            name: 'Transfer-function poles',
            marker: {
                color: '#d65d67',
                size: 12,
                symbol: 'x',
                line: { width: 2 },
            },
            customdata: poles.map((_, index) => index + 1),
            hovertemplate:
                'Pole %{customdata}<br>Real = %{x:.4f} s⁻¹<br>Imaginary = %{y:.4f} rad/s<extra></extra>',
        },
        {
            x: eigenvalues.map((eigenvalue) => eigenvalue.real),
            y: eigenvalues.map((eigenvalue) => eigenvalue.imaginary),
            type: 'scatter',
            mode: 'markers',
            name: 'Eigenvalues of A',
            marker: {
                color: '#159b98',
                size: 20,
                symbol: 'circle-open',
                line: { color: '#159b98', width: 2 },
            },
            customdata: eigenvalues.map((_, index) => index + 1),
            hovertemplate:
                'Eigenvalue %{customdata}<br>Real = %{x:.4f} s⁻¹<br>Imaginary = %{y:.4f} rad/s<extra></extra>',
        },
    ];

    const extent = Math.max(
        1,
        ...[...poles, ...eigenvalues].flatMap((point) => [
            Math.abs(point.real),
            Math.abs(point.imaginary),
        ]),
    );

    const layout: Partial<Layout> = {
        height: 300,
        margin: { l: 60, r: 20, t: 18, b: 75 },
        font: { size: 11 },
        xaxis: {
            title: { text: 'Real part (s⁻¹)' },
            range: [-1.25 * extent, 1.25 * extent],
        },
        yaxis: {
            title: { text: 'Imaginary part (rad/s)' },
            range: [-1.25 * extent, 1.25 * extent],
            scaleanchor: 'x',
            scaleratio: 1,
        },
        legend: { orientation: 'h', y: -0.3 },
        hovermode: 'closest',
    };

    return <ThemedPlot data={data} layout={layout} className="h-[300px] min-h-[300px]" />;
}
