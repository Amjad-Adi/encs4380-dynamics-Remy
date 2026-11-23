/**
 * Shared fixed-step ODE integrators.
 *
 * These are the same explicit Euler and classical fourth-order Runge–Kutta
 * formulas introduced in the Homework 1 numerical ODE solver (Module 7),
 * generalised from a scalar state to a state vector so that every simulator
 * in the toolkit (Module 7 and the Control modules P1–P4 and MySystem) shares
 * one implementation.
 */

export type StateVector = readonly number[];

/** Right-hand side f(t, x) of the system x' = f(t, x). */
export type StateDerivative = (time: number, state: StateVector) => number[];

function addScaled(state: StateVector, rate: StateVector, scale: number): number[] {
    return state.map((value, index) => value + scale * rate[index]);
}

/** One explicit (forward) Euler step: x(t + h) ≈ x(t) + h·f(t, x). */
export function eulerStepVector(
    derivative: StateDerivative,
    time: number,
    state: StateVector,
    stepSize: number,
): number[] {
    const rate = derivative(time, state);
    return state.map((value, index) => value + stepSize * rate[index]);
}

/** One classical fourth-order Runge–Kutta step. */
export function rk4StepVector(
    derivative: StateDerivative,
    time: number,
    state: StateVector,
    stepSize: number,
): number[] {
    const k1 = derivative(time, state);
    const k2 = derivative(time + stepSize / 2, addScaled(state, k1, stepSize / 2));
    const k3 = derivative(time + stepSize / 2, addScaled(state, k2, stepSize / 2));
    const k4 = derivative(time + stepSize, addScaled(state, k3, stepSize));

    return state.map(
        (value, index) =>
            value + (stepSize / 6) * (k1[index] + 2 * k2[index] + 2 * k3[index] + k4[index]),
    );
}
