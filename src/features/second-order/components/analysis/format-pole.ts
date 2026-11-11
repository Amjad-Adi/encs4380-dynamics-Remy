export function formatPole(real: number, imaginary: number): string {
    if (imaginary === 0) return real.toFixed(4);

    return `${real.toFixed(4)} ${imaginary < 0 ? '−' : '+'} j${Math.abs(imaginary).toFixed(4)}`;
}
