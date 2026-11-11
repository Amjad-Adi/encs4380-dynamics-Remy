import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/** Mobile is any viewport narrower than Tailwind's md breakpoint. */
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
    );

    React.useEffect(() => {
        const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

        const update = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        setIsMobile(query.matches);
        query.addEventListener('change', update);

        return () => query.removeEventListener('change', update);
    }, []);

    return isMobile;
}
