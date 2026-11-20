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
                <CardDescription>Feedback error, controller, plant, and measured output</CardDescription>
            </CardHeader>
            <CardContent>
                <svg
                    viewBox="0 0 900 380"
                    className="text-foreground h-auto w-full"
                    role="img"
                    aria-label="Closed loop PID control system diagram"
                >
                    {/* Setpoint line */}
                    <line x1="40" y1="150" x2="170" y2="150" stroke="currentColor" strokeWidth="2" />

                    {/* Arrow */}
                    <polygon points="170,145 180,150 170,155" fill="currentColor" />

                    {/* Summing Junction */}
                    <circle cx="210" cy="150" r="30" fill="var(--card)" stroke="currentColor" strokeWidth="2" />
                    <text x="210" y="145" textAnchor="middle" fill="currentColor">
                        +
                    </text>
                    <text x="210" y="165" textAnchor="middle" fill="currentColor">
                        −
                    </text>

                    {/* Error to controller */}
                    <line x1="240" y1="150" x2="310" y2="150" stroke="currentColor" strokeWidth="2" />
                    <polygon points="310,145 320,150 310,155" fill="currentColor" />

                    {/* PID Controller */}
                    <rect
                        x="320"
                        y="95"
                        width="180"
                        height="110"
                        rx="12"
                        fill="var(--muted)"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <text x="410" y="125" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                        PID Controller
                    </text>
                    <text x="410" y="150" textAnchor="middle" fill="currentColor" fontSize="13">
                        Kp: {kp}
                    </text>
                    <text x="410" y="170" textAnchor="middle" fill="currentColor" fontSize="13">
                        Ki: {ki}
                    </text>
                    <text x="410" y="190" textAnchor="middle" fill="currentColor" fontSize="13">
                        Kd: {kd}
                    </text>

                    {/* Controller to Plant */}
                    <line x1="500" y1="150" x2="580" y2="150" stroke="currentColor" strokeWidth="2" />
                    <polygon points="580,145 590,150 580,155" fill="currentColor" />

                    {/* Plant */}
                    <rect
                        x="590"
                        y="105"
                        width="160"
                        height="90"
                        rx="12"
                        fill="var(--muted)"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <text x="670" y="140" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                        Plant
                    </text>
                    <text x="670" y="165" textAnchor="middle" fill="currentColor" fontSize="13">
                        System
                    </text>

                    {/* Plant output */}
                    <line x1="750" y1="150" x2="820" y2="150" stroke="currentColor" strokeWidth="2" />
                    <polygon points="820,145 830,150 820,155" fill="currentColor" />

                    {/* Feedback line */}
                    <line x1="820" y1="150" x2="820" y2="300" stroke="currentColor" strokeWidth="2" />
                    <line x1="820" y1="300" x2="210" y2="300" stroke="currentColor" strokeWidth="2" />
                    <line x1="210" y1="300" x2="210" y2="180" stroke="currentColor" strokeWidth="2" />

                    {/* Feedback arrow */}
                    <polygon points="205,185 210,175 215,185" fill="currentColor" />

                    {/* Labels */}
                    <text x="100" y="130" textAnchor="middle" fill="var(--muted-foreground)" fontSize="13">
                        Setpoint
                    </text>
                    <text x="275" y="130" textAnchor="middle" fill="var(--muted-foreground)" fontSize="13">
                        Error
                    </text>
                    <text x="780" y="130" textAnchor="middle" fill="var(--muted-foreground)" fontSize="13">
                        Output
                    </text>
                    <text x="500" y="325" textAnchor="middle" fill="var(--muted-foreground)" fontSize="13">
                        Feedback · Measured Output
                    </text>
                </svg>
            </CardContent>
        </Card>
    );
}