import { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '@/models/enums/themes.ts';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: Theme.SYSTEM,
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = Theme.SYSTEM,
    storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
    );

    useEffect(() => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            root.classList.remove(Theme.LIGHT, Theme.DARK);

            const resolvedTheme =
                theme === Theme.SYSTEM ? (mediaQuery.matches ? Theme.DARK : Theme.LIGHT) : theme;

            root.classList.add(resolvedTheme);
        };

        applyTheme();

        mediaQuery.addEventListener('change', applyTheme);

        return () => {
            mediaQuery.removeEventListener('change', applyTheme);
        };
    }, [theme]);

    const setTheme = (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setThemeState(theme);
    };

    return (
        <ThemeProviderContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeProviderContext);
}
