/**
 * The one PID law used by every Control module (P1–P4 and MySystem):
 *
 *   u = sat( Kp·e + Ki·∫e dt − Kd·dy_m/dt ),   e = r − y_m
 *
 * - Derivative action acts on the measurement y_m (no derivative kick on a
 *   setpoint step; for a constant setpoint it equals Kd·de/dt).
 * - The command is clamped to the actuator limits [u_min, u_max].
 * - Conditional-integration anti-windup: the integral is frozen while the
 *   unsaturated command is beyond a limit and the error would push it further.
 */

export interface PIDGains {
    kp: number;
    ki: number;
    kd: number;
}

export interface ActuatorLimits {
    min: number;
    max: number;
}

export interface PIDCommand {
    error: number;
    unsaturatedControl: number;
    control: number;
    /** False while anti-windup freezes the integral. */
    integrating: boolean;
}

export const PID_GAIN_RANGES = {
    kp: { min: 0, max: 30, step: 0.1 },
    ki: { min: 0, max: 20, step: 0.1 },
    kd: { min: 0, max: 20, step: 0.1 },
} as const;

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/** True when integrating the error would wind the integral further into saturation. */
export function isWindingUp(unsaturatedControl: number, error: number, limits: ActuatorLimits) {
    return (
        (unsaturatedControl > limits.max && error > 0) ||
        (unsaturatedControl < limits.min && error < 0)
    );
}

/** Unsaturated PID command before the actuator clamp. */
export function getUnsaturatedCommand(
    gains: PIDGains,
    error: number,
    integral: number,
    measurementRate: number,
): number {
    return gains.kp * error + gains.ki * integral - gains.kd * measurementRate;
}

export function computePIDCommand(
    gains: PIDGains,
    limits: ActuatorLimits,
    error: number,
    integral: number,
    measurementRate: number,
): PIDCommand {
    const unsaturatedControl = getUnsaturatedCommand(gains, error, integral, measurementRate);
    return {
        error,
        unsaturatedControl,
        control: clamp(unsaturatedControl, limits.min, limits.max),
        integrating: !isWindingUp(unsaturatedControl, error, limits),
    };
}

export function validatePIDGains(gains: PIDGains): void {
    const values = [gains.kp, gains.ki, gains.kd];
    if (values.some((value) => !Number.isFinite(value))) {
        throw new RangeError('PID gains must be finite numbers.');
    }
    if (values.some((value) => value < 0)) {
        throw new RangeError('PID gains must be nonnegative.');
    }
}

export function validateLimits(limits: ActuatorLimits): void {
    if (!Number.isFinite(limits.min) || !Number.isFinite(limits.max)) {
        throw new RangeError('Actuator limits must be finite numbers.');
    }
    if (limits.min >= limits.max) {
        throw new RangeError('The minimum output limit must be below the maximum output limit.');
    }
}
