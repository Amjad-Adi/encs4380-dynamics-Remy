import { BookOpen, Lightbulb, ScanSearch } from 'lucide-react';

import type { ModuleSection } from '@/components/modules/section-navigation';

export const SENSOR_CHALLENGE_SECTIONS: ModuleSection[] = [
    { id: 'model', label: 'How to play', icon: BookOpen },
    { id: 'sensor-challenge', label: 'Sensor challenge', icon: ScanSearch },
    { id: 'hints', label: 'Hints', icon: Lightbulb },
];
