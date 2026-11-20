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
import { ParameterControl } from "@/components/shared/parameter-control";

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
                    <ParameterControl
                        id="pid-kp"
                        label={<>Proportional gain (Kp)</>}
                        ariaLabel="Proportional gain Kp"
                        value={config.gains.kp}
                        min={0}
                        max={30}
                        step={0.1}
                        unit="-"
                        description="Acts on present error"
                        onChange={(value) => updateGains("kp", value)}
                    />
                    <ParameterControl
                        id="pid-ki"
                        label={<>Integral gain (Ki)</>}
                        ariaLabel="Integral gain Ki"
                        value={config.gains.ki}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="1/s"
                        description="Accumulates past error"
                        onChange={(value) => updateGains("ki", value)}
                    />
                    <ParameterControl
                        id="pid-kd"
                        label={<>Derivative gain (Kd)</>}
                        ariaLabel="Derivative gain Kd"
                        value={config.gains.kd}
                        min={0}
                        max={20}
                        step={0.1}
                        unit="s"
                        description="Responds to error change"
                        onChange={(value) => updateGains("kd", value)}
                    />
                </div>

                <div className="space-y-5 border-t pt-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Plant parameters
                    </p>
                    <ParameterControl
                        id="pid-plant-gain"
                        label="Plant gain (K)"
                        value={config.plant.gain}
                        min={0.1}
                        max={5}
                        step={0.1}
                        unit="-"
                        description="Steady-state gain"
                        onChange={(value) => updatePlant({ gain: value })}
                    />
                    {config.plant.type === "first-order" ? (
                        <ParameterControl
                            id="pid-time-constant"
                            label="Time Constant (τ)"
                            value={config.plant.timeConstant}
                            min={0.1}
                            max={5}
                            step={0.1}
                            unit="s"
                            description="Open-loop response speed"
                            onChange={(value) => updatePlant({ timeConstant: value })}
                        />
                    ) : (
                        <>
                            <ParameterControl
                                id="pid-natural-frequency"
                                label="Natural Frequency (ωₙ)"
                                value={config.plant.naturalFrequency}
                                min={0.01}
                                max={10}
                                step={0.1}
                                unit="rad/s"
                                description="Plant oscillation frequency"
                                onChange={(value) =>
                                    updatePlant({ naturalFrequency: value })
                                }
                            />
                            <ParameterControl
                                id="pid-damping-ratio"
                                label="Damping Ratio (ζ)"
                                value={config.plant.dampingRatio}
                                min={0}
                                max={3}
                                step={0.1}
                                unit="-"
                                description="Plant damping"
                                onChange={(value) =>
                                    updatePlant({ dampingRatio: value })
                                }
                            />
                        </>
                    )}
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