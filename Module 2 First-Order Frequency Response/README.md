# First-order frequency-response lab

A standalone Python learning module using Streamlit, NumPy, and Matplotlib.

## AI assistance

AI assisted with the Streamlit user interface, including the interactive controls, layout, plots, and presentation of results.

## Run

Use Python 3.11 or newer. From this folder:

```sh
python -m venv .venv
```

Activate with `.venv\Scripts\activate` on Windows or `source .venv/bin/activate` on Linux/macOS, then:

```sh
python -m pip install -r requirements.txt
python -m streamlit run app.py
```

Open the local URL printed by Streamlit. On Windows, `run.bat` also starts the app after dependencies are installed.

Type values directly into the τ, ω, and allowable amplitude-loss fields, then press Enter to apply them. τ accepts 0.1–5 seconds; ω accepts 0.01–20 rad/s.

The app uses a light theme with the theme-switching toolbar hidden. Keep `.streamlit/config.toml` when uploading, and launch from this folder so Streamlit loads it. Restart the server after changing configuration.

## Contents

- `model.py`: magnitude, phase, steady-state sinusoid calculations, and graph-building functions (`signal_plot` and `bode_plot`).
- `app.py`: interactive controls, numerical results, figure display, error calculator, and prediction activity.
- `test_model.py`: theoretical checks and Streamlit interaction tests.
- `screenshots/`: browser captures at cutoff, with increased time constant, and after checking a prediction.
- `capture_screenshots.py`: optional reproducible browser verification; requires `pip install playwright` and Google Chrome. Start the app on port 8501 first, then run this script.

## Theory and conventions

The model uses G(s) = K/(τs + 1) with K = 1 and a unit-amplitude sinusoidal input. τ is positive and measured in seconds; ω is measured in rad/s. Phase is calculated in radians and displayed in degrees.

M = 1/sqrt(1 + (ωτ)^2), φ = −atan(ωτ), and y(t) = M sin(ωt + φ). Plots show three steady-state cycles, with startup transients omitted. The negative phase represents lag.

At ωc = 1/τ, M = 1/√2, magnitude is −3.0103 dB, and phase is −45°. Increasing τ shifts the cutoff lower. At low frequency M approaches 1 and phase approaches 0°; at high frequency M approaches 0 and phase approaches −90°.

Relative amplitude error is δ = M − 1 (signed), with percent error 100δ. It excludes phase error. The optional tolerance calculator solves M ≥ 1 − tolerance/100 for the largest allowed frequency.

## Verify

```sh
python -m unittest -v
```

Tests cover DC, cutoff across multiple time constants, comparison with the complex transfer function over a frequency sweep, attenuation/phase monotonicity, waveforms, changed controls, and prediction feedback.

Upload this entire folder to your repository. It is self-contained; no existing project source or Git repository was available to integrate into. No Git commit or remote upload has been made, as requested.

UI reference: https://docs.streamlit.io/develop/api-reference/widgets/st.slider
