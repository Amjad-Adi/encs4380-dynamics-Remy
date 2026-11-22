import { Activity, BookOpen, Brain, SlidersHorizontal } from 'lucide-react';
import type { ModuleSection } from '@/components/modules/section-navigation';
export const TUNING_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Spec', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'analysis', label: 'Results', icon: Activity },
    { id: 'challenge', label: 'Predict & check', icon: Brain },
];
