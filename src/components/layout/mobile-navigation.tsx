import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ModuleSection } from '@/components/modules/section-navigation';

import {
    TOOLKIT_SECTIONS,
    getModuleNavLabel,
    getSectionForPath,
    type ToolkitSection,
} from '@/models/modules';

import { TIME_SECTIONS } from '@/features/first-order-time/domain/first-order-time';
import { FREQUENCY_SECTIONS } from '@/features/first-order-frequency/domain/first-order-frequency';
import { SECOND_ORDER_SECTIONS } from '@/features/second-order/components/page/second-order-sections';
import { NUMERICAL_ODE_SECTIONS } from '@/features/numerical-ode/components/page/numerical-ode-sections';
import { SENSOR_CHALLENGE_SECTIONS } from '@/features/sensor-challenge/components/page/sensor-challenge-sections';
import { POLE_EXPLORER_SECTIONS } from '@/features/pole-explorer/components/page/pole-explorer-sections';
import { SUPERPOSITION_SECTIONS } from '@/features/superposition/components/page/superposition-sections.ts';
import { CONTROL_OVERVIEW_SECTIONS } from '@/features/control/components/control-overview-sections';
import { DYNAMICS_OVERVIEW_SECTIONS } from '@/features/dynamics/components/dynamics-overview-sections';
import { SLOW_SENSOR_PID_SECTIONS } from '@/features/slow-sensor-pid/components/page/slow-sensor-pid-sections';
import { PID_SECTIONS } from '@/features/pid-playground/components/page/pid-sections.ts';
import { DIGITAL_PID_SECTIONS } from '@/features/digital-pid/components/page/digital-pid-sections';
import { TUNING_SECTIONS } from '@/features/tuning-challenge/components/page/tuning-sections';
import { MY_SYSTEM_SECTIONS } from '@/features/my-system/components/my-system-sections';

const PAGE_SECTIONS: Record<string, ModuleSection[]> = {
    '/dynamics': DYNAMICS_OVERVIEW_SECTIONS,
    '/dynamics/time-response': TIME_SECTIONS,
    '/dynamics/frequency-response': FREQUENCY_SECTIONS,
    '/dynamics/second-order': SECOND_ORDER_SECTIONS,
    '/dynamics/sensor-challenge': SENSOR_CHALLENGE_SECTIONS,
    '/dynamics/pole-explorer': POLE_EXPLORER_SECTIONS,
    '/dynamics/superposition': SUPERPOSITION_SECTIONS,
    '/dynamics/numerical-ode': NUMERICAL_ODE_SECTIONS,
    '/control': CONTROL_OVERVIEW_SECTIONS,
    '/control/pid-playground': PID_SECTIONS,
    '/control/slow-sensor-pid': SLOW_SENSOR_PID_SECTIONS,
    '/control/digital-pid': DIGITAL_PID_SECTIONS,
    '/control/tuning-challenge': TUNING_SECTIONS,
    '/control/my-system': MY_SYSTEM_SECTIONS,
};

const ACTIVE_MODULE_BUTTON_CLASS = [
    'mx-2 w-[calc(100%-1rem)] rounded-md border',
    '!border-primary/25',
    '!bg-primary/10',
    '!text-primary',
    'hover:!bg-primary/15',
].join(' ');

const INACTIVE_MODULE_BUTTON_CLASS =
    'mx-2 w-[calc(100%-1rem)] rounded-md border border-transparent';

const SECTION_BUTTON_CLASS = [
    'mx-2 w-[calc(100%-1rem)] rounded-md',
    'hover:bg-sidebar-accent',
    'hover:text-sidebar-accent-foreground',
    'data-active:bg-sidebar-accent',
    'data-active:text-sidebar-accent-foreground',
].join(' ');

function NavigationLink({
    to,
    icon: Icon,
    label,
    end,
    onNavigate,
}: {
    to: string;
    icon: LucideIcon;
    label: string;
    end?: boolean;
    onNavigate: () => void;
}) {
    return (
        <SidebarMenuItem>
            <NavLink to={to} end={end} onClick={onNavigate} className="block">
                {({ isActive }) => (
                    <SidebarMenuButton
                        isActive={isActive}
                        size="lg"
                        className={
                            isActive ? ACTIVE_MODULE_BUTTON_CLASS : INACTIVE_MODULE_BUTTON_CLASS
                        }
                    >
                        <Icon />
                        <span className="min-w-0 flex-1 truncate">{label}</span>
                        {isActive ? (
                            <Check className="ml-auto" />
                        ) : (
                            <ChevronRight className="ml-auto opacity-50" />
                        )}
                    </SidebarMenuButton>
                )}
            </NavLink>
        </SidebarMenuItem>
    );
}

function SectionGroup({
    section,
    defaultOpen,
    onNavigate,
}: {
    section: ToolkitSection;
    defaultOpen: boolean;
    onNavigate: () => void;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const SectionIcon = section.icon;

    useEffect(() => {
        if (defaultOpen) setOpen(true);
    }, [defaultOpen]);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <SidebarGroup className="py-1">
                <CollapsibleTrigger
                    className="hover:bg-sidebar-accent flex w-full items-center gap-2 rounded-md px-2 py-2 text-left"
                    aria-label={`${section.label} (${section.homework}), ${section.modules.length} modules`}
                >
                    <SectionIcon className="text-brand size-4 shrink-0" />
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                            {section.label}
                        </span>
                        <span className="text-sidebar-foreground/60 block text-[11px]">
                            {section.homework} · {section.modules.length} modules
                        </span>
                    </span>
                    <ChevronDown
                        className={`size-4 shrink-0 opacity-60 transition-transform ${open ? '' : '-rotate-90'}`}
                    />
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarGroupContent className="pt-1">
                        <SidebarMenu className="gap-1">
                            <NavigationLink
                                to={section.overview.path}
                                icon={section.overview.icon}
                                label={section.overview.label}
                                end
                                onNavigate={onNavigate}
                            />
                            {section.modules.map((module) =>
                                module.available ? (
                                    <NavigationLink
                                        key={module.path}
                                        to={module.path}
                                        icon={module.icon}
                                        label={getModuleNavLabel(module)}
                                        onNavigate={onNavigate}
                                    />
                                ) : (
                                    <SidebarMenuItem key={module.path}>
                                        <SidebarMenuButton
                                            disabled
                                            size="lg"
                                            className="mx-2 w-[calc(100%-1rem)] rounded-md opacity-40"
                                        >
                                            <module.icon />
                                            <span className="min-w-0 flex-1 truncate">
                                                {getModuleNavLabel(module)}
                                            </span>
                                            <span className="text-[10px]">Soon</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

export function MobileNavigation() {
    const location = useLocation();
    const { setOpenMobile } = useSidebar();

    const pathname = location.pathname.replace(/(.)\/+$/, '$1');
    const sections = PAGE_SECTIONS[pathname] ?? [];
    const currentSection = getSectionForPath(pathname);

    const [activeSection, setActiveSection] = useState(sections[0]?.id ?? 'model');

    useEffect(() => {
        setActiveSection(sections[0]?.id ?? 'model');

        if (sections.length === 0) return;

        const sectionElements = sections
            .map(({ id }) => document.getElementById(id))
            .filter((section): section is HTMLElement => section !== null);

        if (sectionElements.length === 0) return;

        const observer = new IntersectionObserver(
            () => {
                const visibleSections = sectionElements
                    .filter((section) => {
                        const rect = section.getBoundingClientRect();
                        const activationTop = window.innerHeight * 0.15;
                        const activationBottom = window.innerHeight * 0.3;

                        return rect.top < activationBottom && rect.bottom > activationTop;
                    })
                    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

                if (visibleSections.length > 0) {
                    setActiveSection(visibleSections[0].id);
                }
            },
            {
                rootMargin: '-15% 0px -70% 0px',
                threshold: 0,
            },
        );

        sectionElements.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [pathname, sections]);

    function closeNavigation() {
        setOpenMobile(false);
    }

    return (
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
            <SidebarContent className="gap-0">
                <SidebarGroup className="pb-1">
                    <SidebarMenu>
                        <NavigationLink
                            to="/"
                            icon={Home}
                            label="Home"
                            end
                            onNavigate={closeNavigation}
                        />
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator />

                {TOOLKIT_SECTIONS.map((section) => (
                    <SectionGroup
                        key={section.id}
                        section={section}
                        defaultOpen={currentSection === null || currentSection.id === section.id}
                        onNavigate={closeNavigation}
                    />
                ))}

                {sections.length > 0 && (
                    <>
                        <SidebarSeparator />

                        <SidebarGroup>
                            <div className="mb-2 flex items-center justify-between">
                                <SidebarGroupLabel>Page sections</SidebarGroupLabel>

                                <span className="text-sidebar-foreground/50 px-2 text-[10px]">
                                    {String(
                                        Math.max(
                                            0,
                                            sections.findIndex(
                                                (section) => section.id === activeSection,
                                            ) + 1,
                                        ),
                                    ).padStart(2, '0')}
                                    /{String(sections.length).padStart(2, '0')}
                                </span>
                            </div>

                            <SidebarGroupContent>
                                <SidebarMenu className="gap-1">
                                    {sections.map(({ id, label, icon: Icon }) => {
                                        const isActive = activeSection === id;

                                        return (
                                            <SidebarMenuItem key={id}>
                                                <SidebarMenuButton
                                                    render={
                                                        <a
                                                            href={`#${id}`}
                                                            onClick={closeNavigation}
                                                        />
                                                    }
                                                    isActive={isActive}
                                                    size="lg"
                                                    className={SECTION_BUTTON_CLASS}
                                                >
                                                    <Icon />

                                                    <span className="min-w-0 flex-1">{label}</span>

                                                    {isActive && <Check className="ml-auto" />}
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="border-sidebar-border border-t px-5 py-3">
                <p className="text-sidebar-foreground/60 text-center text-[11px]">
                    ENCS4380 · Interfacing Techniques
                </p>
            </SidebarFooter>
        </Sidebar>
    );
}
