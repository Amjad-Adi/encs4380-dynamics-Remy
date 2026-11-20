import type {
    PIDSimulationConfig,
    PlantModel,
} from "../../domain/pid-types";
import type * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PIDControlsProps {
    config: PIDSimulationConfig;
    onChange: (config: PIDSimulationConfig) => void;
}

export function PIDControls({ config, onChange }: PIDControlsProps) {
    const updateGains = (key: "kp" | "ki" | "kd", value: number) => {
        onChange({
            ...config,
            gains: {
                ...config.gains,
                [key]: value,
            },
        });
    };

    const updatePlant = (updates: Partial<PlantModel>) => {
        onChange({
            ...config,
            plant: {
                ...config.plant,
                ...updates,
            } as PlantModel,
        });
    };

    const updateValue = (
        key: "setpoint" | "duration" | "dt",
        value: number
    ) => {
        onChange({
            ...config,
            [key]: value,
        });
    };

    const changePlantType = (type: "first-order" | "second-order") => {
        const plant: PlantModel =
            type === "first-order"
                ? {
                    type: "first-order",
                    gain: 1,
                    timeConstant: 1,
                }
                : {
                    type: "second-order",
                    gain: 1,
                    naturalFrequency: 2,
                    dampingRatio: 0.5,
                };

        onChange({
            ...config,
            plant,
        });
    };

    const numberControl = (
        id: string,
        label: string,
        value: number,
        onValueChange: (value: number) => void,
        props: React.InputHTMLAttributes<HTMLInputElement> = {},
    ) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
            <Input
                id={id}
                type="number"
                value={value}
                onChange={(event) => onValueChange(Number(event.target.value))}
                className="font-mono text-sm"
                {...props}
            />
        </div>
    );

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-base">Controller and plant</CardTitle>
                <CardDescription>Choose a plant, then tune the feedback controller.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-7">
                <div className="space-y-2">
                    <Label>Plant model</Label>
                    <Select
                        value={config.plant.type}
                        onValueChange={(value) =>
                            changePlantType(value as "first-order" | "second-order")
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="first-order">First order</SelectItem>
                            <SelectItem value="second-order">Second order</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-5 border-t pt-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        PID gains
                    </p>
                    {numberControl("pid-kp", "Kp (proportional)", config.gains.kp, (value) => updateGains("kp", value), { step: 0.1 })}
                    {numberControl("pid-ki", "Ki (integral)", config.gains.ki, (value) => updateGains("ki", value), { step: 0.1 })}
                    {numberControl("pid-kd", "Kd (derivative)", config.gains.kd, (value) => updateGains("kd", value), { step: 0.1 })}
                </div>

                <div className="space-y-5 border-t pt-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Plant parameters
                    </p>
                    {numberControl("pid-plant-gain", "Plant gain", config.plant.gain, (value) => updatePlant({ gain: value }), { step: 0.1 })}
                    {config.plant.type === "first-order"
                        ? numberControl("pid-time-constant", "Time constant", config.plant.timeConstant, (value) => updatePlant({ timeConstant: value }), { min: 0.01, step: 0.1 })
                        : <>
                            {numberControl("pid-natural-frequency", "Natural frequency", config.plant.naturalFrequency, (value) => updatePlant({ naturalFrequency: value }), { min: 0.01, step: 0.1 })}
                            {numberControl("pid-damping-ratio", "Damping ratio", config.plant.dampingRatio, (value) => updatePlant({ dampingRatio: value }), { min: 0, step: 0.1 })}
                        </>
                    }
                </div>

                <div className="space-y-5 border-t pt-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Simulation settings
                    </p>
                    {numberControl("pid-setpoint", "Setpoint", config.setpoint, (value) => updateValue("setpoint", value), { step: 0.1 })}
                    {numberControl("pid-duration", "Duration (s)", config.duration, (value) => updateValue("duration", value), { min: 0.1, step: 0.5 })}
                    {numberControl("pid-dt", "Time step dt (s)", config.dt, (value) => updateValue("dt", value), { min: 0.001, step: 0.01 })}
                </div>

                <div className="space-y-5 border-t pt-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Output limits
                    </p>
                    {numberControl("pid-output-min", "Minimum output", config.outputLimits.min, (value) => onChange({ ...config, outputLimits: { ...config.outputLimits, min: value } }), {})}
                    {numberControl("pid-output-max", "Maximum output", config.outputLimits.max, (value) => onChange({ ...config, outputLimits: { ...config.outputLimits, max: value } }), {})}
                </div>
            </CardContent>
        </Card>
    );
}