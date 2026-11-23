import { Outlet } from 'react-router-dom';

import { AppHeader } from '@/components/layout/app-header';
import { ModuleNavigation } from '@/components/layout/module-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { AppFooter } from '@/components/layout/app-footer.tsx';
import { ScrollToTop } from '@/components/ScrollToTop.tsx';

function ResponsiveNavigation() {
    const isMobile = useIsMobile();

    return isMobile ? <MobileNavigation /> : <ModuleNavigation />;
}

export function AppLayout() {
    return (
        <SidebarProvider>
            <ScrollToTop />
            <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
                <div className="bg-background sticky top-0 z-50 w-full">
                    <AppHeader />
                    <ResponsiveNavigation />
                </div>

                {/* Pages render their own <main> with responsive gutters, so this wrapper only
                    adds outer spacing on large screens; phones get the full width. */}
                <div className="mx-auto w-full max-w-[1440px] min-w-0 flex-1 lg:px-8 lg:py-10">
                    <Outlet />
                </div>

                <AppFooter />
            </div>
        </SidebarProvider>
    );
}
