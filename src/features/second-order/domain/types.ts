export interface PhysicalParameters {
    m: number;
    b: number;
    k: number;
}

export interface ResponsePoint {
    time: number;
    displacement: number;
    normalizedResponse: number;
}

export interface ComplexPole {
    real: number;
    imaginary: number;
}

export interface StateSpaceMatrices {
    A: [[number, number], [number, number]];
    B: [[number], [number]];
    C: [[number, number]];
}

export interface ResponseMetrics {
    riseTime: number;
    peakTime: number | null;
    percentageOvershoot: number;
    settlingTime: number | null;
}

export interface PhasePlanePoint {
    time: number;
    displacement: number;
    velocity: number;
    normalizedDisplacement: number;
}

export interface ValidationResult {
    label: string;
    expected: number;
    actual: number;
    unit: string;
    passed: boolean;
}

export type DampingRegime = 'undamped' | 'underdamped' | 'critical' | 'overdamped';
