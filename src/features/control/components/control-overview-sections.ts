import { Cpu, LayoutGrid, Scale } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const CONTROL_OVERVIEW_SECTIONS: ModuleSection[] = [
    { id: 'modules', label: 'Modules', icon: LayoutGrid },
    { id: 'shared-core', label: 'Shared core', icon: Cpu },
    { id: 'consistency', label: 'Consistency', icon: Scale },
];
