
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Check,
    ChevronRight,
} from 'lucide-react';

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

import { MODULES } from '@/models/modules';

import { TIME_SECTIONS } from '@/features/first-order-time/domain/first-order-time';
import { FREQUENCY_SECTIONS } from '@/features/first-order-frequency/domain/first-order-frequency';
import { SECOND_ORDER_SECTIONS } from '@/features/second-order/components/page/second-order-sections';
import { SENSOR_CHALLENGE_SECTIONS } from '@/features/sensor-challenge/components/page/sensor-challenge-sections';

const MODULE_SECTIONS = {
    '/': TIME_SECTIONS,
    '/time-response': TIME_SECTIONS,
    '/frequency-response': FREQUENCY_SECTIONS,
    '/second-order': SECOND_ORDER_SECTIONS,
    '/sensor-challenge': SENSOR_CHALLENGE_SECTIONS,
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

export function MobileNavigation() {
    const location = useLocation();
    const { setOpenMobile } = useSidebar();

    const sections =
        MODULE_SECTIONS[
            location.pathname as keyof typeof MODULE_SECTIONS
            ] ?? [];

    const [activeSection, setActiveSection] = useState('model');

    useEffect(() => {
        setActiveSection('model');

        if (sections.length === 0) return;

        const sectionElements = sections
            .map(({ id }) => document.getElementById(id))
            .filter(
                (section): section is HTMLElement => section !== null,
            );

        if (sectionElements.length === 0) return;

        const observer = new IntersectionObserver(
            () => {
                const visibleSections = sectionElements
                    .filter((section) => {
                        const rect = section.getBoundingClientRect();
                        const activationTop = window.innerHeight * 0.15;
                        const activationBottom = window.innerHeight * 0.30;

                        return (
                            rect.top < activationBottom &&
                            rect.bottom > activationTop
                        );
                    })
                    .sort(
                        (a, b) =>
                            a.getBoundingClientRect().top -
                            b.getBoundingClientRect().top,
                    );

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
    }, [location.pathname, sections]);

    function closeNavigation() {
        setOpenMobile(false);
    }

    return (
        <Sidebar
            side="left"
            variant="sidebar"
            collapsible="offcanvas"
        >
            <SidebarContent className="gap-0">
                {/* Modules */}
                <SidebarGroup>
                    <div className="mb-2 flex items-center justify-between">
                        <SidebarGroupLabel>
                            Modules
                        </SidebarGroupLabel>

                        <span className="px-2 text-[10px] text-sidebar-foreground/50">
                            {MODULES.length} modules
                        </span>
                    </div>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {MODULES.map((module) => {
                                const Icon = module.icon;

                                return (
                                    <SidebarMenuItem key={module.number}>
                                        {module.available ? (
                                            <NavLink
                                                to={module.path}
                                                end={module.path === '/'}
                                                onClick={closeNavigation}
                                                className="block"
                                            >
                                                {({ isActive }) => (
                                                    <SidebarMenuButton
                                                        isActive={isActive}
                                                        size="lg"
                                                        className={
                                                            isActive
                                                                ? ACTIVE_MODULE_BUTTON_CLASS
                                                                : INACTIVE_MODULE_BUTTON_CLASS
                                                        }
                                                    >
                                                        <Icon />

                                                        <span className="min-w-0 flex-1 truncate">
                                                            {module.number} · {module.label}
                                                        </span>

                                                        {isActive ? (
                                                            <Check className="ml-auto" />
                                                        ) : (
                                                            <ChevronRight className="ml-auto opacity-50" />
                                                        )}
                                                    </SidebarMenuButton>
                                                )}
                                            </NavLink>
                                        ) : (
                                            <SidebarMenuButton
                                                disabled
                                                size="lg"
                                                className="mx-2 w-[calc(100%-1rem)] rounded-md opacity-40"
                                            >
                                                <Icon />

                                                <span className="min-w-0 flex-1 truncate">
                                                    {module.number} · {module.label}
                                                </span>

                                                <span className="text-[10px]">Soon</span>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Module Sections */}
                {sections.length > 0 && (
                    <>
                        <SidebarSeparator />

                        <SidebarGroup>
                            <div className="mb-2 flex items-center justify-between">
                                <SidebarGroupLabel>
                                    Module sections
                                </SidebarGroupLabel>

                                <span className="px-2 text-[10px] text-sidebar-foreground/50">
                                    {String(
                                        Math.max(
                                            0,
                                            sections.findIndex(
                                                (section) =>
                                                    section.id === activeSection,
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

                                                    <span className="min-w-0 flex-1">
                                                        {label}
                                                    </span>

                                                    {isActive && (
                                                        <Check className="ml-auto" />
                                                    )}
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

            <SidebarFooter className="border-t border-sidebar-border px-5 py-3">
                <p className="text-center text-[11px] text-sidebar-foreground/60">
                    ENCS4380 · Interfacing Techniques
                </p>
            </SidebarFooter>
        </Sidebar>
    );
}
