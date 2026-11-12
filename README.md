# Dynamic Characteristics Interactive Toolkit

An interactive toolkit for exploring the dynamic characteristics of first-order and second-order systems. The application combines mathematical models, interactive simulations, numerical methods, and visual experiments to help students understand how dynamic systems respond to different inputs and operating conditions.

**Course:** ENCS4380 – Interfacing Techniques  
**University:** Birzeit University  
**Instructor:** Dr. Wasel Ghanem  
**Release Date:** October 29, 2026  
**Submission Deadline:** November 12, 2026

**Live Application:** [Dynamic Characteristics Toolkit](https://amjad-adi.github.io/encs4380-dynamics-Remy/)  
**GitHub Repository:** [encs4380-dynamics-Remy](https://github.com/Amjad-Adi/encs4380-dynamics-Remy)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Interactive Modules](#interactive-modules)
  - [1. First-Order Time Response](#1-first-order-time-response)
  - [2. First-Order Frequency Response](#2-first-order-frequency-response)
  - [3. Second-Order System Response](#3-second-order-system-response)
  - [4. Guess the Sensor Challenge](#4-guess-the-sensor-challenge)
  - [5. Superposition Simulator](#5-superposition-simulator)
  - [6. Pole Explorer](#6-pole-explorer)
  - [7. Numerical ODE Solver](#7-numerical-ode-solver)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Validation and Reference Calculations](#validation-and-reference-calculations)
- [Team Contributions](#team-contributions)
- [Use of AI Tools](#use-of-ai-tools)
- [Educational Objectives](#educational-objectives)

---

## Project Overview

Dynamic systems are commonly described using differential equations and transfer functions. Understanding their behavior requires analyzing how they respond to different inputs, how their parameters affect their performance, and how their internal characteristics relate to their observable outputs.

This project provides an interactive learning environment where users can:

- Simulate the time-domain and frequency-domain responses of dynamic systems.
- Modify system parameters and observe their effects immediately.
- Explore first-order and second-order system behavior.
- Visualize poles and understand their relationship with stability and transient response.
- Combine multiple sinusoidal signals and analyze their response through a first-order sensor.
- Compare numerical solutions of differential equations with analytical solutions.
- Investigate system characteristics through interactive prediction and challenge activities.

The toolkit is designed to connect theoretical concepts with practical visualization and experimentation.

---

## Interactive Modules

### 1. First-Order Time Response

**Developed by:** Amjad Adi

This module explores the time-domain behavior of first-order systems using step and ramp inputs.

The general first-order transfer function is:

$$
G(s) = \frac{K}{\tau s + 1}
$$

Where:

- \(K\) is the system's static gain.
- \(\tau\) is the time constant.
- \(s\) is the Laplace variable.

**Features:**

- Interactive step and ramp input simulations.
- Adjustable system gain and time constant.
- Visualization of input and output signals.
- Identification of characteristic response points.
- Analysis of the time constant and settling behavior.
- Examination of ramp tracking lag and steady-state error.
- Logarithmic visualization of the remaining response error.

For a step input with amplitude \(A\), the output is:

$$
y(t) = KA\left(1-e^{-t/\tau}\right)
$$

At one time constant:

$$
y(\tau) \approx 0.632KA
$$

At three time constants:

$$
y(3\tau) \approx 0.950KA
$$

These characteristic points help illustrate how quickly a first-order system approaches its steady-state value.

### 2. First-Order Frequency Response

**Developed by:** Yazeed

This module investigates how a first-order system responds to sinusoidal inputs at different frequencies.

For the transfer function:

$$
G(s) = \frac{K}{\tau s + 1}
$$

The magnitude ratio is:

$$
M(\omega) = \frac{K}{\sqrt{1+(\omega\tau)^2}}
$$

The phase response is:

$$
\phi(\omega) = -\tan^{-1}(\omega\tau)
$$

For a normalized gain of \(K=1\), the magnitude ratio becomes:

$$
M(\omega) = \frac{1}{\sqrt{1+(\omega\tau)^2}}
$$

**Features:**

- Interactive sinusoidal input and output visualization.
- Adjustable input frequency and system time constant.
- Amplitude attenuation analysis.
- Phase lag visualization.
- Bode magnitude and phase plots.
- Identification of the cutoff frequency.
- Analysis of dynamic measurement error.

The cutoff frequency is:

$$
\omega_c = \frac{1}{\tau}
$$

The normalized dynamic error is:

$$
\delta = M(\omega)-1
$$

The module demonstrates how increasing input frequency affects the amplitude and phase of a first-order system's output.

### 3. Second-Order System Response

**Developed by:** Hanan

This module explores the transient behavior of second-order systems and the relationship between system parameters, damping, and response characteristics.

The general second-order transfer function is:

$$
G(s) =
\frac{K\omega_n^2}
{s^2+2\zeta\omega_n s+\omega_n^2}
$$

Where:

- \(K\) is the static gain.
- \(\omega_n\) is the natural frequency.
- \(\zeta\) is the damping ratio.

**Features:**

- Interactive adjustment of damping ratio and natural frequency.
- Visualization of underdamped, critically damped, and overdamped responses.
- Analysis of rise time, peak time, overshoot, and settling time.
- Pole visualization in the complex plane.
- Mass-spring-damper system modeling.
- State-space representation and visualization.
- Interactive adjustment of mass, damping coefficient, and spring stiffness.
- Eigenvalue calculations.
- Phase-plane visualization.

For an underdamped system, the overshoot percentage is:

$$
\%OS =
100e^{-\frac{\zeta\pi}{\sqrt{1-\zeta^2}}}
$$

The damped natural frequency is:

$$
\omega_d = \omega_n\sqrt{1-\zeta^2}
$$

The peak time is:

$$
T_p = \frac{\pi}{\omega_d}
$$

For a standard second-order system, the approximate 2% settling time is:

$$
T_s \approx \frac{4}{\zeta\omega_n}
$$

The module also demonstrates how the mass-spring-damper parameters determine the system's dynamic response.

### 4. Guess the Sensor Challenge

**Developed by:** Rahaf

This module provides an interactive challenge in which users investigate an unknown dynamic sensor by analyzing its response to an input signal.

The user is presented with a simulated sensor response and must estimate the underlying system characteristics.

**Features:**

- Randomly generated first-order and second-order sensor models.
- Simulated sensor measurements with noise.
- Estimation of first-order time constants.
- Estimation of second-order parameters using response characteristics.
- Comparison between actual and estimated parameters.
- Visualization of actual and estimated responses.
- Interactive scoring system.
- Hints and new-sensor challenges.

The challenge encourages users to apply theoretical concepts to identify unknown system behavior from measured responses.

### 5. Superposition Simulator

**Developed by:** Yazeed

This module demonstrates how multiple sinusoidal signals combine through the principle of superposition and how a first-order sensor affects the resulting signal.

Users can construct a composite signal by dynamically adding and removing sinusoidal components.

Each component is described by:

$$
x_i(t) = A_i\sin(\omega_i t+\phi_i)
$$

The combined input signal is:

$$
x(t) = \sum_{i=1}^{N} A_i\sin(\omega_i t+\phi_i)
$$

Where:

- \(A_i\) is the amplitude of component \(i\).
- \(\omega_i\) is its angular frequency.
- \(\phi_i\) is its phase.
- \(N\) is the number of sinusoidal components.

The combined signal is passed through a first-order sensor described by:

$$
\tau\frac{dy(t)}{dt}+y(t)=Kx(t)
$$

**Features:**

- Dynamically add and remove sinusoidal components.
- Independently configure each component's amplitude, frequency, and phase.
- Visualize individual sinusoidal components.
- Visualize the combined input signal.
- Visualize the first-order sensor output.
- Adjust sensor gain and time constant.
- Analyze the attenuation and phase lag of individual frequency components.
- Interactive prediction exercise.

For each sinusoidal component, the sensor's magnitude ratio is:

$$
M_i = \frac{K}{\sqrt{1+(\omega_i\tau)^2}}
$$

Its phase lag is:

$$
\phi_{sensor,i} = -\tan^{-1}(\omega_i\tau)
$$

Therefore, the steady-state output contribution of each component is:

$$
y_i(t) =
A_iM_i
\sin\left(\omega_i t+\phi_i+\phi_{sensor,i}\right)
$$

The overall steady-state output is the sum of the individual output components:

$$
y(t) = \sum_{i=1}^{N} y_i(t)
$$

This demonstrates how a first-order sensor attenuates and delays different frequency components by different amounts.

### 6. Pole Explorer

**Developed by:** Amjad Adi

This module provides an interactive environment for exploring the relationship between pole locations, system stability, and transient response.

Users can manipulate poles in the complex \(s\)-plane and observe how their positions affect the system's characteristics.

For a standard second-order system, the poles are:

$$
s_{1,2} =
-\zeta\omega_n
\pm j\omega_n\sqrt{1-\zeta^2}
$$

Where:

- \(\zeta\) is the damping ratio.
- \(\omega_n\) is the natural frequency.
- \(j\) is the imaginary unit.

**Features:**

- Interactive complex \(s\)-plane visualization.
- Drag-and-drop pole manipulation.
- Support for first-order and second-order systems.
- Visualization of real and complex poles.
- Calculation of damping ratio and natural frequency.
- Analysis of overshoot, peak time, and settling time.
- Classification of underdamped, critically damped, and overdamped systems.
- Stable and unstable system identification.
- Dynamic step-response updates.
- Interactive learning activity.

For a complex conjugate pole pair:

$$
s_{1,2} = \sigma \pm j\omega_d
$$

The natural frequency is:

$$
\omega_n = \sqrt{\sigma^2+\omega_d^2}
$$

The damping ratio is:

$$
\zeta = \frac{-\sigma}{\omega_n}
$$

The module illustrates that pole locations determine important characteristics of a system's dynamic behavior and stability.

### 7. Numerical ODE Solver

**Developed by:** Rahaf

This module demonstrates how ordinary differential equations can be solved numerically and compares numerical approximations with analytical solutions.

The module uses a first-order sensor model:

$$
\frac{dy(t)}{dt} = \frac{Kx(t)-y(t)}{\tau}
$$

For a step input of amplitude \(A\), the analytical solution is:

$$
y(t) = KA\left(1-e^{-t/\tau}\right)
$$

**Features:**

- Numerical solution using Euler's method.
- Numerical solution using the fourth-order Runge-Kutta method (RK4).
- Adjustable integration time step.
- Adjustable sensor gain and time constant.
- Adjustable step-input amplitude.
- Comparison between numerical and analytical solutions.
- Visualization of numerical approximation errors.
- Interactive prediction exercise.

Euler's method approximates the solution using:

$$
y_{n+1} = y_n + h f(t_n,y_n)
$$

Where \(h\) is the integration time step.

For the fourth-order Runge-Kutta method:

$$
k_1 = f(t_n,y_n)
$$

$$
k_2 = f\left(t_n+\frac{h}{2},y_n+\frac{hk_1}{2}\right)
$$

$$
k_3 = f\left(t_n+\frac{h}{2},y_n+\frac{hk_2}{2}\right)
$$

$$
k_4 = f(t_n+h,y_n+hk_3)
$$

The next value is calculated using:

$$
y_{n+1} =
y_n+\frac{h}{6}(k_1+2k_2+2k_3+k_4)
$$

The module allows users to investigate how the integration method and time-step size affect numerical accuracy.

---

## Technology Stack

The application is built using a modern React and TypeScript frontend architecture.

| Technology | Purpose |
|---|---|
| HTML5 | Application entry point and document structure |
| React | Component-based user interface |
| TypeScript | Static typing and maintainable application logic |
| Vite | Development server and production build tooling |
| Tailwind CSS 4 | Utility-first styling and responsive layouts |
| CSS | Global styles and application-wide design foundations |
| Base UI | Accessible, unstyled UI primitives |
| shadcn-style components | Reusable and customizable interface components |
| Plotly | Interactive plots and data visualization |
| KaTeX | Mathematical equation rendering |
| React Router | Client-side navigation between modules |
| Lucide React | Interface icons |
| React Icons | Additional icon resources |

Dependencies and their versions are managed through `package.json`.

---

## Project Architecture

The project follows a modular React architecture. Each interactive module maintains its own domain logic and interface while reusing shared components and application-level functionality.

The main design principles are:

- **Modularity:** Each module is organized around a specific dynamic-system concept.
- **Separation of concerns:** Mathematical calculations and domain-specific logic are kept separate from reusable interface components.
- **Reusability:** Shared components and utilities are used where appropriate.
- **Type safety:** TypeScript provides explicit types for application data and functions.
- **Consistency:** Modules follow common interface and interaction conventions.
- **Responsive design:** The application supports desktop and mobile screen sizes.

The application provides separate routes for the interactive modules:

| Route | Module |
|---|---|
| `/time-response` | First-Order Time Response |
| `/frequency-response` | First-Order Frequency Response |
| `/second-order` | Second-Order System Response |
| `/sensor-challenge` | Guess the Sensor Challenge |
| `/superposition` | Superposition Simulator |
| `/pole-explorer` | Pole Explorer |
| `/numerical-ode` | Numerical ODE Solver |

The root route (`/`) serves as the application landing page.

---

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/Amjad-Adi/encs4380-dynamics-Remy.git
```

Navigate to the project directory:

```bash
cd encs4380-dynamics-Remy
```

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

### Production Build

Run the production build:

```bash
npm run build
```

This runs the configured TypeScript project checks and creates the production build using Vite.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

## Validation and Reference Calculations

The following reference calculations provide useful checks for verifying the mathematical behavior of the toolkit.

| # | Test case | Expected result |
|---|---|---|
| 1 | First-order step response at \(t=\tau\) | \(y(\tau)\approx0.632KA\) |
| 2 | First-order step response at \(t=3\tau\) | \(y(3\tau)\approx0.950KA\) |
| 3 | \(\tau=0.2\,s\), \(\omega=2\,rad/s\), normalized gain | \(M\approx0.93\), phase lag \(\approx21.8^\circ\) |
| 4 | Maximum time constant for a 100 Hz input with 5% normalized amplitude error | \(\tau_{max}\approx0.52\,ms\) |
| 5 | Phase lag at 50 Hz using the maximum time constant above | \(\approx9.3^\circ\) |
| 6 | Second-order system with \(\zeta=0.5\) | Overshoot \(\approx16.3\%\) |
| 7 | Second-order system with \(\zeta=1\) | No overshoot |
| 8 | Mass-spring-damper system with \(m=1\), \(b=2\), \(k=4\) | Eigenvalues \(=-1\pm j1.732\) |

These values are reference checks for the corresponding theoretical models and are useful when evaluating simulation results.

---

## Team Contributions

| Team member | Main contributions |
|---|---|
| Amjad Adi | First-Order Time Response; Pole Explorer |
| Yazeed | First-Order Frequency Response; Superposition Simulator |
| Hanan | Second-Order System Response; README documentation and project finalization |
| Rahaf | Guess the Sensor Challenge; Numerical ODE Solver |

Each team member contributed to the development and integration of the application, with responsibilities distributed across the interactive modules and project documentation.

---

## Use of AI Tools

AI tools were used as development assistants for selected tasks, including mathematical clarification, implementation support, debugging, code review, and documentation. The team remained responsible for reviewing generated suggestions, validating calculations, testing the application, and integrating the final implementation.

### Amjad Adi

**Tool:** ChatGPT (GPT-6)

AI assistance was used during the development of the First-Order Time Response and Pole Explorer modules.

For the First-Order Time Response module, AI assistance included:

- Clarifying first-order system equations and response characteristics.
- Understanding step and ramp responses.
- Planning the visualization of characteristic response points.
- Supporting implementation using React, TypeScript, Plotly, and KaTeX.
- Reviewing implementation approaches and debugging issues.

For the Pole Explorer module, AI assistance supported mathematical reasoning and implementation planning related to pole locations, damping ratio, natural frequency, stability, and transient-response characteristics.

Generated suggestions were reviewed, and mathematical results and application behavior were checked during development.

### Yazeed

**Tool:** Claude Opus

AI assistance was used during the development of the First-Order Frequency Response and Superposition Simulator modules.

For the First-Order Frequency Response module, AI assistance was used to develop the user interface from the provided Python backend logic, including controls, layouts, graphs, and result presentation. This also supported learning how backend calculations could be represented through an interactive interface.

For the Superposition Simulator, AI assistance supported the implementation of the interactive signal-combination interface and the visualization of the combined input and first-order sensor output.

The resulting implementation was reviewed and integrated as part of the project.

### Hanan

**Tools:** ChatGPT (GPT-6) and an AI coding assistant in WebStorm

AI assistance was used during the development of the Second-Order System Response module and project documentation.

For the Second-Order System Response module, AI assistance included:

- Planning module requirements and implementation structure.
- Clarifying second-order system equations and damping behavior.
- Supporting transient-response calculations and visualizations.
- Assisting with Plotly-based visualizations.
- Supporting the mass-spring-damper state-space representation.
- Reviewing numerical calculations and eigenvalue results.
- Debugging and improving the implementation.

The implementation was reviewed and tested, with reference calculations used to verify important results.

### Rahaf

**Tools:** ChatGPT (GPT-6) and GitHub Copilot

AI assistance was used during the development of the Guess the Sensor Challenge and Numerical ODE Solver modules.

For the Guess the Sensor Challenge, AI assistance supported implementation planning, interface development, debugging, and integration of the sensor-estimation challenge.

For the Numerical ODE Solver, an AI coding assistant supported planning, implementation, code review, debugging, and verification of the numerical-solution functionality.

Generated code and suggestions were reviewed, and the application was run and tested locally before integration.

---

## Educational Objectives

The toolkit is intended to help students connect mathematical models with observable system behavior.

After using the application, students should be able to:

1. Explain the time-domain response of first-order systems.
2. Interpret the effect of a time constant on system response.
3. Understand amplitude attenuation and phase lag in frequency-domain analysis.
4. Distinguish between underdamped, critically damped, and overdamped second-order systems.
5. Relate pole locations to stability and transient-response characteristics.
6. Apply the principle of superposition to sinusoidal signals.
7. Understand how a first-order sensor affects different frequency components.
8. Compare numerical ODE solutions with analytical solutions.
9. Investigate how numerical integration methods and time-step sizes affect accuracy.
10. Apply system-identification concepts to estimate unknown sensor characteristics.

---

**Birzeit University — ENCS4380 Interfacing Techniques — 2026**
