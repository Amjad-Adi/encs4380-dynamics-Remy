import { Activity } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import ThemeToggle from '@/components/ThemeToggle.tsx';
import remyImage from '@/assets/remy.jpg';

export function AppHeader() {
    return (
        <header className="border-b border-border bg-background">
            <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <a
                    href="/"
                    className="flex min-w-0 items-center gap-3"
                    aria-label="Dynamic Characteristics Toolkit home"
                >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <img
                            src={remyImage}
                            alt="Remy"
                            className="size-full rounded-lg object-cover"
                        />                    </div>


                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight">
                            Dynamic Characteristics Toolkit
                        </p>
                        <p className="text-xs text-muted-foreground">
                            ENCS4380 · Interfacing Techniques
                        </p>
                    </div>
                </a>

                <div className="flex shrink-0 items-center gap-2">
                    <a
                        href={import.meta.env.VITE_GITHUB_REPOSITORY_URL}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
                    >
                        <FaGithub className="h-5 w-5"  />
                    </a>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}