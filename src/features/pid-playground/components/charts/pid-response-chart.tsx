import type { Data, Layout } from 'plotly.js';

import { ThemedPlot } from '@/components/shared/themed-plot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type {
    PIDPlaygroundParameters,
    PIDResponsePoint,
} from '@/features/pid-playground/domain/pid-playground';

export function PIDResponseChart({
    parameters,
    points,
}: {
    parameters: PIDPlaygroundParameters;
    points: PIDResponsePoint[];
}) {
    const x = points.map((point) => point.time);

    const responseData: Data[] = [
        {
            x,
            y: points.map((point) => point.setpoint),
            type: 'scatter',
            mode: 'lines',
            name: 'Setpoint r(t)',
            line: { color: '#d69a35', width: 2, dash: 'dash' },
        },
        {
            x,
            y: points.map((point) => point.output),
            type: 'scatter',
            mode: 'lines',
            name: 'Plant output y(t)',
            line: { color: '#159b98', width: 3 },
        },
    ];

    const controlData: Data[] = [
        {
            x,
            y: points.map((point) => point.control),
            type: 'scatter',
            mode: 'lines',
            name: 'Control signal u(t)',
            line: { color: '#3978c5', width: 2.5, shape: 'hv' },
        },
        {
            x,
            y: points.map(() => parameters.outputMin),
            type: 'scatter',
            mode: 'lines',
            name: 'Lower limit',
            line: { color: '#d65d67', width: 1, dash: 'dot' },
            hoverinfo: 'skip',
        },
        {
            x,
            y: points.map(() => parameters.outputMax),
            type: 'scatter',
            mode: 'lines',
            name: 'Upper limit',
            line: { color: '#d65d67', width: 1, dash: 'dot' },
            hoverinfo: 'skip',
        },
    ];

    const commonLayout: Partial<Layout> = {
        autosize: true,
        height: 330,
        margin: { l: 65, r: 25, t: 15, b: 65 },
        legend: { orientation: 'h', y: -0.25 },
        hovermode: 'x unified',
        xaxis: { title: { text: 'Time (s)' } },
        yaxis: { title: { text: 'Amplitude' } },
    };

    const controlLayout: Partial<Layout> = {
        ...commonLayout,
        height: 300,
        yaxis: { ...commonLayout.yaxis, title: { text: 'Control output u(t)' } },
    };

    return (
        <div className="min-w-0 space-y-4">
            <Card>
                <CardHeader className="pb-1">
                    <CardTitle className="text-base">Closed-loop response</CardTitle>
                    <CardDescription>
                        Compare the plant output with the requested setpoint.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemedPlot
                        data={responseData}
                        layout={commonLayout}
                        className="h-[330px] min-h-[330px]"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-1">
                    <CardTitle className="text-base">Controller output</CardTitle>
                    <CardDescription>
                        The actuator command is clipped at the configured lower and upper limits.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
