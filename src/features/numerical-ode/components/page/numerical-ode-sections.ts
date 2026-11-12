import { Activity, LineChart, SlidersHorizontal, Target } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const NUMERICAL_ODE_SECTIONS: ModuleSection[] = [
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'comparison', label: 'Comparison', icon: LineChart },
    { id: 'errors', label: 'Error metrics', icon: Activity },
    { id: 'challenge', label: 'Prediction', icon: Target },
];
