import { useEffect, useState } from 'react';

interface ChartTheme {
    foreground: string;
    muted: string;
    grid: string;
    background: string;
}

function readChartTheme(): ChartTheme {
    const styles = getComputedStyle(document.documentElement);

    return {
        foreground: styles.getPropertyValue('--foreground').trim(),
        muted: styles.getPropertyValue('--muted-foreground').trim(),
        grid: styles.getPropertyValue('--border').trim(),
        background: styles.getPropertyValue('--background').trim(),
    };
}

export function useChartTheme() {
    const [theme, setTheme] = useState<ChartTheme>(readChartTheme);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(readChartTheme());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return theme;
}
