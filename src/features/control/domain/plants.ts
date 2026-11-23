import type { FirstOrderParameters } from '@/features/first-order-time/domain/first-order-time';
import {
    REQUIRED_VALIDATION_PARAMETERS,
    getDampingRatio,
    getNaturalFrequency,
    type PhysicalParameters,
} from '@/features/second-order/domain';
import { validateParameters as validateSecondOrderParameters } from '@/features/second-order/domain/parameters';
import type { SensorParameters } from '@/features/sensor-challenge/domain/sensor-challenge';

/**
 * Plant library shared by every Control module.
 *
 * - First-order plant G₁(s) = K / (τs + 1) — the Homework 1 Module 1 model.
 * - Second-order plant G₂(s) = 1 / (ms² + bs + k) — the Homework 1 Module 3
 *   mass–spring–damper, driven by the controller force u.
 */

export type PlantType = 'first-order' | 'second-order';

/** Module 1 parameters without the input amplitude (the controller supplies the input). */
export type FirstOrderPlantParameters = Pick<FirstOrderParameters, 'gain' | 'tau'>;

/** Module 3 mass–spring–damper parameters. */
export type SecondOrderPlantParameters = PhysicalParameters;

export type FirstOrderPlant = { type: 'first-order' } & FirstOrderPlantParameters;
export type SecondOrderPlant = { type: 'second-order' } & SecondOrderPlantParameters;
export type Plant = FirstOrderPlant | SecondOrderPlant;

/** Defaults shared by P1, P2 and P3 so the same plant can be compared across modules. */
export const DEFAULT_FIRST_ORDER_PLANT: Readonly<FirstOrderPlantParameters> = { gain: 1, tau: 1 };
/** Module 3's required validation case (m = 1, b = 2, k = 4). */
export const DEFAULT_SECOND_ORDER_PLANT: Readonly<SecondOrderPlantParameters> =
    REQUIRED_VALIDATION_PARAMETERS;

/** Slider ranges shared by the plant controls in P1, P2 and P3. */
export const PLANT_PARAMETER_RANGES = {
    gain: { min: 0.1, max: 5, step: 0.1 },
    tau: { min: 0.1, max: 5, step: 0.1 },
    m: { min: 0.1, max: 10, step: 0.1 },
    b: { min: 0, max: 20, step: 0.1 },
    k: { min: 0.1, max: 100, step: 0.1 },
} as const;

export type PlantParameterKey = keyof typeof PLANT_PARAMETER_RANGES;

/** UI state that keeps both parameter sets so switching plant type does not lose values. */
export interface PlantSelection {
    plantType: PlantType;
    firstOrder: FirstOrderPlantParameters;
    secondOrder: SecondOrderPlantParameters;
}

export function createDefaultPlantSelection(plantType: PlantType = 'first-order'): PlantSelection {
    return {
        plantType,
        firstOrder: { ...DEFAULT_FIRST_ORDER_PLANT },
        secondOrder: { ...DEFAULT_SECOND_ORDER_PLANT },
    };
}

export function getSelectedPlant(selection: PlantSelection): Plant {
    return selection.plantType === 'first-order'
        ? { type: 'first-order', ...selection.firstOrder }
        : { type: 'second-order', ...selection.secondOrder };
}

export function updatePlantSelection(
    selection: PlantSelection,
    key: PlantParameterKey,
    value: number,
): PlantSelection {
    if (!Number.isFinite(value)) return selection;
    if (key === 'gain' || key === 'tau') {
        return { ...selection, firstOrder: { ...selection.firstOrder, [key]: value } };
    }
    return { ...selection, secondOrder: { ...selection.secondOrder, [key]: value } };
}

/**
 * Converts the standard form G(s) = Kωn² / (s² + 2ζωn s + ωn²) into the equivalent
 * Module 3 mass–spring–damper, so every second-order plant is simulated by one model.
 */
export function secondOrderFromStandardForm({
    gain = 1,
    omegaN,
    zeta,
}: {
    gain?: number;
    omegaN: number;
    zeta: number;
}): SecondOrderPlant {
    if (!(gain > 0) || !(omegaN > 0) || !(zeta >= 0)) {
        throw new RangeError('Standard-form plants require K > 0, ωn > 0 and ζ ≥ 0.');
    }
    return {
        type: 'second-order',
        m: 1 / (gain * omegaN ** 2),
        b: (2 * zeta) / (gain * omegaN),
        k: 1 / gain,
    };
}

/** Maps a Homework 1 Module 4 random sensor (unit DC gain) onto the shared plant model. */
export function plantFromSensorParameters(sensor: SensorParameters): Plant {
    return sensor.type === 'first-order'
        ? { type: 'first-order', gain: 1, tau: sensor.tau }
        : secondOrderFromStandardForm({ gain: 1, omegaN: sensor.omegaN, zeta: sensor.zeta });
}

export function validatePlant(plant: Plant): void {
    if (plant.type === 'first-order') {
        const { gain, tau } = plant;
        if (!Number.isFinite(gain) || gain <= 0 || !Number.isFinite(tau) || tau <= 0) {
            throw new RangeError('First-order gain and time constant must be positive.');
        }
        return;
    }
    validateSecondOrderParameters(plant);
}

export function getPlantDCGain(plant: Plant): number {
    return plant.type === 'first-order' ? plant.gain : 1 / plant.k;
}

/** Natural frequency ωn and damping ratio ζ of a second-order plant, from Module 3. */
export function getSecondOrderCharacteristics(plant: SecondOrderPlantParameters) {
    return { omegaN: getNaturalFrequency(plant), zeta: getDampingRatio(plant) };
}

/** Fastest open-loop rate of the plant (rad/s), used to size integration steps. */
export function getPlantRate(plant: Plant): number {
    if (plant.type === 'first-order') return 1 / plant.tau;
    const { m, b, k } = plant;
    return Math.max(Math.sqrt(k / m), b / m);
}

/** Plant state: output y and its rate ẏ (ẏ is only a state for the second-order plant). */
export interface PlantState {
    output: number;
    velocity: number;
}

/** Plant dynamics for a given actuator input u. */
export function getPlantDerivative(plant: Plant, state: PlantState, input: number): PlantState {
    if (plant.type === 'first-order') {
        return { output: (plant.gain * input - state.output) / plant.tau, velocity: 0 };
    }
    const { m, b, k } = plant;
    return {
        output: state.velocity,
        velocity: (input - b * state.velocity - k * state.output) / m,
    };
}

export function describePlant(plant: Plant): string {
    if (plant.type === 'first-order') {
        return `First-order · K = ${plant.gain.toFixed(2)}, τ = ${plant.tau.toFixed(2)} s`;
    }
    const { omegaN, zeta } = getSecondOrderCharacteristics(plant);
    return `Second-order · ωn = ${omegaN.toFixed(3)} rad/s, ζ = ${zeta.toFixed(3)}`;
}
