import { Activity, BookOpen, Gauge, Lightbulb, SlidersHorizontal } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const SECOND_ORDER_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'prediction', label: 'Predict, then check', icon: Lightbulb },
    { id: 'analysis', label: 'Analysis', icon: Activity },
];
