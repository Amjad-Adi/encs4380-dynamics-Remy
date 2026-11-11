import { useMemo } from 'react';
import { Activity } from 'lucide-react';

import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import {
    getEigenvaluesOfA,
    getStateSpaceMatrices,
    type PhysicalParameters,
} from '@/features/second-order/domain';

import { getFixedChecks } from '../analysis/benchmark-checks';
import { BenchmarkResultsCard } from '../analysis/benchmark-results-card';
import { EigenvaluesCard } from '../analysis/eigenvalues-card';
import { PhasePlaneCard } from '../analysis/phase-plane-card';
import { StateSpaceCard } from '../analysis/state-space-card';

interface AnalysisSectionProps {
    parameters: PhysicalParameters;
    phasePlaneDuration: number;
}

export function AnalysisSection({ parameters, phasePlaneDuration }: AnalysisSectionProps) {
    const matrices = useMemo(() => getStateSpaceMatrices(parameters), [parameters]);

    const eigenvalues = useMemo(() => getEigenvaluesOfA(parameters), [parameters]);

    const fixedChecks = useMemo(() => getFixedChecks(), []);

    return (
        <SharedAnalysisSection
            title="State-space and phase-plane analysis"
            description="The state vector is [x, ẋ]ᵀ and the input is physical force F(t)."
            icon={Activity}
            className="space-y-5"
        >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <StateSpaceCard matrices={matrices} />

                <EigenvaluesCard eigenvalues={eigenvalues} />
            </div>

            <PhasePlaneCard parameters={parameters} duration={phasePlaneDuration} />

            <BenchmarkResultsCard checks={fixedChecks} />
        </SharedAnalysisSection>
    );
}
