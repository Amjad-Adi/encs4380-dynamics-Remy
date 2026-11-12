import { Activity, BookOpen, Crosshair, Lightbulb } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const POLE_EXPLORER_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Pole plane', icon: Crosshair },
    { id: 'prediction', label: 'Predict, then check', icon: Lightbulb },
    { id: 'analysis', label: 'Analysis', icon: Activity },
];
