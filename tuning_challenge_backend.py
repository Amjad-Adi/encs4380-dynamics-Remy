"""
P4 Tuning Challenge - simple Python version (for discussion only).

This file is NOT connected to the website. It repeats the main idea of the
P4 module in plain Python so it is easy to read and explain:

    1. Pick a hidden random plant (same ranges as Homework 1, Module 4).
    2. Simulate the closed loop with a PID controller (Euler method).
    3. Measure overshoot, settling time and steady-state error.
    4. Give PASS / FAIL for each part of the spec and a score out of 100.

Run it with:  python tuning_challenge_backend.py
Only the Python standard library is used.
"""

import random

# ---------------------------------------------------------------------------
# Specification (the same numbers the website uses)
# ---------------------------------------------------------------------------
MAX_OVERSHOOT = 10.0         # percent
MAX_SETTLING_TIME = 3.0      # seconds (2% band around the setpoint)
MAX_STEADY_STATE_ERROR = 1.0  # percent of the setpoint

SETPOINT = 1.0
U_MIN, U_MAX = 0.0, 100.0    # actuator limits
DT = 0.001                   # simulation time step (s)
DURATION = 10.0              # simulation length (s)


# ---------------------------------------------------------------------------
# 1. Hidden random plant
# ---------------------------------------------------------------------------
def make_hidden_plant():
    """Return a random first-order or second-order plant with unit gain."""
    if random.random() < 0.5:
        return {"type": "first-order", "tau": random.uniform(0.45, 2.4)}
    return {
        "type": "second-order",
        "zeta": random.uniform(0.2, 0.8),
        "wn": random.uniform(0.8, 3.2),
    }


# ---------------------------------------------------------------------------
# 2. Closed-loop simulation
# ---------------------------------------------------------------------------
def simulate(plant, kp, ki, kd):
    """Simulate the PID loop and return lists of time and output values."""
    y = 0.0          # plant output
    y_dot = 0.0      # output rate (used by the second-order plant)
    integral = 0.0   # integral of the error

    times, outputs = [], []
    steps = int(DURATION / DT)

    for k in range(steps + 1):
        t = k * DT
        times.append(t)
        outputs.append(y)

        # PID controller (derivative acts on the output, not the error)
        error = SETPOINT - y
        integral += error * DT
        base = kp * error + ki * integral

        # Rate of the output, dy/dt, for the derivative term
        if plant["type"] == "first-order":
            # dy/dt depends on u itself, so solve u = base - kd*dy/dt exactly
            y_rate = (base - y) / (plant["tau"] + kd)
        else:
            y_rate = y_dot

        u = base - kd * y_rate
        u = max(U_MIN, min(U_MAX, u))   # actuator saturation

        # Plant update (Euler method)
        if plant["type"] == "first-order":
            # tau * dy/dt + y = u
            y += DT * (u - y) / plant["tau"]
        else:
            # y'' + 2*zeta*wn*y' + wn^2*y = wn^2*u
            zeta, wn = plant["zeta"], plant["wn"]
            y_ddot = wn ** 2 * (u - y) - 2 * zeta * wn * y_dot
            y_dot += DT * y_ddot
            y += DT * y_dot

    return times, outputs


# ---------------------------------------------------------------------------
# 3. Performance metrics
# ---------------------------------------------------------------------------
def measure(times, outputs):
    """Return overshoot (%), settling time (s or None) and error (%)."""
    peak = max(outputs)
    overshoot = max(0.0, (peak - SETPOINT) / SETPOINT * 100)

    # Settling time: last moment the output is outside the +-2% band
    band = 0.02 * SETPOINT
    settling_time = 0.0
    for t, y in zip(times, outputs):
        if abs(y - SETPOINT) > band:
            settling_time = t
    if settling_time >= times[-1]:
        settling_time = None    # never settled inside the simulation

    # Steady-state error: average error over the last 5% of the run
    tail = outputs[int(len(outputs) * 0.95):]
    final_error = sum(abs(SETPOINT - y) for y in tail) / len(tail)
    steady_state_error = final_error / SETPOINT * 100

    return overshoot, settling_time, steady_state_error


# ---------------------------------------------------------------------------
# 4. PASS / FAIL and score
# ---------------------------------------------------------------------------
def part_points(measured, limit):
    """Up to 33.3 points per part; a failed part gets partial credit."""
    full = 100 / 3
    if measured is None:
        return False, 0.0
    if measured <= limit:
        return True, full
    return False, full * limit / measured


def evaluate(overshoot, settling_time, steady_state_error):
    parts = [
        ("Maximum overshoot", overshoot, MAX_OVERSHOOT, "%"),
        ("Settling time (2%)", settling_time, MAX_SETTLING_TIME, "s"),
        ("Steady-state error", steady_state_error, MAX_STEADY_STATE_ERROR, "%"),
    ]
    total = 0.0
    all_passed = True
    for name, measured, limit, unit in parts:
        passed, points = part_points(measured, limit)
        total += points
        all_passed = all_passed and passed
        shown = "not reached" if measured is None else f"{measured:.2f} {unit}"
        print(f"  {name:<20} {shown:>12}  (limit <= {limit} {unit})  "
              f"{'PASS' if passed else 'FAIL'}  {points:5.1f} pts")

    # Only a design that passes every part can get the full 100
    score = 100 if all_passed else min(99, round(total))
    print(f"  Score: {score} / 100")
    return all_passed


# ---------------------------------------------------------------------------
# Example run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    plant = make_hidden_plant()

    # Try a few gain sets on the same hidden plant
    for kp, ki, kd in [(1, 0, 0), (9, 0, 0), (27, 2, 12)]:
        print(f"\nGains: Kp = {kp}, Ki = {ki}, Kd = {kd}")
        times, outputs = simulate(plant, kp, ki, kd)
        solved = evaluate(*measure(times, outputs))
        if solved:
            print(f"  Solved! The hidden plant was: {plant}")
