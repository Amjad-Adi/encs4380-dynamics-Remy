import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PIDDiagramProps = {
    kp: number;
    ki: number;
    kd: number;
};

export function PIDDiagram({ kp, ki, kd }: PIDDiagramProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Closed-loop PID control system</CardTitle>
                <CardDescription>
                    Reference, PID control, actuator limit, plant, and feedback
                </CardDescription>
            </CardHeader>
            <CardContent>
                <svg
                    viewBox="0 0 960 360"
                    className="text-foreground h-auto w-full min-w-0"
                    role="img"
                    aria-label="Closed loop PID control system diagram"
                >
                    <defs>
                        <marker
                            id="pid-arrow"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
                        </marker>
                        <marker
                            id="pid-feedback-arrow"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
                        </marker>
                    </defs>

                    <rect x="24" y="125" width="96" height="60" rx="8" fill="var(--muted)" stroke="var(--border)" />
                    <text x="72" y="150" textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">
                        Reference
                    </text>
                    <text x="72" y="171" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="600">
                        r[k]
                    </text>

                    <line x1="120" y1="155" x2="178" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#pid-arrow)" />

                    <circle cx="210" cy="155" r="32" fill="var(--card)" stroke="currentColor" strokeWidth="1.5" />
                    <text x="210" y="149" textAnchor="middle" fill="currentColor" fontSize="18">
                        +
                    </text>
                    <text x="210" y="171" textAnchor="middle" fill="currentColor" fontSize="18">
                        −
                    </text>

                    <line x1="242" y1="155" x2="292" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#pid-arrow)" />
                    <rect
                        x="300"
                        y="105"
                        width="180"
                        height="110"
                        rx="8"
                        fill="var(--muted)"
                        stroke="var(--border)"
                    />
                    <text x="390" y="132" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                        PID Controller
                    </text>
                    <text x="390" y="158" textAnchor="middle" fill="currentColor" fontSize="13">
                        Kp: {kp}
                    </text>
                    <text x="390" y="178" textAnchor="middle" fill="currentColor" fontSize="13">
                        Ki: {ki}
                    </text>
                    <text x="390" y="198" textAnchor="middle" fill="currentColor" fontSize="13">
                        Kd: {kd}
                    </text>

                    <line x1="480" y1="155" x2="530" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#pid-arrow)" />
                    <rect x="538" y="125" width="82" height="60" rx="8" fill="var(--muted)" stroke="var(--border)" />
                    <text x="579" y="150" textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">
                        Actuator
                    </text>
                    <text x="579" y="171" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="600">
                        Limiter
                    </text>

                    <line x1="620" y1="155" x2="668" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#pid-arrow)" />
                    <rect
                        x="676"
                        y="115"
                        width="140"
                        height="80"
                        rx="8"
                        fill="var(--muted)"
                        stroke="var(--border)"
                    />
                    <text x="746" y="150" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                        Plant
                    </text>
                    <text x="746" y="171" textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">
                        G(z) / G(s)
                    </text>

                    <line x1="816" y1="155" x2="854" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#pid-arrow)" />
                    <rect x="862" y="125" width="74" height="60" rx="8" fill="var(--muted)" stroke="var(--border)" />
                    <text x="899" y="150" textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">
                        Output
                    </text>
                    <text x="899" y="171" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="600">
                        y[k]
                    </text>

                    <path
                        d="M 899 185 L 899 278 L 210 278 L 210 187"
                        fill="none"
                        stroke="var(--muted-foreground)"
                        strokeWidth="1.5"
                        markerEnd="url(#pid-feedback-arrow)"
                    />
                    <path
                        d="M 899 185 L 899 278 L 210 278 L 210 187"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="8 10"
                        opacity="0.7"
                        markerEnd="url(#pid-feedback-arrow)"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="18"
                            to="0"
                            dur="1.8s"
                            repeatCount="indefinite"
                        />
                    </path>

                    <text x="242" y="137" fill="var(--muted-foreground)" fontSize="12">
                        Error
                    </text>
                    <text
                        x="480"
                        y="306"
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="15"
                        fontFamily="monospace"
                        fontWeight="600"
                    >
                        e[k] = r[k] - y[k]
                    </text>
                    <text x="480" y="328" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">
                        Feedback · measured output
                    </text>
                </svg>
            </CardContent>
        </Card>
    );
}