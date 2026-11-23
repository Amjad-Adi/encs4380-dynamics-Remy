import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getFrequencyValidation } from '@/features/first-order-frequency/domain/first-order-frequency';
import { getStepValidation } from '@/features/first-order-time/domain/first-order-time';
import {
    getEigenvaluesOfA,
    getResponseMetrics,
    getSystemPoles,
} from '@/features/second-order/domain';
import { DYNAMICS_MODULES } from '@/models/modules';

interface ValidationRow {
    id: string;
    caseNumber: number;
    check: string;
    module: (typeof DYNAMICS_MODULES)[number];
    expected: string;
    computed: string;
    passed: boolean;
}

const [MODULE_01, MODULE_02, MODULE_03] = DYNAMICS_MODULES;

function formatComplex(real: number, imaginary: number) {
    return `${real.toFixed(3).replace('-', '−')} ± j${Math.abs(imaginary).toFixed(3)}`;
}

/** The homework's numerical validation cases, recomputed by the Homework 1 module code. */
function buildRows(): ValidationRow[] {
    const [atTau, atThreeTau] = getStepValidation({ gain: 1, tau: 1, amplitude: 1 });
    const [magnitude, phase, maximumTau, phaseAt50Hz] = getFrequencyValidation();

    const halfDamped = getResponseMetrics({ m: 1, b: 2, k: 4 });
    const criticallyDamped = getResponseMetrics({ m: 1, b: 4, k: 4 });

    const stateSpace = { m: 1, b: 2, k: 4 };
    const eigenvalue = getEigenvaluesOfA(stateSpace).find((value) => value.imaginary > 0)!;
    const pole = getSystemPoles(stateSpace).find((value) => value.imaginary > 0)!;
    const eigenvaluesMatchPoles =
        Math.hypot(eigenvalue.real - pole.real, eigenvalue.imaginary - pole.imaginary) < 1e-9;

    return [
        {
            id: 'step-tau',
            caseNumber: 1,
            check: 'Step response at t = τ (K = A = 1)',
            module: MODULE_01,
            expected: '0.632',
            computed: atTau.actual.toFixed(4),
            passed: atTau.passed,
        },
        {
            id: 'step-3tau',
            caseNumber: 2,
            check: 'Step response at t = 3τ (K = A = 1)',
            module: MODULE_01,
            expected: '0.950',
            computed: atThreeTau.actual.toFixed(4),
            passed: atThreeTau.passed,
        },
        {
            id: 'magnitude',
            caseNumber: 3,
            check: 'Amplitude ratio, τ = 0.2 s, ω = 2 rad/s',
            module: MODULE_02,
            expected: '≈ 0.93',
            computed: magnitude.actual.toFixed(4),
            passed: magnitude.passed,
        },
        {
            id: 'phase',
            caseNumber: 3,
            check: 'Phase lag, τ = 0.2 s, ω = 2 rad/s',
            module: MODULE_02,
            expected: '≈ 21.8°',
            computed: `${Math.abs(phase.actual).toFixed(2)}°`,
            passed: phase.passed,
        },
        {
            id: 'tau-max',
            caseNumber: 4,
            check: 'Largest τ for 100 Hz at 5% dynamic error',
            module: MODULE_02,
            expected: '≈ 0.52 ms',
            computed: `${maximumTau.actual.toFixed(4)} ms`,
            passed: maximumTau.passed,
        },
        {
            id: 'phase-50',
            caseNumber: 5,
            check: 'Phase lag at 50 Hz with that τ',
            module: MODULE_02,
            expected: '≈ 9.3°',
            computed: `${Math.abs(phaseAt50Hz.actual).toFixed(2)}°`,
            passed: phaseAt50Hz.passed,
        },
        {
            id: 'zeta-half',
            caseNumber: 6,
            check: 'Overshoot with ζ = 0.5',
            module: MODULE_03,
            expected: '≈ 16.3%',
            computed: `${halfDamped.percentageOvershoot.toFixed(2)}%`,
            passed: Math.abs(halfDamped.percentageOvershoot - 16.3) < 0.05,
        },
        {
            id: 'zeta-one',
            caseNumber: 7,
            check: 'Overshoot with ζ = 1',
            module: MODULE_03,
            expected: '0% (none)',
            computed: `${criticallyDamped.percentageOvershoot.toFixed(2)}%`,
            passed: criticallyDamped.percentageOvershoot === 0,
        },
        {
            id: 'eigenvalues',
            caseNumber: 8,
            check: 'Eigenvalues of A, m = 1, b = 2, k = 4',
            module: MODULE_03,
            expected: '−1 ± j1.732',
            computed: formatComplex(eigenvalue.real, eigenvalue.imaginary),
            passed:
                eigenvaluesMatchPoles &&
                Math.abs(eigenvalue.real + 1) < 1e-9 &&
                Math.abs(eigenvalue.imaginary - Math.sqrt(3)) < 1e-9,
        },
    ];
}

export function ValidationSummary() {
    const rows = useMemo(buildRows, []);
    const passed = rows.filter((row) => row.passed).length;

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-base">Homework validation cases</CardTitle>
                        <CardDescription>
                            Recomputed live in your browser by the Module 01, 02 and 03 code.
                        </CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className="border-success/40 bg-success/10 text-success font-mono"
                    >
                        {passed} / {rows.length} PASS
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <Table className="min-w-[620px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>Check</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead className="text-right">Expected</TableHead>
                            <TableHead className="text-right">Computed</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="text-muted-foreground font-mono">
                                    {row.caseNumber}
                                </TableCell>
                                <TableCell className="whitespace-normal">{row.check}</TableCell>
                                <TableCell>
                                    <Link
                                        to={row.module.path}
                                        className="text-primary font-mono text-xs underline-offset-4 hover:underline"
                                    >
                                        Module {row.module.number}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right font-mono tabular-nums">
                                    {row.expected}
                                </TableCell>
                                <TableCell className="text-right font-mono tabular-nums">
                                    {row.computed}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={row.passed ? 'default' : 'destructive'}>
                                        {row.passed ? 'PASS' : 'FAIL'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
