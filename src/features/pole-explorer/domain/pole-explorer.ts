export const POLE_LIMIT = 6;

const MIN_REAL_MAGNITUDE = 0.2;
const IMAGINARY_SNAP = 0.15;
const STABILITY_EPSILON = 1e-6;
const CRITICAL_DAMPING_TOLERANCE = 0.08;
const DUPLICATE_POLE_TOLERANCE = 1e-9;

export type SystemOrder = 'first' | 'second';

export type PoleStability = 'stable' | 'marginal' | 'unstable';

export type DampingRegime = 'undamped' | 'underdamped' | 'critical' | 'overdamped';

export type SecondOrderKind = DampingRegime | 'saddle';

export interface ComplexPole {
    real: number;
    imaginary: number;
}

export interface PoleConfiguration {
    order: SystemOrder;
    poles: ComplexPole[];
}

export interface PoleCharacteristics {
    order: SystemOrder;
    stability: PoleStability;
    kind: 'first-order' | SecondOrderKind;
    dampingRatio: number | null;
    naturalFrequency: number | null;
    realPart: number;
    imaginaryPart: number;
    timeConstant: number | null;
    standardFormValid: boolean;
}

export interface ResponseMetrics {
    overshootPercent: number | null;
    peakTime: number | null;
    settlingTime: number | null;
}

export interface ResponsePoint {
    time: number;
    value: number;
}

export interface PolePreset {
    id: string;
    label: string;
    description: string;
    poles: ComplexPole[];
}

const DEFAULT_POLES: Record<SystemOrder, ComplexPole[]> = {
    first: [{ real: -2, imaginary: 0 }],
    second: [
        { real: -1, imaginary: 2 },
        { real: -1, imaginary: -2 },
    ],
};

export const FIRST_ORDER_PRESETS: PolePreset[] = [
    {
        id: 'stable',
        label: 'Stable pole',
        description: 'p = −2',
        poles: [{ real: -2, imaginary: 0 }],
    },
    {
        id: 'slow',
        label: 'Slow pole',
        description: 'p = −0.5',
        poles: [{ real: -0.5, imaginary: 0 }],
    },
    {
        id: 'unstable',
        label: 'Unstable pole',
        description: 'p = +2',
        poles: [{ real: 2, imaginary: 0 }],
    },
];

export const SECOND_ORDER_PRESETS: PolePreset[] = [
    {
        id: 'underdamped',
        label: 'Underdamped',
        description: '−1 ± j2',
        poles: [
            { real: -1, imaginary: 2 },
            { real: -1, imaginary: -2 },
        ],
    },
    {
        id: 'critical',
        label: 'Critically damped',
        description: '−2, −2',
        poles: [
            { real: -2, imaginary: 0 },
            { real: -2, imaginary: 0 },
        ],
    },
    {
        id: 'overdamped',
        label: 'Overdamped',
        description: '−1, −3',
        poles: [
            { real: -1, imaginary: 0 },
            { real: -3, imaginary: 0 },
        ],
    },
    {
        id: 'undamped',
        label: 'Undamped',
        description: '0 ± j2',
        poles: [
            { real: 0, imaginary: 2 },
            { real: 0, imaginary: -2 },
        ],
    },
    {
        id: 'unstable',
        label: 'Unstable pair',
        description: '+1 ± j2',
        poles: [
            { real: 1, imaginary: 2 },
            { real: 1, imaginary: -2 },
        ],
    },
];

export function getPresets(order: SystemOrder): PolePreset[] {
    return order === 'first' ? FIRST_ORDER_PRESETS : SECOND_ORDER_PRESETS;
}

export function createDefaultConfiguration(order: SystemOrder = 'second'): PoleConfiguration {
    return {
        order,
        poles: DEFAULT_POLES[order].map((pole) => ({ ...pole })),
    };
}

export function clampPole(pole: ComplexPole): ComplexPole {
    let real = roundCoordinate(Math.min(POLE_LIMIT, Math.max(-POLE_LIMIT, pole.real)));
    let imaginary = roundCoordinate(Math.min(POLE_LIMIT, Math.max(-POLE_LIMIT, pole.imaginary)));

    if (Math.abs(imaginary) < IMAGINARY_SNAP) {
        imaginary = 0;

        if (Math.abs(real) < MIN_REAL_MAGNITUDE) {
            real = real > 0 ? MIN_REAL_MAGNITUDE : -MIN_REAL_MAGNITUDE;
        }
    }

    return { real, imaginary };
}

export function getPoles(configuration: PoleConfiguration): ComplexPole[] {
    if (configuration.order === 'first') {
        return [
            clampPole({
                real: configuration.poles[0].real,
                imaginary: 0,
            }),
        ];
    }

    return [clampPole(configuration.poles[0]), clampPole(configuration.poles[1])];
}

export function getStability(poles: ComplexPole[]): PoleStability {
    const dominantReal = Math.max(...poles.map((pole) => pole.real));

    if (dominantReal > STABILITY_EPSILON) return 'unstable';
    if (dominantReal > -STABILITY_EPSILON) return 'marginal';
    return 'stable';
}

export function getCharacteristics(configuration: PoleConfiguration): PoleCharacteristics {
    const poles = getPoles(configuration);
    const stability = getStability(poles);

    if (configuration.order === 'first') {
        const pole = poles[0];

        return {
            order: 'first',
            stability,
            kind: 'first-order',
            dampingRatio: null,
            naturalFrequency: null,
            realPart: pole.real,
            imaginaryPart: 0,
            timeConstant: 1 / Math.abs(pole.real),
            standardFormValid: true,
        };
    }

    const [first, second] = poles;
    const imaginaryPart = Math.max(Math.abs(first.imaginary), Math.abs(second.imaginary));

    if (imaginaryPart > 0) {
        const realPart = (first.real + second.real) / 2;
        const naturalFrequency = Math.hypot(realPart, imaginaryPart);
        const dampingRatio = -realPart / naturalFrequency;

        return {
            order: 'second',
            stability,
            kind: Math.abs(dampingRatio) < STABILITY_EPSILON ? 'undamped' : 'underdamped',
            dampingRatio,
            naturalFrequency,
            realPart,
            imaginaryPart,
            timeConstant: null,
            standardFormValid: true,
        };
    }

    const product = first.real * second.real;
    const realPart = Math.max(first.real, second.real);

    if (product <= 0) {
        return {
            order: 'second',
            stability,
            kind: 'saddle',
            dampingRatio: null,
            naturalFrequency: null,
            realPart,
            imaginaryPart: 0,
            timeConstant: null,
            standardFormValid: false,
        };
    }

    const naturalFrequency = Math.sqrt(product);
    const dampingRatio = -(first.real + second.real) / (2 * naturalFrequency);
    const kind: SecondOrderKind =
        Math.abs(first.real - second.real) <= CRITICAL_DAMPING_TOLERANCE
            ? 'critical'
            : 'overdamped';

    return {
        order: 'second',
        stability,
        kind,
        dampingRatio,
        naturalFrequency,
        realPart,
        imaginaryPart: 0,
        timeConstant: null,
        standardFormValid: true,
    };
}

export function getResponseMetrics(configuration: PoleConfiguration): ResponseMetrics {
    const characteristics = getCharacteristics(configuration);
    const poles = getPoles(configuration);

    if (characteristics.stability === 'unstable' || characteristics.kind === 'saddle') {
        return {
            overshootPercent: null,
            peakTime: null,
            settlingTime: null,
        };
    }

    if (characteristics.order === 'first') {
        return {
            overshootPercent: 0,
            peakTime: null,
            settlingTime: 4 / Math.abs(poles[0].real),
        };
    }

    if (characteristics.imaginaryPart > 0) {
        const dampingRatio = characteristics.dampingRatio ?? 0;
        const dampedFrequency = characteristics.imaginaryPart;
        const overshootPercent =
            Math.abs(dampingRatio) < STABILITY_EPSILON
                ? 100
                : 100 * Math.exp((-dampingRatio * Math.PI) / Math.sqrt(1 - dampingRatio ** 2));

        return {
            overshootPercent,
            peakTime: Math.PI / dampedFrequency,
            settlingTime:
                characteristics.stability === 'stable'
                    ? 4 / Math.abs(characteristics.realPart)
                    : null,
        };
    }

    const slowestPole = Math.min(...poles.map((pole) => Math.abs(pole.real)));

    return {
        overshootPercent: 0,
        peakTime: null,
        settlingTime: 4 / slowestPole,
    };
}

export function getSuggestedDuration(configuration: PoleConfiguration): number {
    const characteristics = getCharacteristics(configuration);
    const poles = getPoles(configuration);

    if (characteristics.order === 'first') {
        const magnitude = Math.abs(poles[0].real);

        return characteristics.stability === 'unstable'
            ? clampDuration(3 / magnitude, 3, 8)
            : clampDuration(6 / magnitude, 5, 20);
    }

    if (characteristics.imaginaryPart > 0) {
        if (characteristics.stability === 'stable') {
            const settlingTime = 4 / Math.abs(characteristics.realPart);
            return clampDuration(settlingTime * 1.25, 6, 20);
        }

        if (characteristics.stability === 'marginal') {
            const period = (2 * Math.PI) / characteristics.imaginaryPart;
            return clampDuration(3 * period, 6, 20);
        }

        return clampDuration(4 / Math.abs(characteristics.realPart), 3, 8);
    }

    if (characteristics.kind === 'saddle') return 8;

    const slowestPole = Math.min(...poles.map((pole) => Math.abs(pole.real)));

    return clampDuration(6 / slowestPole, 6, 20);
}

export function generateStepResponse(
    configuration: PoleConfiguration,
    duration: number,
    sampleCount = 400,
): ResponsePoint[] {
    const characteristics = getCharacteristics(configuration);
    const poles = getPoles(configuration);

    return Array.from({ length: sampleCount + 1 }, (_, index) => {
        const time = (duration * index) / sampleCount;

        return {
            time,
            value: evaluateStepResponse(characteristics, poles, time),
        };
    });
}

export function movePole(
    configuration: PoleConfiguration,
    index: number,
    nextPole: ComplexPole,
): PoleConfiguration {
    if (configuration.order === 'first') {
        return {
            order: 'first',
            poles: [clampPole({ real: nextPole.real, imaginary: 0 })],
        };
    }

    const poles = configuration.poles.map((pole) => ({ ...pole }));
    const target = clampPole(nextPole);
    const otherIndex = index === 0 ? 1 : 0;

    if (target.imaginary !== 0) {
        poles[index] = target;
        poles[otherIndex] = {
            real: target.real,
            imaginary: -target.imaginary,
        };

        return { order: 'second', poles };
    }

    if (poles[otherIndex].imaginary !== 0) {
        const repeated = { real: target.real, imaginary: 0 };

        return {
            order: 'second',
            poles: [repeated, { ...repeated }],
        };
    }

    poles[index] = target;

    return { order: 'second', poles };
}

export function setConjugatePair(realPart: number, imaginaryPart: number): PoleConfiguration {
    const target = clampPole({
        real: realPart,
        imaginary: Math.abs(imaginaryPart),
    });

    if (target.imaginary === 0) {
        return {
            order: 'second',
            poles: [target, { ...target }],
        };
    }

    return {
        order: 'second',
        poles: [target, { real: target.real, imaginary: -target.imaginary }],
    };
}

export function formatPole(pole: ComplexPole, digits = 2): string {
    const real = formatNumber(pole.real, digits);

    if (Math.abs(pole.imaginary) < DUPLICATE_POLE_TOLERANCE) {
        return real;
    }

    const sign = pole.imaginary < 0 ? '−' : '+';
    return `${real} ${sign} j${formatNumber(Math.abs(pole.imaginary), digits)}`;
}

export function getPoleSummary(poles: ComplexPole[]): string {
    if (poles.length === 1) {
        return formatPole(poles[0]);
    }

    const [first, second] = poles;
    const isPair =
        Math.abs(first.real - second.real) < DUPLICATE_POLE_TOLERANCE &&
        Math.abs(first.imaginary + second.imaginary) < DUPLICATE_POLE_TOLERANCE;

    if (isPair && Math.abs(first.imaginary) > 0) {
        return `${formatNumber(first.real)} ± j${formatNumber(Math.abs(first.imaginary))}`;
    }

    if (isPair) {
        return `${formatNumber(first.real)} (double)`;
    }

    return poles.map((pole) => formatPole(pole)).join(' · ');
}

function evaluateStepResponse(
    characteristics: PoleCharacteristics,
    poles: ComplexPole[],
    time: number,
): number {
    if (characteristics.order === 'first') {
        return 1 - Math.exp(poles[0].real * time);
    }

    if (characteristics.imaginaryPart > 0) {
        const sigma = characteristics.realPart;
        const omega = characteristics.imaginaryPart;

        return (
            1 -
            Math.exp(sigma * time) *
                (Math.cos(omega * time) - (sigma / omega) * Math.sin(omega * time))
        );
    }

    const [first, second] = poles;

    if (Math.abs(first.real - second.real) < DUPLICATE_POLE_TOLERANCE) {
        const pole = first.real;

        return 1 - (1 - pole * time) * Math.exp(pole * time);
    }

    const firstReal = first.real;
    const secondReal = second.real;

    return (
        1 +
        (secondReal * Math.exp(firstReal * time) - firstReal * Math.exp(secondReal * time)) /
            (firstReal - secondReal)
    );
}

function clampDuration(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function formatNumber(value: number, digits = 2): string {
    return value.toFixed(digits).replace('-', '−');
}

function roundCoordinate(value: number): number {
    return Math.round(value * 100) / 100;
}
