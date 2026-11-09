import { useMemo } from 'react';
import { Activity, ClipboardCheck } from 'lucide-react';

import { MetricCard } from '@/components/modules/metric-card';
import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    getEigenvaluesOfA,
    getStateSpaceMatrices,
    getSystemPoles,
    getResponseMetrics,
    type PhysicalParameters,
} from '@/features/second-order/domain/second-order';
import { PhasePlaneChart } from '../charts/phase-plane-chart';

interface AnalysisSectionProps {
    parameters: PhysicalParameters;
    phasePlaneDuration: number;
}

interface FixedCheck {
    label: string;
    expected: string;
    calculated: string;
    passed: boolean;
}

function formatPole(real: number, imaginary: number): string {
    if (imaginary === 0) return real.toFixed(4);
    return `${real.toFixed(4)} ${imaginary < 0 ? '−' : '+'} j${Math.abs(imaginary).toFixed(4)}`;
}

function getFixedChecks(): FixedCheck[] {
    const underdamped = getResponseMetrics({ m: 1, b: 2, k: 4 });
    const critical = getResponseMetrics({ m: 1, b: 4, k: 4 });
    const benchmarkParameters = { m: 1, b: 2, k: 4 };
    const eigenvalues = getEigenvaluesOfA(benchmarkParameters);
    const poles = getSystemPoles(benchmarkParameters);
    const expectedImaginary = Math.sqrt(3);
    const expectedEigenvalues = [
        { real: -1, imaginary: expectedImaginary },
        { real: -1, imaginary: -expectedImaginary },
    ];
    const eigenvaluesMatch = expectedEigenvalues.every((expected) =>
        eigenvalues.some((actual) =>
            Math.hypot(
                actual.real - expected.real,
                actual.imaginary - expected.imaginary,
            ) <= 0.001,
        ),
    );
    const polesMatchEigenvalues = poles.every((pole) =>
        eigenvalues.some((eigenvalue) =>
            Math.hypot(
                pole.real - eigenvalue.real,
                pole.imaginary - eigenvalue.imaginary,
            ) <= 1e-9,
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

export function AnalysisSection({
    parameters,
    phasePlaneDuration,
}: AnalysisSectionProps) {
    const matrices = useMemo(
        () => getStateSpaceMatrices(parameters),
        [parameters],
    );
    const eigenvalues = useMemo(
        () => getEigenvaluesOfA(parameters),
        [parameters],
    );
    const fixedChecks = useMemo(() => getFixedChecks(), []);
    const allChecksPassed = fixedChecks.every((check) => check.passed);

    return (
        <SharedAnalysisSection
            title="State-space and phase-plane analysis"
            description="The state vector is [x, ẋ]ᵀ and the input is physical force F(t)."
            icon={Activity}
            className="space-y-5"
        >
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                        <Card className="min-w-0">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Physical state-space model
                                </CardTitle>
                                <CardDescription>
                                    Matrices update from the current mass, damping, and
                                    stiffness.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { name: 'A', rows: matrices.A },
                                    { name: 'B', rows: matrices.B },
                                    { name: 'C', rows: matrices.C },
                                ].map(({ name, rows }) => (
                                    <div
                                        key={name}
                                        className="min-w-0 rounded-lg border border-border bg-muted/30 p-3"
                                    >
                                        <p className="mb-2 font-mono text-sm font-semibold">
                                            {name}
                                        </p>
                                        <div className="space-y-1 font-mono text-xs tabular-nums">
                                            {rows.map((row, rowIndex) => (
                                                <p
                                                    key={`${name}-${rowIndex}`}
                                                    className="break-all"
                                                >
                                                    [{row.map((value) => value.toFixed(4)).join(', ')}]
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="min-w-0">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Eigenvalues of A
                                </CardTitle>
                                <CardDescription>
                                    Independently calculated from A; these match the
                                    roots of ms² + bs + k = 0.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-2">
                                {eigenvalues.map((eigenvalue, index) => (
                                    <MetricCard
                                        key={`eigenvalue-${index}`}
                                        label={`λ${index + 1}`}
                                        value={formatPole(
                                            eigenvalue.real,
                                            eigenvalue.imaginary,
                                        )}
                                        detail="s⁻¹"
                                        icon={Activity}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Phase-plane trajectory
                            </CardTitle>
                            <CardDescription>
                                Displacement versus velocity for the current system
                                under a 1 N step from rest.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="min-w-0">
                            <PhasePlaneChart
                                parameters={parameters}
                                duration={phasePlaneDuration}
                            />
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base">
                                        Fixed benchmark results: m=1, b=2, k=4
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Assignment reference checks; these values are
                                        fixed and do not change with interactive
                                        parameters.
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        allChecksPassed
                                            ? 'border-success/30 bg-success/5 text-success'
                                            : 'border-destructive/30 bg-destructive/5 text-destructive'
                                    }
                                >
                                    <ClipboardCheck />
                                    {allChecksPassed ? 'PASS' : 'FAIL'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {fixedChecks.map((check) => (
                                <div
                                    key={check.label}
                                    className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">
                                            {check.label}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Expected: {check.expected}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Calculated: {check.calculated}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            check.passed
                                                ? 'w-fit border-success/30 bg-success/5 text-success'
                                                : 'w-fit border-destructive/30 bg-destructive/5 text-destructive'
                                        }
                                    >
                                        {check.passed ? 'PASS' : 'FAIL'}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
        </SharedAnalysisSection>
    );
}
