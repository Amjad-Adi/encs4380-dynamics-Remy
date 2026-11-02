import matplotlib.pyplot as plt
import numpy as np
import streamlit as st

from model import response, signal_plot, bode_plot

st.set_page_config(page_title="First-order frequency lab", page_icon="〰️", layout="wide")
st.markdown("""<style>
:root {color-scheme:light only}
[data-testid="stToolbar"] {display:none}
.stApp {background:#f5f7fb;color:#14243d}
h1,h2,h3 {color:#14243d}
[data-testid="stMetric"] {background:white;border:1px solid #e0e6ef;border-radius:12px;padding:16px}
[data-testid="stSidebar"] {background:#e9eef6}
.block-container {padding-top:4rem;max-width:1450px}
</style>""", unsafe_allow_html=True)
st.caption("DYNAMICS LAB   /   MODULE 02")
st.title("First-order frequency response")
st.write("Explore how a slow system filters a changing signal. Adjust the controls and compare what goes in with what comes out.")

with st.sidebar:
    st.header("Experiment controls")
    tau = st.number_input("Time constant τ (s)", min_value=0.1, max_value=5.0, value=1.0, step=0.1, format="%.3f")
    omega = st.number_input("Angular frequency ω (rad/s)", min_value=0.01, max_value=20.0, value=1.0, step=0.01, format="%.3f")
    st.caption("Type a number and press Enter to update the results.")
    st.caption("Larger τ means a slower system. Larger ω means a faster-changing input.")
    st.divider()
    st.latex(r"G(s)=\frac{K}{\tau s+1},\quad K=1")
    st.latex(r"M=\frac{1}{\sqrt{1+(\omega\tau)^2}}")
    st.latex(r"\varphi=-\arctan(\omega\tau)")
    st.info("Steady-state response: startup transients are omitted. Input amplitude is 1; time and frequency use seconds and rad/s.")

magnitude, phase = response(tau, omega)
phase_deg = np.degrees(phase)
cutoff = 1 / tau
error = magnitude - 1
cols = st.columns(4)
cols[0].metric("Amplitude ratio M", f"{magnitude:.4f}")
cols[1].metric("Phase φ", f"{phase_deg:.2f}°")
cols[2].metric("Cutoff ωc", f"{cutoff:.3f} rad/s")
cols[3].metric("Relative amplitude error δ", f"{error:.4f}", f"{error * 100:.2f}%", delta_color="off")

def finish_plot(fig):
    st.pyplot(fig, width="stretch")
    plt.close(fig)


st.subheader("01 / Watch the signal")
st.caption(f"ωτ = {omega * tau:.3f} · Three input cycles · Output lags by {-phase_deg:.2f}°")
finish_plot(signal_plot(tau, omega))

st.subheader("02 / Read the frequency response")
st.caption("Blue: response curve · Orange dashed: cutoff · Blue dot: selected input frequency")
finish_plot(bode_plot(tau, omega))
st.info(f"At the cutoff ωc = 1/τ = {cutoff:.3f} rad/s, M = 1/√2 ≈ 0.7071 (−3.01 dB), and φ = −45°. Below cutoff the system follows more closely; above it, attenuation and phase lag grow. Increasing τ moves the cutoff to a lower frequency.")

left, right = st.columns(2, gap="large")
with left:
    st.subheader("03 / Dynamic-error calculator")
    st.latex(r"\delta=M-1")
    st.write(f"At the current controls: **{magnitude:.4f} − 1 = {error:.4f}**, or **{100 * error:.2f}%**.")
    st.caption("The negative sign means amplitude loss. This measures amplitude error only; it does not include phase error.")
    tolerance = st.number_input("Allowable amplitude loss (%)", min_value=1, max_value=50, value=10, step=1)
    minimum_ratio = 1 - tolerance / 100
    limit = np.sqrt(1 / minimum_ratio**2 - 1) / tau
    st.write(f"For this τ, keep ω ≤ **{limit:.3f} rad/s** for at most {tolerance}% amplitude loss.")
    if -100 * error <= tolerance:
        st.success("Current frequency is within the amplitude-loss tolerance.")
    else:
        st.warning("Current frequency exceeds the amplitude-loss tolerance.")
with right:
    st.subheader("04 / Predict, then check")
    st.write("Keep τ fixed. Predict what happens when frequency increases from 0.1ωc to 10ωc.")
    with st.form("prediction"):
        amplitude_guess = st.radio("Output amplitude will…", ["Decrease", "Stay the same", "Increase"], index=None, horizontal=True)
        phase_guess = st.radio("Phase lag magnitude will…", ["Decrease", "Stay the same", "Increase"], index=None, horizontal=True)
        check = st.form_submit_button("Check my prediction", type="primary")
    if check:
        if amplitude_guess is None or phase_guess is None:
            st.warning("Choose both predictions, then check again.")
        else:
            if amplitude_guess == "Decrease" and phase_guess == "Increase":
                st.success("Correct: faster inputs are attenuated more and lag further behind.")
            else:
                st.info("Amplitude decreases and phase lag magnitude increases. Compare the values below.")
            low_m, low_p = response(tau, 0.1 * cutoff)
            high_m, high_p = response(tau, 10 * cutoff)
            st.write(f"0.1ωc: M = {low_m:.4f}, φ = {np.degrees(low_p):.2f}° → 10ωc: M = {high_m:.4f}, φ = {np.degrees(high_p):.2f}°.")
            st.caption("Try these frequencies with the controls, then double τ at a fixed ω and explain the change.")
