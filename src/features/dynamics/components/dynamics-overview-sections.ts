import { BadgeCheck, BookOpen, LayoutGrid } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const DYNAMICS_OVERVIEW_SECTIONS: ModuleSection[] = [
    { id: 'modules', label: 'Modules', icon: LayoutGrid },
    { id: 'core-models', label: 'Core models', icon: BookOpen },
    { id: 'validation', label: 'Validation', icon: BadgeCheck },
];
