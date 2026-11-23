# MySystem — Micromouse Motor-Speed PID Design

## Selected Hardware

- ESP32-S3-DevKitC-1-N8R8
- Two GA12-N20 6 V, 500 RPM, 30:1 geared motors with Hall quadrature encoders
- TB6612FNG dual H-bridge motor driver
- Regulated 6 V motor supply
- Pololu 32 × 7 mm wheels (#1087)

## Nominal Plant

The page models each drive motor independently using the same initial first-order approximation:

$$
G(s) = \frac{K}{\tau s + 1}
= \frac{384}{0.12s + 1}
$$

The input is normalized PWM, $u = PWM/100$, and the output is gearbox-output speed in RPM. The nominal gain is therefore expressed in RPM per unit normalized PWM.

| Parameter | Value | Basis |
|---|---:|---|
| Rated motor voltage | 6 V | Selected motor specification |
| Gear ratio | 30:1 | Selected motor variant |
| No-load output speed | 500 RPM | Published motor listing |
| Maximum-efficiency speed | 384 RPM | Published operating point used as the nominal gain reference |
| Plant gain, $K$ | 384 RPM per unit PWM | Derived approximation |
| Time constant, $\tau$ | 0.12 s | Engineering estimate |
| Time-constant sensitivity range | 0.06–0.30 s | N20-class comparison range |

The 384 RPM operating point is not a measured, chassis-specific steady-state gain. The 0.12 s time constant is not published for the exact selected motor and has not been measured on this chassis. These values define the project's nominal simulation model; the page exposes the time-constant sensitivity range so the effect of parameter uncertainty can be examined.

### Comparative Step-Response Reference

The LGM12-N20 reference model is:

$$
G(z) = \frac{0.7826z^{-1}}{1 - 0.9300z^{-1}}
$$

For a sampling period of $T_s = 0.05\,\text{s}$, its discrete pole gives the equivalent continuous-time time constant:

$$
\tau = -\frac{T_s}{\ln(0.93)}
\approx 0.689\,\text{s}
$$

This result belongs to a high-reduction, mechanically loaded comparison rig. It is comparative reference material only and is not used as the selected GA12-N20 motor's time constant.

## Initial PI Gains

For a PI controller and the first-order plant, the closed-loop characteristic polynomial is:

$$
\tau s^2 + (1 + KK_p)s + KK_i = 0
$$

The initial gains use a target damping ratio of $\zeta = 0.70$ and a natural frequency of $\omega_n = 15\,\text{rad/s}$:

$$
K_p = \frac{2\zeta\tau\omega_n - 1}{K}
= 0.003958333333
$$

$$
K_i = \frac{\tau\omega_n^2}{K}
= 0.0703125
$$

$$
K_d = 0
$$

These are starting gains for the nominal linear model. The simulation includes the 0–100% PWM constraint and conditional anti-windup. Performance is calculated and reported separately for the left and right control loops.

## Firmware Assumptions

The generated sketch targets Arduino-ESP32 core 3.x and uses `ledcAttach` and `ledcWrite`. It assumes:

- A 10 ms control period.
- 20 kHz PWM frequency with 8-bit resolution.
- Hardware duty values from 0 to 255 corresponding to 0–100% normalized PWM.
- 7 PPR per motor-shaft revolution per encoder channel.
- A 30:1 gearbox and x4 quadrature decoding, giving an assumed 840 counts per gearbox-output revolution.
- Positive-direction speed control.

Confirm the encoder's actual PPR convention and GPIO wiring before uploading. The GPIO map is an example assignment for the selected ESP32-S3 board and must be checked against the assembled robot.

## Reference Material Recorded for This Design

- Abra Electronics and Precision Mini Drives GA12-N20 motor listings: 6 V, 500 RPM, 30:1 gearbox, and maximum-efficiency operating-point references.
- Canada Robotix N20 listing: armature-resistance and no-load-current comparison values.
- ACE-Lab / FHL-08 `system_one_control`: LGM12-N20 discrete step-response comparison.
- Industrial Monitor Direct N20 PI tuning guide: broad N20-class step-response range.
- Maxon DCX 12 L / A-max 12 data: 12 mm bare-motor comparison.

These references do not all describe the exact GA12-N20 unit selected for this project. They are used as supporting specifications or comparisons, not as interchangeable measurements. Confirm the supplier's exact datasheet and the assembled motor's encoder convention when the hardware is available.
