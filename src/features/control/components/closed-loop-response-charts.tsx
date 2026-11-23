import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActuatorLimits } from '@/features/control/domain';

/** Chart colours shared by the Control modules (the toolkit's scientific palette). */
export const CONTROL_CHART_COLORS = {
    setpoint: '#d69a35',
    output: '#159b98',
    reference: '#8a70c5',
    control: '#3978c5',
    limit: '#d65d67',
} as const;

interface ResponsePoint {
    time: number;
    setpoint: number;
    output: number;
    control: number;
}

interface ClosedLoopResponseChartsProps {
    points: readonly ResponsePoint[];
    limits: ActuatorLimits;
    outputLabel?: string;
    /** Optional comparison response drawn dashed, e.g. the continuous loop in P3. */
    reference?: { label: string; points: readonly { time: number; output: number }[] };
    /** Optional markers at the controller sampling instants (P3). */
    samples?: readonly { time: number; output: number }[];
    responseDescription?: string;
    controlDescription?: string;
}

const RESPONSE_HEIGHT = 330;
const CONTROL_HEIGHT = 300;

/** Setpoint/output and actuator-command plots used by P1 and P3. */
export function ClosedLoopResponseCharts({
    points,
    limits,
    outputLabel = 'Plant output y(t)',
    reference,
    samples,
    responseDescription = 'Compare the plant output with the requested setpoint.',
    controlDescription = 'The actuator command is clipped at the configured lower and upper limits.',
}: ClosedLoopResponseChartsProps) {
    const x = points.map((point) => point.time);
    const firstTime = x[0] ?? 0;
    const lastTime = x[x.length - 1] ?? 0;

    const responseData: Data[] = [
        {
            x: [firstTime, lastTime],
            y: [points[0]?.setpoint ?? 0, points[0]?.setpoint ?? 0],
            type: 'scatter',
            mode: 'lines',
            name: 'Setpoint r(t)',
            line: { color: CONTROL_CHART_COLORS.setpoint, width: 2, dash: 'dash' },
        },
        ...(reference
            ? [
                  {
                      x: reference.points.map((point) => point.time),
                      y: reference.points.map((point) => point.output),
                      type: 'scatter',
                      mode: 'lines',
                      name: reference.label,
                      line: { color: CONTROL_CHART_COLORS.reference, width: 2, dash: 'dot' },
                  } satisfies Data,
              ]
            : []),
        {
            x,
            y: points.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: outputLabel,
            line: { color: CONTROL_CHART_COLORS.output, width: 3 },
        },
        ...(samples && samples.length <= 400
            ? [
                  {
                      x: samples.map((sample) => sample.time),
                      y: samples.map((sample) => sample.output),
                      type: 'scatter',
                      mode: 'markers',
                      name: 'Samples y[k]',
                      marker: { color: CONTROL_CHART_COLORS.output, size: 5 },
                      hoverinfo: 'skip',
                  } satisfies Data,
              ]
            : []),
    ];

    const controlData: Data[] = [
        {
            x,
            y: points.map((point) => point.control),
            type: 'scatter',
            mode: 'lines',
            name: 'Control signal u(t)',
            line: { color: CONTROL_CHART_COLORS.control, width: 2.5, shape: 'hv' },
        },
        {
            x: [firstTime, lastTime],
            y: [limits.min, limits.min],
            type: 'scatter',
            mode: 'lines',
            name: 'Lower limit',
            line: { color: CONTROL_CHART_COLORS.limit, width: 1, dash: 'dot' },
            hoverinfo: 'skip',
        },
        {
            x: [firstTime, lastTime],
            y: [limits.max, limits.max],
            type: 'scatter',
            mode: 'lines',
            name: 'Upper limit',
            line: { color: CONTROL_CHART_COLORS.limit, width: 1, dash: 'dot' },
            hoverinfo: 'skip',
        },
    ];

    const responseLayout: Partial<Layout> = {
        autosize: true,
        height: RESPONSE_HEIGHT,
        margin: { l: 65, r: 25, t: 15, b: 65 },
        legend: { orientation: 'h', y: -0.25 },
        hovermode: 'x unified',
        xaxis: { title: { text: 'Time (s)' } },
        yaxis: { title: { text: 'Amplitude' } },
    };

    const controlLayout: Partial<Layout> = {
        ...responseLayout,
        height: CONTROL_HEIGHT,
        yaxis: { title: { text: 'Control output u(t)' } },
    };

    return (
        <div className="min-w-0 space-y-4">
            <Card>
                <CardHeader className="pb-1">
                    <CardTitle className="text-base">Closed-loop response</CardTitle>
                    <CardDescription>{responseDescription}</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-4">
                    <ThemedPlot
                        data={responseData}
                        layout={responseLayout}
                        className="h-[330px] min-h-[330px]"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-1">
                    <CardTitle className="text-base">Controller output</CardTitle>
                    <CardDescription>{controlDescription}</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-4">
                    <ThemedPlot
                        data={controlData}
                        layout={controlLayout}
                        className="h-[300px] min-h-[300px]"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
