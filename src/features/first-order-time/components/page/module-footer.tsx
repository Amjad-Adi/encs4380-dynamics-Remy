import { ArrowUp, BookOpen } from 'lucide-react';

export function ModuleFooter() {
    return (
        <footer className="border-t pt-5">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-muted p-2">
                    <BookOpen
                        size={15}
                        className="text-muted-foreground"
                    />
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                        Model assumptions and limitations
                    </p>

                    <p className="max-w-3xl text-xs leading-6 text-muted-foreground">
                        Zero initial output, ideal first-order dynamics,
                        and no measurement noise or saturation. The
                        transfer function is defined under zero initial
                        conditions.
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                <span>Dynamic Characteristics Toolkit</span>

                <a
                    href="#top"
                    className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                >
                    Back to top
                    <ArrowUp size={12} />
                </a>
            </div>
        </footer>
    );
}