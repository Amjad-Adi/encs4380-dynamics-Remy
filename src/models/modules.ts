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
    /** Two-digit module number shown as "Module 01" in headers and "01" in navigation. */
    number?: string;
    label: string;
    /** Short label for the navigation bar and mobile sidebar; defaults to `label`. */
    navLabel?: string;
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
    /** Compact label for the header switcher on narrower desktop widths. */
    shortLabel: string;
    homework: string;
    description: string;
    /** Kicker shown above every module title in this section. */
    laboratory: string;
    icon: LucideIcon;
    /** Section overview page shown before the modules; the header tab leads here. */
    overview: { label: string; path: string; icon: LucideIcon };
    modules: ToolkitModule[];
}

export interface NavigationLink {
    to: string;
    label: string;
}

export const DYNAMICS_OVERVIEW_PATH = '/dynamics';
export const CONTROL_OVERVIEW_PATH = '/control';

export const DYNAMICS_MODULES: ToolkitModule[] = [
    {
        number: '01',
        label: 'First-order time response',
        navLabel: 'Time response',
        path: '/dynamics/time-response',
        icon: Activity,
        available: true,
        description: 'Step and ramp responses of K/(τs + 1), the 63.2% point and ramp lag.',
        section: 'dynamics',
    },
    {
        number: '02',
        label: 'First-order frequency response',
        navLabel: 'Frequency response',
        path: '/dynamics/frequency-response',
        icon: AudioWaveform,
        available: true,
        description: 'Amplitude ratio, phase lag and Bode plots of a first-order sensor.',
        section: 'dynamics',
    },
    {
        number: '03',
        label: 'Second-order response',
        navLabel: 'Second-order',
        path: '/dynamics/second-order',
        icon: Gauge,
        available: true,
        description: 'Damping, natural frequency, poles and the mass–spring–damper model.',
        section: 'dynamics',
    },
    {
        number: '04',
        label: 'Guess the sensor',
        path: '/dynamics/sensor-challenge',
        icon: ScanSearch,
        available: true,
        description: 'Identify a hidden random sensor from its noisy step response.',
        section: 'dynamics',
    },
    {
        number: '05',
        label: 'Pole explorer',
        path: '/dynamics/pole-explorer',
        icon: Crosshair,
        available: true,
        description: 'Drag poles in the s-plane and watch the step response change.',
        section: 'dynamics',
    },
    {
        number: '06',
        label: 'Superposition simulator',
        navLabel: 'Superposition',
        path: '/dynamics/superposition',
        icon: Sigma,
        available: true,
        description: 'Multi-tone inputs through a first-order sensor, term by term.',
        section: 'dynamics',
    },
    {
        number: '07',
        label: 'Numerical ODE solver',
        navLabel: 'Numerical ODE',
        path: '/dynamics/numerical-ode',
        icon: Calculator,
        available: true,
        description: 'Euler versus RK4 accuracy and stability against the exact solution.',
        section: 'dynamics',
    },
];

export const CONTROL_MODULES: ToolkitModule[] = [
    {
        number: '01',
        label: 'PID playground',
        path: '/control/pid-playground',
        icon: SlidersHorizontal,
        available: true,
        description:
            'Tune Kp, Ki and Kd on the Homework 1 first-order or second-order plant with actuator limits.',
        section: 'control',
    },
    {
        number: '02',
        label: 'Slow sensor in the loop',
        navLabel: 'Slow sensor',
        path: '/control/slow-sensor-pid',
        icon: Timer,
        available: true,
        description:
            'Put a first-order sensor in the feedback path and see how measurement lag erodes stability.',
        section: 'control',
    },
    {
        number: '03',
        label: 'Digital PID',
        path: '/control/digital-pid',
        icon: CircuitBoard,
        available: true,
        description:
            'Run the controller at a sample period Ts with a zero-order hold and compare it with the continuous loop.',
        section: 'control',
    },
    {
        number: '04',
        label: 'Tuning challenge',
        path: '/control/tuning-challenge',
        icon: Trophy,
        available: true,
        description:
            'Tune a PID for a hidden plant drawn like Homework 1 Module 04 and meet an overshoot, settling and error spec.',
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
        shortLabel: 'Dynamics',
        homework: 'Homework 1',
        description:
            'Time and frequency responses of first- and second-order measurement systems, sensor identification and numerical simulation.',
        laboratory: 'Dynamic characteristics laboratory',
        icon: Waves,
        overview: { label: 'Overview', path: DYNAMICS_OVERVIEW_PATH, icon: LayoutGrid },
        modules: DYNAMICS_MODULES,
    },
    {
        id: 'control',
        label: 'Control',
        shortLabel: 'Control',
        homework: 'Homework 2',
        description:
            'Closed-loop PID control built on the Homework 1 plant models: continuous, sensor-limited and digital loops, a tuning challenge and a real motor design.',
        laboratory: 'Feedback control laboratory',
        icon: Workflow,
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
                section.overview.path === path ||
                section.modules.some((module) => module.path === path),
        ) ?? null
    );
}

export function getModuleForPath(pathname: string): ToolkitModule | null {
    const path = normalizePath(pathname);
    return MODULES.find((module) => module.path === path) ?? null;
}

export function isSectionOverview(pathname: string): boolean {
    const path = normalizePath(pathname);
    return TOOLKIT_SECTIONS.some((section) => section.overview.path === path);
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

/** "Module 02 · First-order frequency response", or the bare label for unnumbered pages. */
export function getModuleTitle(module: ToolkitModule): string {
    return module.number ? `Module ${module.number} · ${module.label}` : module.label;
}

/** Navigation label: "02 · Frequency response". */
export function getModuleNavLabel(module: ToolkitModule): string {
    const label = module.navLabel ?? module.label;
    return module.number ? `${module.number} · ${label}` : label;
}

/** Header badge: "MODULE 02", or the page name for unnumbered pages. */
export function getModuleBadge(module: ToolkitModule): string {
    return module.number ? `MODULE ${module.number}` : module.label.toUpperCase();
}

function continueLabel(module: ToolkitModule): string {
    return module.number
        ? `Continue to Module ${module.number}: ${module.label} →`
        : `Continue to ${module.label} →`;
}

/**
 * The "back" and "continue" links shown in every page header, derived from the
 * registry so both homeworks follow the same pattern:
 * - overview pages: back to Home, continue to Module 01;
 * - modules: back to the section overview, continue to the next module, then to the
 *   next homework's overview, and finally back to the last section's overview.
 */
export function getPageLinks(pathname: string): {
    parent: NavigationLink | null;
    next: NavigationLink | null;
} {
    const path = normalizePath(pathname);
    const section = getSectionForPath(path);
    if (!section) return { parent: null, next: null };

    if (section.overview.path === path) {
        const first = section.modules[0];
        return {
            parent: { to: '/', label: 'Home' },
            next: first
                ? {
                      to: first.path,
                      label: first.number
                          ? `Start with Module ${first.number}: ${first.label} →`
                          : `Start with ${first.label} →`,
                  }
                : null,
        };
    }

    const parent = { to: section.overview.path, label: `${section.label} overview` };
    const { next } = getAdjacentModules(path);
    if (next) return { parent, next: { to: next.path, label: continueLabel(next) } };

    const sectionIndex = TOOLKIT_SECTIONS.indexOf(section);
    const nextSection = TOOLKIT_SECTIONS[sectionIndex + 1];
    if (nextSection) {
        return {
            parent,
            next: {
                to: nextSection.overview.path,
                label: `Continue to ${nextSection.homework}: ${nextSection.label} →`,
            },
        };
    }
    return {
        parent,
        next: { to: section.overview.path, label: `Back to the ${section.label} overview →` },
    };
}
