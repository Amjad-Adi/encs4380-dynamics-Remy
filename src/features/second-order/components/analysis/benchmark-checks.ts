import {
    getEigenvaluesOfA,
    getResponseMetrics,
    getSystemPoles,
    type PhysicalParameters,
} from '@/features/second-order/domain';

import { formatPole } from './format-pole';

export interface FixedCheck {
    label: string;
    expected: string;
    calculated: string;
    passed: boolean;
}

export function getFixedChecks(): FixedCheck[] {
    const underdamped = getResponseMetrics({ m: 1, b: 2, k: 4 });
    const critical = getResponseMetrics({ m: 1, b: 4, k: 4 });

    const benchmarkParameters: PhysicalParameters = {
        m: 1,
        b: 2,
        k: 4,
    };

    const eigenvalues = getEigenvaluesOfA(benchmarkParameters);
    const poles = getSystemPoles(benchmarkParameters);

    const expectedImaginary = Math.sqrt(3);

    const expectedEigenvalues = [
        { real: -1, imaginary: expectedImaginary },
        { real: -1, imaginary: -expectedImaginary },
    ];

    const eigenvaluesMatch = expectedEigenvalues.every((expected) =>
        eigenvalues.some(
            (actual) =>
                Math.hypot(actual.real - expected.real, actual.imaginary - expected.imaginary) <=
                0.001,
        ),
    );

    const polesMatchEigenvalues = poles.every((pole) =>
        eigenvalues.some(
            (eigenvalue) =>
                Math.hypot(pole.real - eigenvalue.real, pole.imaginary - eigenvalue.imaginary) <=
                1e-9,
        ),
    );

    return [
        {
            label: 'Underdamped overshoot, ζ = 0.5',
            expected: '16.3%',
            calculated: `${underdamped.percentageOvershoot.toFixed(1)}%`,
            passed: Math.abs(underdamped.percentageOvershoot - 16.3) <= 0.05,
        },
        {
            label: 'Critical damping overshoot, ζ = 1',
            expected: '0%',
            calculated: `${critical.percentageOvershoot.toFixed(1)}%`,
            passed: Math.abs(critical.percentageOvershoot) <= 1e-9,
        },
        {
            label: 'Eigenvalues and poles, m=1, b=2, k=4',
            expected: 'λ(A) = poles = −1 ± j1.732',
            calculated:
                `λ(A): ${eigenvalues.map(({ real, imaginary }) => formatPole(real, imaginary)).join('; ')} · ` +
                `poles: ${poles.map(({ real, imaginary }) => formatPole(real, imaginary)).join('; ')}`,
            passed: eigenvaluesMatch && polesMatchEigenvalues,
        },
    ];
}
