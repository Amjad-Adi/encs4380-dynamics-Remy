import { ArrowUp, BookOpen } from 'lucide-react';

export function ModuleFooter() {
    return (
        <footer className="border-t pt-5">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-muted p-2">
                    <BookOpen size={15} className="text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                        Model assumptions and limitations
                    </p>
                    <p className="max-w-3xl text-xs leading-6 text-muted-foreground">
                        Unity static gain, ideal first-order dynamics, sinusoidal steady state,
                        and no measurement noise or saturation. Startup transients are omitted.
                        Angular frequency is expressed in rad/s; ordinary frequency in Hz is
                        related by ω = 2πf.
                    </p>
                </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                <span>Dynamic Characteristics Toolkit</span>
                <a href="#top" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
                    Back to top <ArrowUp size={12} />
                </a>
            </div>
        </footer>
    );
}
