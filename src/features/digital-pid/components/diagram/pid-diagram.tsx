type PIDDiagramProps = {
    kp: number;
    ki: number;
    kd: number;
};

export function PIDDiagram({ kp, ki, kd }: PIDDiagramProps) {
    return (
        <section className="pid-diagram">
            <h2>Closed-Loop PID Control System</h2>

            <div className="pid-diagram-visual">
                <svg
                    viewBox="0 0 900 380"
                    className="pid-diagram-svg"
                    role="img"
                    aria-label="Closed loop PID control system diagram"
                >
                    {/* Setpoint line */}
                    <line x1="40" y1="150" x2="170" y2="150" className="pid-line" />

                    {/* Arrow */}
                    <polygon points="170,145 180,150 170,155" className="pid-arrow-head" />

                    {/* Summing Junction */}
                    <circle cx="210" cy="150" r="30" className="pid-sum-circle" />
                    <text x="210" y="145" textAnchor="middle" className="pid-svg-text">
                        +
                    </text>
                    <text x="210" y="165" textAnchor="middle" className="pid-svg-text">
                        −
                    </text>

                    {/* Error to controller */}
                    <line x1="240" y1="150" x2="310" y2="150" className="pid-line" />
                    <polygon points="310,145 320,150 310,155" className="pid-arrow-head" />

                    {/* PID Controller */}
                    <rect
                        x="320"
                        y="95"
                        width="180"
                        height="110"
                        rx="16"
                        className="pid-block pid-controller-block"
                    />

                    <text x="410" y="125" textAnchor="middle" className="pid-block-title">
                        PID Controller
                    </text>

                    <text x="410" y="150" textAnchor="middle" className="pid-svg-text">
                        Kp: {kp}
                    </text>

                    <text x="410" y="170" textAnchor="middle" className="pid-svg-text">
                        Ki: {ki}
                    </text>

                    <text x="410" y="190" textAnchor="middle" className="pid-svg-text">
                        Kd: {kd}
                    </text>

                    {/* Controller to Plant */}
                    <line x1="500" y1="150" x2="580" y2="150" className="pid-line" />
                    <polygon points="580,145 590,150 580,155" className="pid-arrow-head" />

                    {/* Plant */}
                    <rect
                        x="590"
                        y="105"
                        width="160"
                        height="90"
                        rx="16"
                        className="pid-block pid-plant-block"
                    />

                    <text x="670" y="140" textAnchor="middle" className="pid-block-title">
                        Plant
                    </text>

                    <text x="670" y="165" textAnchor="middle" className="pid-svg-text">
                        System
                    </text>

                    {/* Plant output */}
                    <line x1="750" y1="150" x2="820" y2="150" className="pid-line" />
                    <polygon points="820,145 830,150 820,155" className="pid-arrow-head" />

                    {/* Feedback line */}
                    <line x1="820" y1="150" x2="820" y2="300" className="pid-feedback-line" />
                    <line x1="820" y1="300" x2="210" y2="300" className="pid-feedback-line" />
                    <line x1="210" y1="300" x2="210" y2="180" className="pid-feedback-line" />

                    {/* Feedback arrow */}
                    <polygon points="205,185 210,175 215,185" className="pid-arrow-head" />

                    {/* Labels */}
                    <text x="100" y="130" textAnchor="middle" className="pid-label">
                        Setpoint
                    </text>

                    <text x="275" y="130" textAnchor="middle" className="pid-label">
                        Error
                    </text>

                    <text x="780" y="130" textAnchor="middle" className="pid-label">
                        Output
                    </text>

                    <text x="500" y="325" textAnchor="middle" className="pid-feedback-label">
                        Feedback · Measured Output
                    </text>
                </svg>
            </div>
        </section>
    );
}