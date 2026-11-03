import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Activity,
    AudioWaveform,
    Gauge,
    ScanSearch,
    BookOpen,
    SlidersHorizontal,
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
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import { MODULES } from '@/models/modules.ts';


const SECTIONS = [
    {
        id: 'model',
        label: 'Model',
        description: 'Governing equations and system overview',
        icon: BookOpen,
    },
    {
        id: 'experiment',
        label: 'Experiment',
        description: 'Configure and run the simulation',
        icon: SlidersHorizontal,
    },
    {
        id: 'analysis',
        label: 'Analysis',
        description: 'Evaluate system performance',
        icon: Activity,
    },
    {
        id: 'challenge',
        label: 'Challenge',
        description: 'Test your understanding',
        icon: Gauge,
    },
] as const;

export function MobileNavigation() {
    const location = useLocation();
    const { setOpenMobile } = useSidebar();

    const isTimeResponseModule = location.pathname === '/';

    const [activeSection, setActiveSection] = useState('model');

    useEffect(() => {
        if (!isTimeResponseModule) return;

        const sections = SECTIONS
            .map(({ id }) => document.getElementById(id))
            .filter((section): section is HTMLElement => section !== null);

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top,
                    );

                if (visibleSections.length > 0) {
                    setActiveSection(visibleSections[0].target.id);
                }
            },
            {
                rootMargin: '-15% 0px -70% 0px',
                threshold: 0,
            },
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [isTimeResponseModule]);

    function closeNavigation() {
        setOpenMobile(false);
    }

    return (
        <Sidebar
            side="left"
            variant="sidebar"
            collapsible="offcanvas"
        >
            <SidebarHeader className="border-b border-sidebar-border px-5 py-5">
                <h2 className="text-base font-semibold">
                    Navigation
                </h2>

                <p className="text-xs text-sidebar-foreground/60">
                    Dynamic Characteristics Toolkit
                </p>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                {/* Modules */}
                <SidebarGroup>
                    <div className="mb-2 flex items-center justify-between">
                        <SidebarGroupLabel>
                            Modules
                        </SidebarGroupLabel>

                        <span className="px-2 text-[10px] text-sidebar-foreground/50">
                            4 modules
                        </span>
                    </div>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {MODULES.map((module) => {
                                const Icon = module.icon;
                                const isActive =
                                    location.pathname === module.path;

                                return (
                                    <SidebarMenuItem key={module.number}>
                                        {module.available ? (
                                            <SidebarMenuButton
                                                render={
                                                    <NavLink
                                                        to={module.path}
                                                        end={module.path === '/'}
                                                        onClick={closeNavigation}
                                                    />
                                                }
                                                isActive={isActive}
                                                size="lg"
                                            >
                                                <Icon />

                                                <span className="flex-1">
                                                    {module.number} · {module.label}
                                                </span>

                                                {isActive ? (
                                                    <Check className="ml-auto" />
                                                ) : (
                                                    <ChevronRight className="ml-auto opacity-50" />
                                                )}
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton
                                                disabled
                                                size="lg"
                                                className="opacity-40"
                                            >
                                                <Icon />

                                                <span className="flex-1">
                                                    {module.number} · {module.label}
                                                </span>

                                                <span className="text-[10px]">
                                                    Soon
                                                </span>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {isTimeResponseModule && (
                    <>
                        <SidebarSeparator />

                        {/* Module sections */}
                        <SidebarGroup>
                            <div className="mb-2 flex items-center justify-between">
                                <SidebarGroupLabel>
                                    Module sections
                                </SidebarGroupLabel>

                                <span className="px-2 text-[10px] text-sidebar-foreground/50">
                                    {String(
                                        SECTIONS.findIndex(
                                            (section) =>
                                                section.id === activeSection,
                                        ) + 1,
                                    ).padStart(2, '0')}
                                    /04
                                </span>
                            </div>

                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {SECTIONS.map(
                                        ({ id, label, description, icon: Icon }) => {
                                            const isActive =
                                                activeSection === id;

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
                                                        className="h-auto min-h-12 py-2"
                                                    >
                                                        <Icon />

                                                        <span className="min-w-0 flex-1">
                                                            <span className="block">
                                                                {label}
                                                            </span>

                                                            <span className="block truncate text-[11px] font-normal text-sidebar-foreground/60">
                                                                {description}
                                                            </span>
                                                        </span>

                                                        {isActive && (
                                                            <Check className="ml-auto" />
                                                        )}
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        },
                                    )}
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