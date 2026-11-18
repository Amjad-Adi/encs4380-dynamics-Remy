import { Activity, BookOpen, Brain, SlidersHorizontal } from 'lucide-react';
import type { ModuleSection } from '@/components/modules/section-navigation';
export const PID_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: SlidersHorizontal },
    { id: 'analysis', label: 'Analysis', icon: Activity },
    { id: 'challenge', label: 'Predict & check', icon: Brain },
];
