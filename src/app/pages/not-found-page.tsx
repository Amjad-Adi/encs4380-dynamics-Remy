
import { Activity, ArrowRight, Compass, Home } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';

const GITHUB_REPOSITORY_URL =
    import.meta.env.VITE_GITHUB_REPOSITORY_URL ||
    'https://github.com/Amjad-Adi/encs4380-dynamics-Remy';

export default function NotFoundPage() {
    return (
        <main className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6">
            {/* Background decoration */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -left-32 top-1/4 size-72 rounded-full bg-brand/5 blur-3xl" />
                <div className="absolute -right-32 bottom-1/4 size-72 rounded-full bg-primary/5 blur-3xl" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-xl">
                <Card className="overflow-hidden border-border/80 shadow-lg shadow-primary/5">
                    <CardContent className="flex flex-col items-center px-5 py-8 text-center sm:px-10 sm:py-10">
                        {/* Status */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-destructive">
                            <span className="size-1.5 rounded-full bg-destructive" />
                            ERROR 404
                        </div>

                        {/* Illustration */}
                        <div className="relative my-6 flex items-center justify-center">
                            <div className="absolute size-28 rounded-full bg-brand/10 blur-2xl" />

                            <div className="relative flex size-20 items-center justify-center rounded-xl border border-border bg-muted/70 shadow-sm">
                                <Activity
                                    className="size-9 text-brand"
                                    strokeWidth={1.6}
                                    aria-hidden="true"
                                />

                                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border-[3px] border-card bg-destructive text-destructive-foreground">
                                    <Compass size={11} />
                                </span>
                            </div>
                        </div>

                        {/* Message */}
                        <p className="font-mono text-6xl font-bold leading-none tracking-tighter text-primary sm:text-7xl">
                            404
                        </p>

                        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            Page not found
                        </h1>

                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            The page you're looking for doesn't exist,
                            may have been moved, or the address is incorrect.
                        </p>

                        {/* Navigation */}
                        <div className="mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button
                                render={<Link to="/time-response" />}
                                className="h-12 w-full gap-2 px-4"
                            >
                                <Home className="size-4" />
                                <span className="leading-none">Back to Time Response</span>
                            </Button>

                            <Button
                                variant="outline"
                                render={<Link to="/frequency-response" />}
                                className="h-12 w-full gap-2 px-4"
                            >
                                <Activity className="size-4" />
                                <span className="leading-none">Frequency Response</span>
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                        {/* Footer */}
                        <div className="mt-7 flex w-full flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
                            <p className="text-xs text-muted-foreground">
                                ENCS4380 · Dynamic Characteristics Toolkit
                            </p>

                            <a
                                href={GITHUB_REPOSITORY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View GitHub repository"
                                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <FaGithub size={14} />
                                View source
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
