
import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ParameterControlProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    description?: ReactNode;
    onChange: (value: number) => void;
}

export function ParameterControl({
    id,
    label,
    value,
    min,
    max,
    step,
    unit,
    description,
    onChange,
}: ParameterControlProps) {
    const decimals = Math.max(
        0,
        (step.toString().split('.')[1] ?? '').length,
    );

    function updateValue(nextValue: number) {
        if (!Number.isFinite(nextValue)) return;

        onChange(Math.min(max, Math.max(min, nextValue)));
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <Label htmlFor={id} className="font-medium">
                    {label}
                </Label>

                <div className="flex items-center gap-2">
                    <Input
                        id={`${id}-number`}
                        type="number"
                        value={value}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(event) =>
                            updateValue(Number(event.target.value))
                        }
                        className="h-8 w-24 text-right font-mono text-sm"
                        aria-label={`${label} value`}
                    />

                    <span className="w-12 text-xs text-muted-foreground">
                        {unit}
                    </span>
                </div>
            </div>

            <Slider
                id={id}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={(values) => updateValue(values[0])}
                className="w-full cursor-pointer"
                aria-label={label}
            />

            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-xs text-muted-foreground">
                <span>{min.toFixed(decimals)}</span>

                <span className="text-center">
                    {description}
                </span>

                <span className="text-right">
                    {max.toFixed(decimals)} {unit}
                </span>
            </div>
        </div>
    );
}
