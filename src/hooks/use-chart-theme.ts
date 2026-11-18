import { useEffect, useState } from 'react';

interface ChartTheme {
    foreground: string;
    muted: string;
    grid: string;
    background: string;
    popover: string;
    popoverForeground: string;
    border: string;
}

function readChartTheme(): ChartTheme {
    const styles = getComputedStyle(document.documentElement);

    return {
        foreground: styles.getPropertyValue('--foreground').trim(),
        muted: styles.getPropertyValue('--muted-foreground').trim(),
        grid: styles.getPropertyValue('--border').trim(),
        background: styles.getPropertyValue('--background').trim(),
        popover: styles.getPropertyValue('--popover').trim(),
        popoverForeground: styles.getPropertyValue('--popover-foreground').trim(),
        border: styles.getPropertyValue('--border').trim(),
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
