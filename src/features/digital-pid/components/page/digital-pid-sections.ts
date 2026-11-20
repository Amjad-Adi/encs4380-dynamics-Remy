import { Activity, BarChart3, BookOpen, CircuitBoard, Settings2 } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const DIGITAL_PID_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Model', icon: BookOpen },
    { id: 'experiment', label: 'Experiment', icon: Settings2 },
    { id: 'architecture', label: 'Architecture', icon: CircuitBoard },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
];
