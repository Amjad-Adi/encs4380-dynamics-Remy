import { Activity, BarChart3, BookOpen, Settings2 } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation.tsx';

export const SLOW_SENSOR_PID_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: Settings2 },
    { id: 'prediction', label: 'Predict, then check', icon: Activity },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
];
