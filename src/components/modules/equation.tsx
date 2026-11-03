import katex from 'katex';

interface EquationProps {
    expression: string;
    className?: string;
    displayMode?: boolean;
}

export function Equation({
                             expression,
                             className = '',
                             displayMode = true,
                         }: EquationProps) {
    const html = katex.renderToString(expression, {
        displayMode,
        throwOnError: false,
        strict: 'ignore',
    });

    return (
        <div
            dir="ltr"
            className={`min-w-0 overflow-x-auto py-2 text-foreground ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}