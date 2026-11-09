import { ArrowUp } from 'lucide-react';

export function ModuleFooter() {
    return (
        <footer className="border-t pt-5">
            <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
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