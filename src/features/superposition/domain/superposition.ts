export const MIN_AMPLITUDE = 0;
export const MAX_AMPLITUDE = 5;
export const MIN_OMEGA = 0.1;
export const MAX_OMEGA = 20;
export const MIN_PHASE = -3.14;
export const MAX_PHASE = 3.14;
export const MIN_GAIN = 0.1;
export const MAX_GAIN = 5;
export const MIN_TAU = 0.01;
export const MAX_TAU = 5;

const DEG_PER_RAD = 180 / Math.PI;
const MIN_SAMPLES = 800;
const MAX_SAMPLES = 4000;
const SAMPLES_PER_PERIOD = 24;
const SETTLING_TIME_CONSTANTS = 5;
const MIN_INTEGRATION_STEPS = 20000;
const MAX_INTEGRATION_STEPS = 200000;
const VALIDATION_STRIDE = 10;

export const COMPONENT_COLORS = [
    '#e4572e',
    '#17a398',
    '#a259c6',
    '#d4a017',
    '#e83e8c',
    '#4caf50',
    '#8d6e63',
    '#00acc1',
];

export const INPUT_COLOR = '#98a6bb';
export const OUTPUT_COLOR = '#3978c5';
export const STEADY_STATE_COLOR = '#d69a35';

export interface SinusoidComponent {
    id: number;
    amplitude: number;
    omega: number;
    phase: number;
}

export interface SensorParameters {
    gain: number;
    tau: number;
}

export interface SuperpositionConfiguration {
    components: SinusoidComponent[];
    sensor: SensorParameters;
    nextId: number;
}

export interface ComponentResponse {
    id: number;
    magnitude: number;
    phaseLag: number;
    phaseLagDegrees: number;
    inputAmplitude: number;
    outputAmplitude: number;
    timeLag: number;
    omegaTau: number;
}

export interface SuperpositionPoint {
    time: number;
    components: number[];
    componentOutputs: number[];
    input: number;
    output: number;
    steadyStateOutput: number;
}

export interface SuperpositionValidationResult {
    label: string;
    expected: number;
    actual: number;
    unit: string;
    passed: boolean;
}

export const DEFAULT_SENSOR: SensorParameters = { gain: 1, tau: 0.5 };

const DEFAULT_COMPONENTS: Omit<SinusoidComponent, 'id'>[] = [
    { amplitude: 1, omega: 1, phase: 0 },
    { amplitude: 0.5, omega: 6, phase: 0 },
];

export function createDefaultConfiguration(): SuperpositionConfiguration {
    return {
        components: DEFAULT_COMPONENTS.map((component, index) => ({
            ...component,
            id: index + 1,
        })),
        sensor: { ...DEFAULT_SENSOR },
        nextId: DEFAULT_COMPONENTS.length + 1,
    };
}

/**
 * Colors are tied to the permanent component id, so a component keeps its
 * color in every chart and list even after other components are removed.
 */
export function getComponentColor(id: number): string {
    return COMPONENT_COLORS[(id - 1) % COMPONENT_COLORS.length];
}

export function addComponent(
    configuration: SuperpositionConfiguration,
    component: Omit<SinusoidComponent, 'id'> = { amplitude: 1, omega: 3, phase: 0 },
): SuperpositionConfiguration {
    return {
        ...configuration,
        components: [
            ...configuration.components,
            { ...clampComponent({ ...component, id: configuration.nextId }) },
        ],
        nextId: configuration.nextId + 1,
    };
}

export function removeComponent(
    configuration: SuperpositionConfiguration,
    id: number,
): SuperpositionConfiguration {
    return {
        ...configuration,
        components: configuration.components.filter((component) => component.id !== id),
    };
}

export function updateComponent(
    configuration: SuperpositionConfiguration,
    id: number,
    changes: Partial<Omit<SinusoidComponent, 'id'>>,
): SuperpositionConfiguration {
    return {
        ...configuration,
        components: configuration.components.map((component) =>
            component.id === id ? clampComponent({ ...component, ...changes }) : component,
        ),
    };
}

export function clampComponent(component: SinusoidComponent): SinusoidComponent {
    return {
        id: component.id,
        amplitude: clamp(component.amplitude, MIN_AMPLITUDE, MAX_AMPLITUDE),
        omega: clamp(component.omega, MIN_OMEGA, MAX_OMEGA),
        phase: clamp(component.phase, MIN_PHASE, MAX_PHASE),
    };
}

/**
 * Steady-state response of τ dy/dt + y = K x to x(t) = A sin(ωt + φ):
 * y_ss(t) = K A M sin(ωt + φ + θ), with M = 1/√(1 + (ωτ)²) and θ = −atan(ωτ).
 */
export function getComponentResponse(
    component: SinusoidComponent,
    sensor: SensorParameters,
): ComponentResponse {
    assertSensor(sensor);

    const omegaTau = component.omega * sensor.tau;
    const magnitude = 1 / Math.sqrt(1 + omegaTau ** 2);
    const phaseLag = -Math.atan(omegaTau);

    return {
        id: component.id,
        magnitude,
        phaseLag,
        phaseLagDegrees: phaseLag * DEG_PER_RAD,
        inputAmplitude: component.amplitude,
        outputAmplitude: sensor.gain * component.amplitude * magnitude,
        timeLag: -phaseLag / component.omega,
        omegaTau,
    };
}

export function evaluateComponent(component: SinusoidComponent, time: number): number {
    return component.amplitude * Math.sin(component.omega * time + component.phase);
}

export function evaluateInput(components: SinusoidComponent[], time: number): number {
    return components.reduce((sum, component) => sum + evaluateComponent(component, time), 0);
}

/**
 * Exact response of the first-order sensor starting at rest, y(0) = 0.
 * Each component contributes its steady-state sinusoid plus a decaying term
 * that cancels the steady-state value at t = 0:
 * y_i(t) = y_ss,i(t) − y_ss,i(0) e^(−t/τ).
 * Because the sensor is linear, the total output is the sum of every y_i(t).
 */
export function evaluateComponentOutput(
    component: SinusoidComponent,
    sensor: SensorParameters,
    time: number,
): { output: number; steadyState: number } {
    const response = getComponentResponse(component, sensor);
    const shiftedPhase = component.phase + response.phaseLag;

    const steadyState = response.outputAmplitude * Math.sin(component.omega * time + shiftedPhase);
    const initialSteadyState = response.outputAmplitude * Math.sin(shiftedPhase);

    return {
        output: steadyState - initialSteadyState * Math.exp(-time / sensor.tau),
        steadyState,
    };
}

export function getSimulationDuration(configuration: SuperpositionConfiguration): number {
    const { components, sensor } = configuration;
    const transientDuration = (SETTLING_TIME_CONSTANTS + 1) * sensor.tau;

    if (components.length === 0) {
        return Math.max(transientDuration, 10);
    }

    // Show at least two periods of the slowest component after the transient.
    const slowestOmega = Math.min(...components.map((component) => component.omega));
    const slowestPeriod = (2 * Math.PI) / slowestOmega;

    return Math.max(transientDuration + slowestPeriod, 2 * slowestPeriod);
}

export function generateSuperpositionResponse(
    configuration: SuperpositionConfiguration,
    duration = getSimulationDuration(configuration),
): SuperpositionPoint[] {
    const { components, sensor } = configuration;
    assertSensor(sensor);

    const fastestOmega = Math.max(MIN_OMEGA, ...components.map((component) => component.omega));
    const periods = (duration * fastestOmega) / (2 * Math.PI);
    const samples = Math.round(
        clamp(Math.ceil(periods * SAMPLES_PER_PERIOD), MIN_SAMPLES, MAX_SAMPLES),
    );

    return Array.from({ length: samples }, (_, index) => {
        const time = (index / (samples - 1)) * duration;
        const values = components.map((component) => evaluateComponent(component, time));
        const outputs = components.map((component) =>
            evaluateComponentOutput(component, sensor, time),
        );

        return {
            time,
            components: values,
            componentOutputs: outputs.map((output) => output.output),
            input: sum(values),
            output: sum(outputs.map((output) => output.output)),
            steadyStateOutput: sum(outputs.map((output) => output.steadyState)),
        };
    });
}

/**
 * Fourth-order Runge-Kutta integration of τ dy/dt + y = K x(t), used only to
 * validate the analytical superposition solution.
 */
export function integrateSensorNumerically(
    configuration: SuperpositionConfiguration,
    duration: number,
): { time: number; output: number }[] {
    const { components, sensor } = configuration;

    // Keep the step small against both τ and the fastest input period.
    const fastestOmega = Math.max(MIN_OMEGA, ...components.map((component) => component.omega));
    const steps = Math.round(
        clamp(
            Math.max(
                duration / (sensor.tau / 20),
                (duration * fastestOmega) / ((2 * Math.PI) / 200),
            ),
            MIN_INTEGRATION_STEPS,
            MAX_INTEGRATION_STEPS,
        ),
    );
    const step = duration / steps;
    const derivative = (time: number, output: number) =>
        (sensor.gain * evaluateInput(components, time) - output) / sensor.tau;

    const points = [{ time: 0, output: 0 }];
    let output = 0;

    for (let index = 0; index < steps; index += 1) {
        const time = index * step;
        const k1 = derivative(time, output);
        const k2 = derivative(time + step / 2, output + (step / 2) * k1);
        const k3 = derivative(time + step / 2, output + (step / 2) * k2);
        const k4 = derivative(time + step, output + step * k3);

        output += (step / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        points.push({ time: time + step, output });
    }

    return points;
}

export function getSuperpositionValidation(
    configuration: SuperpositionConfiguration,
): SuperpositionValidationResult[] {
    const { components, sensor } = configuration;
    const duration = getSimulationDuration(configuration);

    // Live check: analytical superposition against direct numerical integration.
    const numerical = integrateSensorNumerically(configuration, duration).filter(
        (_, index) => index % VALIDATION_STRIDE === 0,
    );
    const scale = Math.max(1, sensor.gain * totalAmplitude(components));
    const maximumError = Math.max(
        0,
        ...numerical.map((point) =>
            Math.abs(
                point.output -
                    sum(
                        components.map(
                            (component) =>
                                evaluateComponentOutput(component, sensor, point.time).output,
                        ),
                    ),
            ),
        ),
    );

    // Live check: after 10τ the transient term has decayed by e^(−10).
    const settledTime = 10 * sensor.tau;
    const settledError = Math.abs(
        sum(
            components.map((component) => {
                const response = evaluateComponentOutput(component, sensor, settledTime);
                return response.output - response.steadyState;
            }),
        ),
    );

    // Fixed checks: the per-component response must match the lecture formulas.
    const cutoff = getComponentResponse(
        { id: 0, amplitude: 1, omega: 1, phase: 0 },
        { gain: 1, tau: 1 },
    );
    const lecture = getComponentResponse(
        { id: 0, amplitude: 1, omega: 2, phase: 0 },
        { gain: 1, tau: 0.2 },
    );

    return [
        {
            label: 'Analytical output vs. numerical integration (current signal)',
            expected: 0,
            actual: maximumError,
            unit: 'max |error|',
            passed: maximumError < 1e-4 * scale,
        },
        {
            label: 'Transient remaining at t = 10τ (current signal)',
            expected: 0,
            actual: settledError,
            unit: 'abs',
            passed: settledError < 1e-3 * scale,
        },
        {
            label: 'Amplitude ratio at ωτ = 1',
            expected: 0.7071,
            actual: cutoff.magnitude,
            unit: 'ratio',
            passed: Math.abs(cutoff.magnitude - 0.7071) < 0.001,
        },
        {
            label: 'Phase lag at ωτ = 1',
            expected: -45,
            actual: cutoff.phaseLagDegrees,
            unit: 'degrees',
            passed: Math.abs(cutoff.phaseLagDegrees - -45) < 0.01,
        },
        {
            label: 'Amplitude ratio, τ = 0.2 s and ω = 2 rad/s',
            expected: 0.9285,
            actual: lecture.magnitude,
            unit: 'ratio',
            passed: Math.abs(lecture.magnitude - 0.9285) < 0.001,
        },
        {
            label: 'Phase lag, τ = 0.2 s and ω = 2 rad/s',
            expected: -21.8,
            actual: lecture.phaseLagDegrees,
            unit: 'degrees',
            passed: Math.abs(lecture.phaseLagDegrees - -21.8) < 0.2,
        },
    ];
}

export function getComponentExpression(component: SinusoidComponent, label: number): string {
    const phase =
        component.phase === 0
            ? ''
            : component.phase > 0
              ? `+${component.phase.toFixed(2)}`
              : `-${Math.abs(component.phase).toFixed(2)}`;

    return String.raw`x_{${label}}(t)=${component.amplitude.toFixed(2)}\sin(${component.omega.toFixed(2)}t${phase})`;
}

export function getOutputExpression(
    component: SinusoidComponent,
    sensor: SensorParameters,
    label: number,
): string {
    const response = getComponentResponse(component, sensor);
    const shiftedPhase = component.phase + response.phaseLag;
    const phase =
        Math.abs(shiftedPhase) < 0.005
            ? ''
            : shiftedPhase > 0
              ? `+${shiftedPhase.toFixed(2)}`
              : `-${Math.abs(shiftedPhase).toFixed(2)}`;

    return String.raw`y_{ss,${label}}(t)=${response.outputAmplitude.toFixed(2)}\sin(${component.omega.toFixed(2)}t${phase})`;
}

export function toDegrees(radians: number): number {
    return radians * DEG_PER_RAD;
}

export function totalAmplitude(components: SinusoidComponent[]): number {
    return sum(components.map((component) => component.amplitude));
}

export function getPeakValue(values: number[]): number {
    return values.reduce((peak, value) => Math.max(peak, Math.abs(value)), 0);
}

function assertSensor(sensor: SensorParameters) {
    if (!Number.isFinite(sensor.tau) || sensor.tau <= 0) {
        throw new RangeError('The time constant must be positive.');
    }
    if (!Number.isFinite(sensor.gain)) {
        throw new RangeError('The sensor gain must be finite.');
    }
}

function clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
}

function sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
}
