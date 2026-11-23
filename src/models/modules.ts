import {
    Activity,
    AudioWaveform,
    Bot,
    Calculator,
    CircuitBoard,
    Crosshair,
    Gauge,
    LayoutGrid,
    ScanSearch,
    Sigma,
    SlidersHorizontal,
    Timer,
    Trophy,
    Waves,
    Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ToolkitSectionId = 'dynamics' | 'control';

export interface ToolkitModule {
    /** Short code shown before the label: "01"…"07" in Homework 1, "P1"…"P4" in Control. */
    number?: string;
    label: string;
    /** Absolute route path. */
    path: string;
    icon: LucideIcon;
    available: boolean;
    description: string;
    section: ToolkitSectionId;
}

export interface ToolkitSection {
    id: ToolkitSectionId;
    label: string;
    homework: string;
    description: string;
    icon: LucideIcon;
    /** Where the section tab in the header leads. */
    entryPath: string;
    /** Optional section overview page shown before the modules. */
    overview?: { label: string; path: string; icon: LucideIcon };
    modules: ToolkitModule[];
}

export const DYNAMICS_MODULES: ToolkitModule[] = [
    {
        number: '01',
        label: 'First-order time response',
        path: '/time-response',
        icon: Activity,
        available: true,
        description: 'Step and ramp responses of K/(τs + 1), the 63.2% point and ramp lag.',
        section: 'dynamics',
    },
    {
        number: '02',
        label: 'First-order frequency response',
        path: '/frequency-response',
        icon: AudioWaveform,
        available: true,
        description: 'Amplitude ratio, phase lag and Bode plots of a first-order sensor.',
        section: 'dynamics',
    },
    {
        number: '03',
        label: 'Second-order response',
        path: '/second-order',
        icon: Gauge,
        available: true,
        description: 'Damping, natural frequency, poles and the mass–spring–damper model.',
        section: 'dynamics',
    },
    {
        number: '04',
        label: 'Guess the sensor',
        path: '/sensor-challenge',
        icon: ScanSearch,
        available: true,
        description: 'Identify a hidden random sensor from its noisy step response.',
        section: 'dynamics',
    },
    {
        number: '05',
        label: 'Pole explorer',
        path: '/pole-explorer',
        icon: Crosshair,
        available: true,
        description: 'Drag poles in the s-plane and watch the step response change.',
        section: 'dynamics',
    },
    {
        number: '06',
        label: 'Superposition simulator',
        path: '/superposition',
        icon: Sigma,
        available: true,
        description: 'Multi-tone inputs through a first-order sensor, term by term.',
        section: 'dynamics',
    },
    {
        number: '07',
        label: 'Numerical ODE solver',
        path: '/numerical-ode',
        icon: Calculator,
        available: true,
        description: 'Euler versus RK4 accuracy and stability against the exact solution.',
        section: 'dynamics',
    },
];

export const CONTROL_OVERVIEW_PATH = '/control';

export const CONTROL_MODULES: ToolkitModule[] = [
    {
        number: 'P1',
        label: 'PID playground',
        path: '/control/pid-playground',
        icon: SlidersHorizontal,
        available: true,
        description:
            'Tune Kp, Ki and Kd on the Module 1 first-order or Module 3 second-order plant with actuator limits.',
        section: 'control',
    },
    {
        number: 'P2',
        label: 'Slow sensor in the loop',
        path: '/control/slow-sensor-pid',
        icon: Timer,
        available: true,
        description:
            'Put a first-order sensor in the feedback path and see how measurement lag erodes stability.',
        section: 'control',
    },
    {
        number: 'P3',
        label: 'Digital PID',
        path: '/control/digital-pid',
        icon: CircuitBoard,
        available: true,
        description:
            'Run the controller at a sample period Ts with a zero-order hold and compare it with the continuous loop.',
        section: 'control',
    },
    {
        number: 'P4',
        label: 'Tuning challenge',
        path: '/control/tuning-challenge',
        icon: Trophy,
        available: true,
        description:
            'Tune a PID for a hidden plant drawn like Module 4 and meet an overshoot, settling and error spec.',
        section: 'control',
    },
    {
        label: 'MySystem',
        path: '/control/my-system',
        icon: Bot,
        available: true,
        description:
            'Design dual-motor speed control for a micromouse and export the ESP32 sketch.',
        section: 'control',
    },
];

export const TOOLKIT_SECTIONS: ToolkitSection[] = [
    {
        id: 'dynamics',
        label: 'Dynamic characteristics',
        homework: 'Homework 1',
        description:
            'Time and frequency responses of first- and second-order measurement systems, sensor identification and numerical simulation.',
        icon: Waves,
        entryPath: DYNAMICS_MODULES[0].path,
        modules: DYNAMICS_MODULES,
    },
    {
        id: 'control',
        label: 'Control',
        homework: 'Homework 2',
        description:
            'Closed-loop PID control built on the Homework 1 plant models: continuous, sensor-limited and digital loops, a tuning challenge and a real motor design.',
        icon: Workflow,
        entryPath: CONTROL_OVERVIEW_PATH,
        overview: { label: 'Overview', path: CONTROL_OVERVIEW_PATH, icon: LayoutGrid },
        modules: CONTROL_MODULES,
    },
];

/** Every module in navigation order. */
export const MODULES: ToolkitModule[] = TOOLKIT_SECTIONS.flatMap((section) => section.modules);

function normalizePath(pathname: string): string {
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

export function getSectionForPath(pathname: string): ToolkitSection | null {
    const path = normalizePath(pathname);
    return (
        TOOLKIT_SECTIONS.find(
            (section) =>
                section.overview?.path === path ||
                section.modules.some((module) => module.path === path),
        ) ?? null
    );
}

export function getModuleForPath(pathname: string): ToolkitModule | null {
    const path = normalizePath(pathname);
    return MODULES.find((module) => module.path === path) ?? null;
}

/** Previous and next modules within the same section, for in-section paging. */
export function getAdjacentModules(pathname: string) {
    const module = getModuleForPath(pathname);
    if (!module) return { previous: null, next: null };
    const modules = TOOLKIT_SECTIONS.find((section) => section.id === module.section)!.modules;
    const index = modules.indexOf(module);
    return {
        previous: index > 0 ? modules[index - 1] : null,
        next: index < modules.length - 1 ? modules[index + 1] : null,
    };
}

export function formatModuleLabel(module: ToolkitModule): string {
    return module.number ? `${module.number} · ${module.label}` : module.label;
}
