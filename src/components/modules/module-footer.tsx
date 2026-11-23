import { ArrowUp } from 'lucide-react';

import { ModulePager } from '@/components/modules/module-pager';

/** Page footer; module pages also get the previous / overview / next pager. */
export function ModuleFooter() {
    return (
        <div className="space-y-10">
            <ModulePager />
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
        </div>
    );
}
