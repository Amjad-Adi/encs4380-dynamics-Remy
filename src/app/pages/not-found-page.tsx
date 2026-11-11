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
        <main className="bg-background relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
            {/* Background decoration */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="bg-brand/5 absolute top-1/4 -left-32 size-72 rounded-full blur-3xl" />
                <div className="bg-primary/5 absolute -right-32 bottom-1/4 size-72 rounded-full blur-3xl" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] bg-[size:48px_48px] opacity-25" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-xl">
                <Card className="border-border/80 shadow-primary/5 overflow-hidden shadow-lg">
                    <CardContent className="flex flex-col items-center px-5 py-8 text-center sm:px-10 sm:py-10">
                        {/* Status */}
                        <div className="border-destructive/20 bg-destructive/5 text-destructive inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide">
                            <span className="bg-destructive size-1.5 rounded-full" />
                            ERROR 404
                        </div>

                        {/* Illustration */}
                        <div className="relative my-6 flex items-center justify-center">
                            <div className="bg-brand/10 absolute size-28 rounded-full blur-2xl" />

                            <div className="border-border bg-muted/70 relative flex size-20 items-center justify-center rounded-xl border shadow-sm">
                                <Activity
                                    className="text-brand size-9"
                                    strokeWidth={1.6}
                                    aria-hidden="true"
                                />

                                <span className="border-card bg-destructive text-destructive-foreground absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-[3px]">
                                    <Compass size={11} />
                                </span>
                            </div>
                        </div>

                        {/* Message */}
                        <p className="text-primary font-mono text-6xl leading-none font-bold tracking-tighter sm:text-7xl">
                            404
                        </p>

                        <h1 className="text-foreground mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                            Page not found
                        </h1>

                        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
                            The page you're looking for doesn't exist, may have been moved, or the
                            address is incorrect.
                        </p>

                        {/* Navigation */}
                        <div className="mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button
                                render={<Link to="/time-response" />}
                                className="h-12 w-full gap-2 px-4"
                            >
                                <Home className="size-4" />
                                <span className="leading-none">First-order time response</span>
                            </Button>

                            <Button
                                variant="outline"
                                render={<Link to="/frequency-response" />}
                                className="h-12 w-full gap-2 px-4"
                            >
                                <Activity className="size-4" />
                                <span className="leading-none">First-order frequency response</span>
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                        {/* Footer */}
                        <div className="border-border mt-7 flex w-full flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
                            <p className="text-muted-foreground text-xs">
                                ENCS4380 · Dynamic Characteristics Toolkit
                            </p>

                            <a
                                href={GITHUB_REPOSITORY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View GitHub repository"
                                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
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
