import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/components/layout/app-header';
import { ModuleNavigation } from '@/components/layout/module-navigation';
import { AppFooter } from '@/components/layout/app-foorter.tsx';

export function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <AppHeader />
            <ModuleNavigation />

            <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <Outlet />
            </main>

            <AppFooter />
        </div>
    );
}