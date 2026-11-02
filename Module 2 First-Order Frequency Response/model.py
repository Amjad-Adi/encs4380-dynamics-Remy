"""First-order response with normalized gain K = 1."""

import matplotlib.pyplot as plt
import numpy as np


def response(tau, omega):
    if tau <= 0 or np.any(np.asarray(omega) < 0):
        raise ValueError("tau must be positive and omega must be nonnegative")
    magnitude = 1 / np.sqrt(1 + (omega * tau) ** 2)
    phase = -np.arctan(omega * tau)
    return magnitude, phase


def signals(tau, omega):
    if omega <= 0:
        raise ValueError("A sinusoid needs a positive frequency")
    magnitude, phase = response(tau, omega)
    time = np.linspace(0, 3 * 2 * np.pi / omega, 1200)
    input_signal = np.sin(omega * time)
    output_signal = magnitude * np.sin(omega * time + phase)
    return time, input_signal, output_signal


plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.spines.right": False,
                     "axes.labelcolor": "#40516b", "text.color": "#14243d"})


def signal_plot(tau, omega):
    time, input_signal, output_signal = signals(tau, omega)
    fig, ax = plt.subplots(figsize=(12, 2.8))
    ax.plot(time, input_signal, color="#98a6bb", linestyle="--", label="Input sin(ωt)")
    ax.plot(time, output_signal, color="#1769dc", linewidth=2.4, label="Output M sin(ωt + φ)")
    ax.set(xlabel="Time (s)", ylabel="Amplitude", ylim=(-1.15, 1.15))
    ax.grid(alpha=0.15)
    ax.legend(loc="upper right", ncol=2, frameon=False)
    fig.tight_layout()
    return fig


def bode_plot(tau, omega):
    cutoff = 1 / tau
    magnitude, phase = response(tau, omega)
    phase_deg = np.degrees(phase)
    frequencies = np.logspace(np.log10(min(cutoff, omega) / 100), np.log10(max(cutoff, omega) * 100), 600)
    ratios, phases = response(tau, frequencies)
    fig, axes = plt.subplots(1, 2, figsize=(12, 3.1))
    for ax, values, current, label, at_cutoff in [
        (axes[0], 20 * np.log10(ratios), 20 * np.log10(magnitude), "Magnitude (dB)", -3.0103),
        (axes[1], np.degrees(phases), phase_deg, "Phase (degrees)", -45),
    ]:
        ax.semilogx(frequencies, values, color="#1769dc", linewidth=2)
        ax.axvline(cutoff, color="#e08a27", linestyle="--", label=f"ωc = {cutoff:.3g} rad/s")
        ax.axhline(at_cutoff, color="#c6cedb", linestyle=":")
        ax.scatter([omega], [current], color="#1769dc", zorder=4)
        ax.set(xlabel="Angular frequency ω (rad/s)", ylabel=label)
        ax.grid(which="both", alpha=0.15)
        ax.legend(frameon=False, loc="lower left")
    axes[1].set_ylim(-95, 5)
    fig.tight_layout()
    return fig
