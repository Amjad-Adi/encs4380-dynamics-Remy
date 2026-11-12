import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

import { useChartTheme } from '@/hooks/use-chart-theme.ts';

import {
    generateTimeResponse,
    type FirstOrderInputType,
    type FirstOrderParameters,
} from '@/features/first-order-time/domain/first-order-time.ts';

interface TimeResponseChartProps {
    parameters: FirstOrderParameters;
    inputType: FirstOrderInputType;
    duration: number;
}

const FRACTION_AT_TAU = 0.6321205588;
const FRACTION_AT_THREE_TAU = 0.9502129316;

export function TimeResponseChart({ parameters, inputType, duration }: TimeResponseChartProps) {
    const theme = useChartTheme();

    const { gain, tau, amplitude } = parameters;
    const finalValue = gain * amplitude;

    const points = generateTimeResponse(parameters, inputType, duration);

    const traces: Data[] = [
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.input),
            type: 'scatter',
            mode: 'lines',
            name: 'Input x(t)',
            line: {
                color: '#3978c5',
                width: 2,
                dash: 'dash',
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: 'Output y(t)',
            line: {
                color: '#159b98',
                width: 3,
            },
        },
        {
            x: points.map((point) => point.time),
            y: points.map((point) => point.reference),
            type: 'scatter',
            mode: 'lines',
            name: 'Ideal output Kx(t)',
            line: {
                color: '#d69a35',
                width: 1.5,
                dash: 'dot',
            },
        },
    ];

    const valueAtTau = FRACTION_AT_TAU * finalValue;
    const valueAtThreeTau = FRACTION_AT_THREE_TAU * finalValue;

    if (inputType === 'step') {
        traces.push(
            {
                x: [tau],
                y: [valueAtTau],
                type: 'scatter',
                mode: 'markers',
                name: '63.2% at τ',
                marker: {
                    color: '#d69a35',
                    size: 11,
                },
            },
            {
                x: [3 * tau],
                y: [valueAtThreeTau],
                type: 'scatter',
                mode: 'markers',
                name: '95% at 3τ',
                marker: {
                    color: '#d65d67',
                    size: 11,
                    symbol: 'diamond',
                },
            },
        );
    }

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
            title: { text: 'Amplitude' },
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            color: theme.muted,
        },

        legend: {
            orientation: 'h',
            y: -0.22,
        },

        hovermode: 'x unified',

        shapes:
            inputType === 'step'
                ? [
                      {
                          type: 'line',
                          x0: tau,
                          x1: tau,
                          y0: 0,
                          y1: valueAtTau,
                          line: {
                              color: '#d69a35',
                              dash: 'dot',
                          },
                      },
                      {
                          type: 'line',
                          x0: 0,
                          x1: tau,
                          y0: valueAtTau,
                          y1: valueAtTau,
                          line: {
                              color: '#d69a35',
                              dash: 'dot',
                          },
                      },
                      {
                          type: 'line',
                          x0: 3 * tau,
                          x1: 3 * tau,
                          y0: 0,
                          y1: valueAtThreeTau,
                          line: {
                              color: '#d65d67',
                              dash: 'dot',
                          },
                      },
                      {
                          type: 'line',
                          x0: 0,
                          x1: 3 * tau,
                          y0: valueAtThreeTau,
                          y1: valueAtThreeTau,
                          line: {
                              color: '#d65d67',
                              dash: 'dot',
                          },
                      },
                  ]
                : [],

        annotations:
            inputType === 'step'
                ? [
                      {
                          x: tau / 2,
                          y: valueAtTau,
                          text: '63.2%',
                          showarrow: false,
                          yshift: 13,
                          font: {
                              color: '#b9791f',
                              size: 10,
                          },
                      },
                      {
                          x: 1.5 * tau,
                          y: valueAtThreeTau,
                          text: '95%',
                          showarrow: false,
                          yshift: -14,
                          font: {
                              color: '#c04a55',
                              size: 10,
                          },
                      },
                  ]
                : [],
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
