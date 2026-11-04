import { Outlet } from 'react-router-dom';

import { AppHeader } from '@/components/layout/app-header';
import { ModuleNavigation } from '@/components/layout/module-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-is-mobile';
import {AppFooter} from "@/components/layout/app-foorter.tsx";
import {ScrollToTop} from "@/components/ScrollToTop.tsx";

function ResponsiveNavigation() {
    const isMobile = useIsMobile();

    return isMobile ? <MobileNavigation /> : <ModuleNavigation />;
}

export function AppLayout() {
    return (
        <SidebarProvider>
            <ScrollToTop />
            <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
                <div className="sticky top-0 z-50 w-full bg-background">
                    <AppHeader />
                    <ResponsiveNavigation />
                </div>

                <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <Outlet />
                </main>

                <AppFooter />
            </div>
        </SidebarProvider>
    );
}