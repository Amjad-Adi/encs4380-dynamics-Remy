import { Activity } from 'lucide-react';

import { SharedAnalysisSection } from '@/components/modules/sections/analysis-section';
import type { PoleCharacteristics } from '@/features/pole-explorer/domain/pole-explorer';
import { StabilityAnalysis } from '../analysis/stability-analysis';

interface AnalysisSectionProps {
    characteristics: PoleCharacteristics;
}

export function AnalysisSection({
    characteristics,
}: AnalysisSectionProps) {
    return (
        <SharedAnalysisSection
            title="Stability and damping analysis"
            description="The left- or right-half-plane position of every pole determines whether the response decays, oscillates, or grows."
            icon={Activity}
            className="space-y-5"
        >
            <StabilityAnalysis characteristics={characteristics} />
        </SharedAnalysisSection>
    );
}
