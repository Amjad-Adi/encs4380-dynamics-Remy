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
                <div className="w-full overflow-hidden">
                    <svg
                        viewBox="0 0 960 390"
                        className="mx-auto h-auto w-full max-w-[960px] text-foreground"
                        role="img"
                        aria-label="Closed-loop digital PID control system diagram"
                    >
                        <defs>
                            <marker
                                id="pid-arrow"
                                viewBox="0 0 10 10"
                                refX="8.5"
                                refY="5"
                                markerWidth="5.5"
                                markerHeight="5.5"
                                orient="auto"
                            >
                                <path
                                    d="M 0 1.2 L 9 5 L 0 8.8 L 2.2 5 z"
                                    fill="currentColor"
                                />
                            </marker>
                        </defs>

                        {/* Reference input */}
                        <text
                            x="100"
                            y="128"
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            fontSize="12"
                        >
                            Reference
                        </text>
                        <text
                            x="100"
                            y="151"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="15"
                            fontFamily="serif"
                            fontStyle="italic"
                        >
                            r[k]
                        </text>
                        <line
                            x1="40"
                            y1="165"
                            x2="171"
                            y2="165"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            markerEnd="url(#pid-arrow)"
                        />

                        {/* Summing junction */}
                        <circle
                            cx="200"
                            cy="165"
                            r="28"
                            fill="var(--card)"
                            stroke="currentColor"
                            strokeWidth="1.75"
                        />
                        <text x="185" y="170" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                            +
                        </text>
                        <text x="200" y="185" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                            −
                        </text>

                        {/* Error signal */}
                        <line
                            x1="228"
                            y1="165"
                            x2="299"
                            y2="165"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            markerEnd="url(#pid-arrow)"
                        />
                        <text
                            x="264"
                            y="151"
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            fontSize="13"
                            fontFamily="serif"
                            fontStyle="italic"
                        >
                            e[k]
                        </text>

                        {/* PID controller */}
                        <rect
                            x="300"
                            y="105"
                            width="190"
                            height="120"
                            rx="10"
                            fill="var(--primary)"
                            fillOpacity="0.07"
                            stroke="var(--primary)"
                            strokeWidth="1.75"
                        />
                        <text x="395" y="129" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                            PID Controller
                        </text>
                        <line
                            x1="314"
                            y1="140"
                            x2="476"
                            y2="140"
                            stroke="var(--primary)"
                            strokeOpacity="0.3"
                            strokeWidth="1"
                        />
                        <text x="395" y="164" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="serif">
                            Kₚe[k] + KᵢΣe[k]Δt
                        </text>
                        <text x="395" y="190" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="serif">
                            + Kd(e[k] − e[k−1]) / Δt
                        </text>

                        {/* Controller gains */}
                        <text x="395" y="213" textAnchor="middle" fill="currentColor" fontSize="11">
                            Kp: {kp}   ·   Ki: {ki}   ·   Kd: {kd}
                        </text>

                        {/* Controller output */}
                        <line
                            x1="490"
                            y1="165"
                            x2="554"
                            y2="165"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            markerEnd="url(#pid-arrow)"
                        />
                        <text
                            x="522"
                            y="151"
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            fontSize="12"
                            fontFamily="serif"
                            fontStyle="italic"
                        >
                            u[k]
                        </text>

                        {/* Actuator limiter */}
                        <rect
                            x="555"
                            y="115"
                            width="115"
                            height="100"
                            rx="10"
                            fill="var(--muted)"
                            stroke="currentColor"
                            strokeWidth="1.75"
                        />
                        <text x="612.5" y="139" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                            Limiter
                        </text>
                        <line
                            x1="569"
                            y1="150"
                            x2="656"
                            y2="150"
                            stroke="currentColor"
                            strokeOpacity="0.2"
                            strokeWidth="1"
                        />
                        <text x="612.5" y="181" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="serif">
                            uₘₐₓ / uₘᵢₙ
                        </text>

                        {/* Limited actuator signal */}
                        <line
                            x1="670"
                            y1="165"
                            x2="719"
                            y2="165"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            markerEnd="url(#pid-arrow)"
                        />
                        <text
                            x="695"
                            y="151"
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            fontSize="13"
                            fontFamily="serif"
                            fontStyle="italic"
                        >
                            u[k]
                        </text>

                        {/* Plant */}
                        <rect
                            x="720"
                            y="110"
                            width="150"
                            height="110"
                            rx="10"
                            fill="var(--muted)"
                            stroke="currentColor"
                            strokeWidth="1.75"
                        />
                        <text x="795" y="134" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="600">
                            Plant
                        </text>
                        <line
                            x1="734"
                            y1="145"
                            x2="856"
                            y2="145"
                            stroke="currentColor"
                            strokeOpacity="0.2"
                            strokeWidth="1"
                        />
                        <text x="795" y="176" textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="serif">
                            G(z) / G(s)
                        </text>

                        {/* Plant output */}
                        <line
                            x1="870"
                            y1="165"
                            x2="935"
                            y2="165"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            markerEnd="url(#pid-arrow)"
                        />
                        <text x="905" y="128" textAnchor="middle" className="fill-muted-foreground" fontSize="12">
                            Output
                        </text>
                        <text
                            x="905"
                            y="151"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="15"
                            fontFamily="serif"
                            fontStyle="italic"
                        >
                            y[k]
                        </text>
                        <circle cx="900" cy="165" r="3.2" fill="currentColor" />

                        {/* Unity negative feedback path */}
                        <path
                            d="M 900 165 V 293 Q 900 305 888 305 H 212 Q 200 305 200 293 V 194"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            markerEnd="url(#pid-arrow)"
                        />
                        <rect
                            x="445"
                            y="289"
                            width="210"
                            height="32"
                            rx="6"
                            fill="var(--card)"
                            stroke="var(--border)"
                            strokeWidth="1"
                        />
                        <text
                            x="550"
                            y="309"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="12.5"
                            fontFamily="serif"
                        >
                            Unity feedback: H(z) = 1
                        </text>

                        {/* Error equation */}
                        <text
                            x="480"
                            y="352"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="14.5"
                            fontFamily="serif"
                        >
                            e[k] = r[k] − y[k]
                        </text>
                        <text
                            x="480"
                            y="376"
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            fontSize="11.5"
                        >
                            Digital control · Actuator saturation
                        </text>
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
}