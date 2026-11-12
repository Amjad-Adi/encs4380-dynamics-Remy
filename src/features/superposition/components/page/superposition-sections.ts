import { Activity, BookOpen, Lightbulb, SlidersHorizontal, Waves } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const SUPERPOSITION_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'frequency-effects', label: 'Frequency effects', icon: Waves },
    { id: 'prediction', label: 'Predict, then check', icon: Lightbulb },
    { id: 'analysis', label: 'Analysis', icon: Activity },
];
