import type { ReactNode } from 'react';
import { useInView } from '@/hooks/use-in-view';

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function Reveal({
                           children,
                           className = '',
                           delay = 0,
                       }: RevealProps) {
    const { ref, inView } = useInView<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className={[
                'transition-all duration-700 ease-out',
                inView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0',
                className,
            ].join(' ')}
            style={{
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}