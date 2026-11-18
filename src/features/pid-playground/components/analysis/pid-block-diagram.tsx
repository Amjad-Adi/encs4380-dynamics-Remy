import { ArrowRight, CornerDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlantType } from '@/features/pid-playground/domain/pid-playground';

export function PIDBlockDiagram({ plantType }: { plantType: PlantType }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Closed-loop block diagram</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs sm:gap-3">
                    <div className="bg-muted/50 min-w-16 rounded-lg border px-3 py-3">
                        <span className="text-muted-foreground block">Reference</span>
                        <strong className="font-mono">r(t)</strong>
                    </div>
                    <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                    <div className="flex size-9 items-center justify-center rounded-full border-2 font-mono text-base">
                        Σ
                    </div>
                    <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                    <div className="bg-primary/5 min-w-20 rounded-lg border px-3 py-3">
                        <strong className="block">PID</strong>
                        <span className="text-muted-foreground font-mono">
                            K<sub>p</sub>, K<sub>i</sub>, K<sub>d</sub>
                        </span>
                    </div>
                    <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                    <div className="bg-muted/50 min-w-16 rounded-lg border px-3 py-3">
                        <strong className="block">Limiter</strong>
                        <span className="text-muted-foreground">u min / max</span>
                    </div>
                    <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                    <div className="bg-muted/50 min-w-20 rounded-lg border px-3 py-3">
                        <strong className="block">Plant</strong>
                        <span className="text-muted-foreground">
                            {plantType === 'first-order' ? 'K / (τs + 1)' : '1 / (ms² + bs + k)'}
                        </span>
                    </div>
                    <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                    <div className="bg-muted/50 min-w-16 rounded-lg border px-3 py-3">
                        <span className="text-muted-foreground block">Output</span>
                        <strong className="font-mono">y(t)</strong>
                    </div>
                </div>
                <div className="text-muted-foreground mt-3 flex items-center justify-center gap-2 text-[11px]">
                    <CornerDownLeft size={14} />
                    Feedback path returns y(t) to the negative input of the summing junction (unity
                    feedback).
                </div>
            </CardContent>
        </Card>
    );
}
