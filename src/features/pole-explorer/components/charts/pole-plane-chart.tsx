import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

import {
    POLE_LIMIT,
    clampPole,
    formatPole,
    getPoles,
    type ComplexPole,
    type PoleConfiguration,
} from '@/features/pole-explorer/domain/pole-explorer';

const VIEW_SIZE = 520;
const PADDING_LEFT = 44;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 44;
const PLOT_SIZE = VIEW_SIZE - PADDING_LEFT - PADDING_RIGHT;
const GRID_VALUES = [-6, -4, -2, 0, 2, 4, 6];
const TICK_VALUES = [-6, -4, -2, 2, 4, 6];
const MARGINAL_COLOR = '#d69a35';
const KEYBOARD_STEP = 0.2;
const KEYBOARD_LARGE_STEP = 0.5;

interface PolePlaneChartProps {
    configuration: PoleConfiguration;
    onPoleChange: (index: number, pole: ComplexPole) => void;
}

export function PolePlaneChart({ configuration, onPoleChange }: PolePlaneChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const poles = getPoles(configuration);
    const draggingPole = draggingIndex === null ? null : poles[draggingIndex];

    function handlePointerDown(event: ReactPointerEvent<SVGGElement>, index: number) {
        const svg = svgRef.current;
        if (!svg) return;

        event.preventDefault();
        svg.setPointerCapture(event.pointerId);
        setDraggingIndex(index);
    }

    function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
        if (draggingIndex === null) return;

        const svg = svgRef.current;
        const matrix = svg?.getScreenCTM();
        if (!svg || !matrix) return;

        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;

        const local = point.matrixTransform(matrix.inverse());
        onPoleChange(draggingIndex, fromSvg(local.x, local.y));
    }

    function endPointerDrag(event: ReactPointerEvent<SVGSVGElement>) {
        const svg = svgRef.current;

        if (svg?.hasPointerCapture(event.pointerId)) {
            svg.releasePointerCapture(event.pointerId);
        }

        setDraggingIndex(null);
    }

    function handleKeyDown(event: ReactKeyboardEvent<SVGGElement>, index: number) {
        const pole = poles[index];
        const step = event.shiftKey ? KEYBOARD_LARGE_STEP : KEYBOARD_STEP;
        let nextPole: ComplexPole | null = null;

        switch (event.key) {
            case 'ArrowLeft':
                nextPole = {
                    real: pole.real - step,
                    imaginary: pole.imaginary,
                };
                break;
            case 'ArrowRight':
                nextPole = {
                    real: pole.real + step,
                    imaginary: pole.imaginary,
                };
                break;
            case 'ArrowUp':
                if (configuration.order === 'first') return;
                nextPole = {
                    real: pole.real,
                    imaginary: pole.imaginary + step,
                };
                break;
            case 'ArrowDown':
                if (configuration.order === 'first') return;
                nextPole = {
                    real: pole.real,
                    imaginary: pole.imaginary - step,
                };
                break;
            default:
                return;
        }

        event.preventDefault();
        onPoleChange(index, clampPole(nextPole));
    }

    const axisX = toSvg({ real: 0, imaginary: 0 }).x;
    const axisY = toSvg({ real: 0, imaginary: 0 }).y;
    const plotRight = PADDING_LEFT + PLOT_SIZE;
    const plotBottom = PADDING_TOP + PLOT_SIZE;

    return (
        <div className="min-w-0 space-y-2">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
                className="h-auto w-full touch-none select-none"
                role="group"
                aria-label="Interactive complex s-plane. Drag a pole or focus it and use the arrow keys."
                onPointerMove={handlePointerMove}
                onPointerUp={endPointerDrag}
                onPointerCancel={endPointerDrag}
            >
                <rect
                    x={PADDING_LEFT}
                    y={PADDING_TOP}
                    width={PLOT_SIZE}
                    height={PLOT_SIZE}
                    fill="var(--background)"
                    stroke="var(--border)"
                    strokeWidth={1}
                />

                <rect
                    x={PADDING_LEFT}
                    y={PADDING_TOP}
                    width={axisX - PADDING_LEFT}
                    height={PLOT_SIZE}
                    fill="var(--success)"
                    opacity={0.06}
                />

                <rect
                    x={axisX}
                    y={PADDING_TOP}
                    width={plotRight - axisX}
                    height={PLOT_SIZE}
                    fill="var(--destructive)"
                    opacity={0.06}
                />

                <text x={PADDING_LEFT + 8} y={PADDING_TOP + 16} fontSize={10} fill="var(--success)">
                    Left half-plane · stable
                </text>

                <text
                    x={plotRight - 8}
                    y={PADDING_TOP + 16}
                    fontSize={10}
                    textAnchor="end"
                    fill="var(--destructive)"
                >
                    Right half-plane · unstable
                </text>

                {GRID_VALUES.map((value) => {
                    const x = toSvg({
                        real: value,
                        imaginary: 0,
                    }).x;
                    const y = toSvg({
                        real: 0,
                        imaginary: value,
                    }).y;

                    return (
                        <g key={`grid-${value}`}>
                            <line
                                x1={x}
                                y1={PADDING_TOP}
                                x2={x}
                                y2={plotBottom}
                                stroke="var(--border)"
                                strokeWidth={value === 0 ? 0 : 1}
                                strokeDasharray={value === 0 ? undefined : '3 6'}
                                opacity={0.6}
                            />

                            <line
                                x1={PADDING_LEFT}
                                y1={y}
                                x2={plotRight}
                                y2={y}
                                stroke="var(--border)"
                                strokeWidth={value === 0 ? 0 : 1}
                                strokeDasharray={value === 0 ? undefined : '3 6'}
                                opacity={0.6}
                            />
                        </g>
                    );
                })}

                <line
                    x1={PADDING_LEFT}
                    y1={axisY}
                    x2={plotRight}
                    y2={axisY}
                    stroke="var(--muted-foreground)"
                    strokeWidth={1.4}
                />

                <line
                    x1={axisX}
                    y1={PADDING_TOP}
                    x2={axisX}
                    y2={plotBottom}
                    stroke="var(--muted-foreground)"
                    strokeWidth={1.4}
                />

                <text
                    x={plotRight - 4}
                    y={axisY - 8}
                    fontSize={10}
                    textAnchor="end"
                    fill="var(--muted-foreground)"
                >
                    σ (real)
                </text>

                <text
                    x={axisX + 7}
                    y={PADDING_TOP + 30}
                    fontSize={10}
                    fill="var(--muted-foreground)"
                >
                    jω
                </text>

                {TICK_VALUES.map((value) => {
                    const x = toSvg({
                        real: value,
                        imaginary: 0,
                    }).x;
                    const y = toSvg({
                        real: 0,
                        imaginary: value,
                    }).y;

                    return (
                        <g key={`tick-${value}`}>
                            <text
                                x={x}
                                y={axisY + 14}
                                fontSize={9}
                                textAnchor="middle"
                                fill="var(--muted-foreground)"
                            >
                                {formatTick(value)}
                            </text>

                            <text
                                x={axisX - 6}
                                y={y + 3}
                                fontSize={9}
                                textAnchor="end"
                                fill="var(--muted-foreground)"
                            >
                                {formatTick(value)}
                            </text>
                        </g>
                    );
                })}

                {poles.length === 2 &&
                    Math.abs(poles[0].imaginary) > 0 &&
                    Math.abs(poles[1].imaginary) > 0 && (
                        <line
                            x1={toSvg(poles[0]).x}
                            y1={toSvg(poles[0]).y}
                            x2={toSvg(poles[1]).x}
                            y2={toSvg(poles[1]).y}
                            stroke={getPoleColor(poles[0])}
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                            opacity={0.5}
                        />
                    )}

                {draggingPole && (
                    <g pointerEvents="none">
                        <line
                            x1={PADDING_LEFT}
                            y1={toSvg(draggingPole).y}
                            x2={toSvg(draggingPole).x}
                            y2={toSvg(draggingPole).y}
                            stroke={getPoleColor(draggingPole)}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            opacity={0.5}
                        />

                        <line
                            x1={toSvg(draggingPole).x}
                            y1={plotBottom}
                            x2={toSvg(draggingPole).x}
                            y2={toSvg(draggingPole).y}
                            stroke={getPoleColor(draggingPole)}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            opacity={0.5}
                        />
                    </g>
                )}

                {poles.map((pole, index) => {
                    const { x, y } = toSvg(pole);
                    const color = getPoleColor(pole);
                    const isActive = draggingIndex === index || focusedIndex === index;
                    const isDuplicate = poles.some(
                        (other, otherIndex) =>
                            otherIndex !== index &&
                            Math.abs(other.real - pole.real) < 1e-9 &&
                            Math.abs(other.imaginary - pole.imaginary) < 1e-9,
                    );
                    const labelOnLeft = x > PADDING_LEFT + PLOT_SIZE * 0.68;
                    const labelX = labelOnLeft ? x - 14 : x + 14;
                    const labelY = pole.imaginary < 0 ? y + 20 : y - 14;
                    const showLabel = !isDuplicate || index === 0;

                    return (
                        <g
                            key={`pole-${index}`}
                            role="slider"
                            tabIndex={0}
                            aria-label={`Pole ${index + 1}`}
                            aria-valuemin={-POLE_LIMIT}
                            aria-valuemax={POLE_LIMIT}
                            aria-valuenow={Number(pole.real.toFixed(2))}
                            aria-valuetext={`Real ${pole.real.toFixed(2)}, imaginary ${pole.imaginary.toFixed(2)}`}
                            className="cursor-grab outline-none focus-visible:outline-none"
                            onPointerDown={(event) => handlePointerDown(event, index)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={() =>
                                setFocusedIndex((current) => (current === index ? null : current))
                            }
                        >
                            <circle cx={x} cy={y} r={22} fill="transparent" />

                            {isActive && (
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={19}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={2}
                                    strokeDasharray="4 3"
                                    opacity={0.55}
                                />
                            )}

                            <circle
                                cx={x}
                                cy={y}
                                r={10}
                                fill="var(--card)"
                                stroke={color}
                                strokeWidth={2.5}
                            />

                            <line
                                x1={x - 5}
                                y1={y - 5}
                                x2={x + 5}
                                y2={y + 5}
                                stroke={color}
                                strokeWidth={2}
                            />

                            <line
                                x1={x - 5}
                                y1={y + 5}
                                x2={x + 5}
                                y2={y - 5}
                                stroke={color}
                                strokeWidth={2}
                            />

                            {showLabel && (
                                <text
                                    x={labelX}
                                    y={labelY}
                                    fontSize={11}
                                    fontFamily="monospace"
                                    textAnchor={labelOnLeft ? 'end' : 'start'}
                                    fill={color}
                                >
                                    {formatPole(pole)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            <p className="text-muted-foreground text-xs leading-5">
                Drag a pole in the s-plane, or focus a pole and use the arrow keys (hold Shift for
                larger steps). Second-order complex poles stay conjugate automatically.
            </p>
        </div>
    );
}

function toSvg(pole: ComplexPole) {
    return {
        x: PADDING_LEFT + ((pole.real + POLE_LIMIT) / (2 * POLE_LIMIT)) * PLOT_SIZE,
        y: PADDING_TOP + ((POLE_LIMIT - pole.imaginary) / (2 * POLE_LIMIT)) * PLOT_SIZE,
    };
}

function fromSvg(x: number, y: number): ComplexPole {
    return {
        real: ((x - PADDING_LEFT) / PLOT_SIZE) * 2 * POLE_LIMIT - POLE_LIMIT,
        imaginary: POLE_LIMIT - ((y - PADDING_TOP) / PLOT_SIZE) * 2 * POLE_LIMIT,
    };
}

function getPoleColor(pole: ComplexPole): string {
    if (pole.real > 1e-6) return 'var(--destructive)';
    if (pole.real > -1e-6) return MARGINAL_COLOR;
    return 'var(--primary)';
}

function formatTick(value: number): string {
    if (value === 0) return '0';
    if (value < 0) return `−${Math.abs(value)}`;
    return `${value}`;
}
