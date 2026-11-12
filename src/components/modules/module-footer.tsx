import { ArrowUp } from 'lucide-react';

export function ModuleFooter() {
    return (
        <footer className="border-t pt-5">
            <div className="text-muted-foreground flex items-center justify-between gap-3 text-[11px]">
                <span>Dynamic Characteristics Toolkit</span>

                <a
                    href="#top"
                    className="hover:text-primary inline-flex items-center gap-1 transition-colors"
                >
                    Back to top
                    <ArrowUp size={12} />
                </a>
            </div>
        </footer>
    );
}
