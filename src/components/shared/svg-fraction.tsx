interface SvgFractionProps {
    x: number;
    y: number;
    numerator: string;
    denominator: string;
    width?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
}

export function SvgFraction({
                                x,
                                y,
                                numerator,
                                denominator,
                                width = 70,
                                fontSize = 14,
                                fontFamily = 'serif',
                                color = 'currentColor',
                            }: SvgFractionProps) {
    // Align the fraction bar with the optical midline of adjacent text sharing baseline `y`
    const barY = y - fontSize * 0.32;
    const textSize = Math.round(fontSize * 0.88 * 10) / 10;
    const gap = Math.max(3, fontSize * 0.25);

    const numeratorY = barY - gap;
    const denominatorY = barY + gap + textSize * 0.78;

    return (
        <g
            fill={color}
            fontFamily={fontFamily}
            fontSize={textSize}
        >
            <text
                x={x}
                y={numeratorY}
                textAnchor="middle"
            >
                {numerator}
            </text>

            <line
                x1={x - width / 2}
                y1={barY}
                x2={x + width / 2}
                y2={barY}
                stroke={color}
                strokeWidth={1}
            />

            <text
                x={x}
                y={denominatorY}
                textAnchor="middle"
            >
                {denominator}
            </text>
        </g>
    );
}