import katex from 'katex';

interface EquationProps {
    expression: string;
    className?: string;
    displayMode?: boolean;
}

export function Equation({ expression, className = '', displayMode = true }: EquationProps) {
    const html = katex.renderToString(expression, {
        displayMode,
        throwOnError: false,
        strict: 'ignore',
    });

    return (
        <div
            dir="ltr"
            className={`text-foreground min-w-0 overflow-x-auto py-2 ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
