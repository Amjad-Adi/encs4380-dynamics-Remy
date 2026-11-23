import {
    Activity,
    BarChart3,
    BookOpen,
    CircuitBoard,
    Settings2,
    SlidersHorizontal,
} from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const MY_SYSTEM_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'Plant model', icon: BookOpen },
    { id: 'identification', label: 'Parameter basis', icon: Activity },
    { id: 'experiment', label: 'Simulation', icon: Settings2 },
    { id: 'controller', label: 'PID design', icon: SlidersHorizontal },
    { id: 'analysis', label: 'Performance', icon: BarChart3 },
    { id: 'implementation', label: 'Arduino code', icon: CircuitBoard },
];
