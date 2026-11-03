import { Outlet } from 'react-router-dom';

import { AppHeader } from '@/components/layout/app-header';
import { ModuleNavigation } from '@/components/layout/module-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { AppFooter } from '@/components/layout/app-foorter.tsx';
import { SidebarProvider } from '@/components/ui/sidebar';

export function AppLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
                <AppHeader />

                <div className="md:hidden">
                    <MobileNavigation />
                </div>

                <ModuleNavigation />

                <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <Outlet />
                </main>

                <AppFooter />
            </div>
        </SidebarProvider>
    );
}