# ENCS4380 Homework 1: Dynamic Characteristics Interactive Toolkit

An interactive engineering toolkit for studying the dynamic characteristics of measurement systems through mathematical modeling, real-time simulation, and visual analysis.

**Course:** ENCS4380 – Interfacing Techniques  
**University:** Birzeit University  
**Instructor:** Dr. Wasel Ghanem  
**Released:** Thursday, 29 October 2026  
**Due:** Thursday, 12 November 2026

## Live Application

**[Launch the Dynamic Characteristics Toolkit](https://amjad-adi.github.io/encs4380-dynamics-Remy/)**

**Source Code:** [GitHub Repository](https://github.com/Amjad-Adi/encs4380-dynamics-Remy)

---

## Team and Contributions

The project is developed collaboratively, with each team member responsible for a dedicated module and its integration into the overall toolkit.

| Team Member | Module   | Responsibility                 |
| ----------- | -------- | ------------------------------ |
| Amjad Adi   | Module 1 | First-Order Time Response      |
| Yazeed      | Module 2 | First-Order Frequency Response |
| Hanan       | Module 3 | Second-Order System Response   |
| Rahaf       | Module 4 | Guess the Sensor Challenge     |

---

## Project Modules

The application is organized into four interconnected modules, progressing from fundamental first-order system behavior to second-order dynamics and practical sensor identification. It also includes the standalone Bonus Numerical ODE Solver described below.

### Module 1 - First-Order Time Response

**Developer: Amjad Adi**

An interactive investigation of first-order measurement systems in the time domain, based on the transfer function:

$$
G(s) = \frac{K}{\tau s + 1}
$$

The module provides adjustable gain and time-constant parameters, with selectable step and ramp inputs. Its visualizations connect the mathematical model to the transient and steady-state behavior of a measurement system.

**Implemented features:**

- Interactive first-order step-response simulation.
- Dynamic visualization of the 63.2% response point at \(t=\tau\) and the 95% response point at \(t=3\tau\).
- Ramp-response simulation with ideal and actual output comparison.
- Calculation and visualization of ramp tracking lag and steady-state error.
- Logarithmic error-fraction analysis demonstrating the relationship between response decay and the time constant.
- Interactive parameter controls and dynamically updated plots.

**Screenshots**

![Module 1 – Screenshot 1](screenshots/screenshot1-1.png)

![Module 1 – Screenshot 2](screenshots/screenshot1-2.png)

![Module 1 – Screenshot 3](screenshots/screenshot1-3.png)

![Module 1 – Screenshot 4](screenshots/screenshot1-4.png)

![Module 1 – Screenshot 5](screenshots/screenshot1-5.png)

![Module 1 – Screenshot 6](screenshots/screenshot1-6.png)

![Module 1 – Screenshot 7](screenshots/screenshot1-7.png)

![Module 1 – Screenshot 8](screenshots/screenshot1-8.png)

![Module 1 – Screenshot 9](screenshots/screenshot1-9.png)

![Module 1 – Screenshot 10](screenshots/screenshot1-10.jpg)

![Module 1 – Screenshot 11](screenshots/screenshot1-11.jpg)

### Module 2 - First-Order Frequency Response

**Developer: Yazeed**

An interactive analysis of first-order measurement systems in the frequency domain, examining how a sensor responds to sinusoidal inputs across different operating frequencies.

The module connects the frequency-domain transfer function to observable changes in output amplitude and phase:

$$
M = \frac{1}{\sqrt{1+(\omega\tau)^2}}
$$

$$
\phi = -\tan^{-1}(\omega\tau)
$$

**Implemented features:**

- Interactive sinusoidal input and output visualization.
- Real-time amplitude-ratio and phase-lag calculations.
- Frequency-response analysis with adjustable time constant and input frequency.
- Bode magnitude and phase plots.
- Cutoff-frequency identification at \(\omega_c=1/\tau\).
- Dynamic-error calculation using \(\delta=M-1\).
- Parameter-dependent visualizations and numerical results.

**Screenshots**

![Module 2 – Screenshot 1](screenshots/2-1.png)

![Module 2 – Screenshot 2](screenshots/2-2.png)

![Module 2 – Screenshot 3](screenshots/2-3.png)

![Module 2 – Screenshot 4](screenshots/2-4.png)

![Module 2 – Screenshot 5](screenshots/2-5.png)

![Module 2 – Screenshot 6](screenshots/2-6.png)



### Module 3 - Second-Order System Response

**Developer: Hanan**

An interactive study of second-order measurement systems, focusing on the influence of damping ratio and natural frequency on transient response.

The module brings together time-domain response analysis and pole-based system interpretation, using the standard second-order transfer function:

$$
G(s)=\frac{K\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}
$$

**Implemented features:**

- Interactive underdamped, critically damped, and overdamped response simulations.
- Adjustable damping ratio and natural frequency.
- Live rise-time, peak-time, percentage-overshoot, and settling-time measurements.
- Pole visualization in the complex s-plane.
- Mass-spring-damper state-space representation.
- Live state-space matrix updates based on mass, damping, and stiffness.
- Eigenvalue calculations and comparison with the system poles.
- Phase-plane visualization of displacement and velocity trajectories.

**Screenshots**
![Module 3 – Screenshot 1](screenshots/1.png)

![Module 3 – Screenshot 2](screenshots/2.png)

![Module 3 – Screenshot 3](screenshots/3.png)

![Module 3 – Screenshot 4](screenshots/4.png)

![Module 3 – Screenshot 5](screenshots/5.png)

![Module 3 – Screenshot 6](screenshots/6.png)



### Module 4 - Guess the Sensor Challenge

**Developer: Rahaf**

An interactive parameter-estimation challenge that puts the concepts from the preceding modules into practice. Users investigate an unknown sensor response and estimate its underlying dynamic parameters from the observed behavior.

**Implemented features:**

- Random generation of first-order and second-order sensor models.
- Noisy response visualization.
- Parameter estimation using response characteristics.
- First-order estimation through the time constant and error-decay behavior.
- Second-order estimation through overshoot and peak time.
- Comparison of estimated and actual system responses.
- Parameter-recovery scoring and session score tracking.
- New-sensor generation and contextual hints.

**Screenshots**
![Module 4 – Screenshot 2](screenshots/4-1.png)

![Module 4 – Screenshot 3](screenshots/4-2.png)

![Module 4 – Screenshot 4](screenshots/4-3.png)



### Bonus — Numerical ODE Solver

The standalone Bonus tool compares numerical integration of a first-order system with its analytical step response. For a system with transfer function

$$
G(s)=\frac{K}{\tau s+1}
$$

and a step input of amplitude \(A\), the zero-initial-condition model is

$$
\tau\frac{dy}{dt}+y=KA,\qquad y(0)=0
$$

Its analytical response, used as the reference for the numerical errors, is

$$
y(t)=KA\left(1-e^{-t/\tau}\right)
$$

The live experiment integrates the differential equation from \(t=0\), displaying the analytical response and both numerical approximations at shared time points:

- **Euler's method** advances the output by
  
$$
y_{n+1} = y_n + \Delta t \cdot f(t_n, y_n)
$$

where

$$
f(t,y) = \frac{KA-y}{\tau}
$$
- **Fourth-order Runge–Kutta (RK4)** combines four derivative evaluations per step (at the start, two midpoint estimates, and the end) in a weighted average. It is generally more accurate than Euler for the tested step sizes.

The controls adjust:

| Parameter | Meaning |
|---|---|
| $K$ | System gain |
| $\tau$ | System time constant, in seconds |
| $A$ | Step-input amplitude |
| $\Delta t$ | Integration step size, in seconds; the final step is shortened if needed to end exactly at the simulation duration |
| Simulation duration | End time of the integration, in seconds |

Error metrics compare each numerical result with the analytical response at every shared sampled time:

- **Maximum absolute error:** the largest absolute difference across the sampled points.
- **Root mean square error (RMSE):** the square root of the mean of squared differences across the sampled points.
- **Final-time absolute error:** the absolute difference at the simulation endpoint.

Euler stability is classified using \(r=\Delta t/\tau\) and its amplification factor \(1-r\): \(0<r\leq1\) is stable without alternating error; \(1<r<2\) is stable with damped oscillation; \(r=2\) is marginally stable with persistent alternating error; and \(r>2\) is unstable, with errors growing from step to step. These classifications describe Euler stability, not the size of ordinary approximation error.

**Screenshots**

The following captures show the running local application: parameter controls, the comparison chart, error metrics, the prediction exercise, and a narrow-screen layout.

![Bonus Numerical ODE Solver — parameter controls](screenshots/bonus-numerical-ode-controls.png)

![Bonus Numerical ODE Solver — comparison chart](screenshots/bonus-numerical-ode-comparison.png)

![Bonus Numerical ODE Solver — error metrics](screenshots/bonus-numerical-ode-errors.png)

![Bonus Numerical ODE Solver — prediction exercise](screenshots/bonus-numerical-ode-prediction.png)

![Bonus Numerical ODE Solver — mobile layout](screenshots/bonus-numerical-ode-mobile.png)

To run the Bonus tool locally, start the Vite development server and open `/numerical-ode`:

```bash
npm run dev
```

To check the TypeScript project and produce a production build:

```bash
npm run build
```

There is no dedicated automated test script configured in `package.json`; the build is the repository's available automated project check.


---

## Teaching Approach - Predict, Then Check

The toolkit is designed around active exploration. Rather than presenting system responses as static results, it encourages students to form predictions, manipulate system parameters, and compare their expectations with the resulting mathematical calculations and visualizations.

The following prompts connect the theoretical concepts to the interactive experiments:

1. **Time constant:** Predict the percentage of the final value reached by a first-order system after one time constant. Verify the 63.2% response point.
2. **Settling behavior:** Predict the percentage of the final value reached after three time constants. Compare your prediction with the 95% response marker.
3. **Response speed:** Double the time constant while keeping the gain unchanged. Predict how the step response changes.
4. **Ramp tracking:** Predict whether a first-order system can perfectly track a ramp input and determine its steady-state tracking error.
5. **Time lag:** Increase the time constant and predict how the equivalent time lag changes.
6. **Amplitude response:** For \(\tau=0.2\,s\) and an input frequency of \(2\,rad/s\), predict the output-to-input amplitude ratio.
7. **Phase response:** Under the same conditions, predict the phase lag between the input and output.
8. **Cutoff frequency:** Predict how the cutoff frequency changes when the time constant increases.
9. **Damping behavior:** Reduce the damping ratio below one. Predict the resulting overshoot and oscillatory behavior.
10. **Sensor identification:** Given an unknown response curve, identify the characteristics that distinguish first-order from second-order system behavior.

---

## Technology Stack

The toolkit uses a modular React architecture, combining mathematical computation, interactive visualization, and reusable interface components.

| Technology                 | Purpose                                 |
| -------------------------- | --------------------------------------- |
| React                      | Component-based user interface          |
| TypeScript                 | Type-safe application logic             |
| Vite                       | Development server and production build |
| Tailwind CSS               | Responsive styling and design system    |
| shadcn-style components    | Consistent, reusable interface elements |
| Plotly                     | Interactive engineering visualizations  |
| KaTeX                      | Mathematical equation rendering         |
| React Router               | Client-side navigation                  |
| Lucide React / React Icons | Interface iconography                   |

## Architecture and Development

The application follows a consistent frontend architecture across all four modules. Shared interface components, navigation, styling conventions, and visualization patterns provide a unified experience, while each module maintains its own domain-specific calculations and interactions.

Module 1 established the initial interactive structure and visual conventions. Module 2 was originally developed in Python and was later reimplemented using React and TypeScript to integrate it into the web application. This transition ensured a consistent frontend architecture and user experience across the toolkit. Modules 3 and 4 further extend the application with second-order system analysis and practical sensor parameter estimation.

The implementation emphasizes:

- Separation of module-specific logic and shared interface components.
- Reusable interactive controls and visualization patterns.
- Responsive layouts for desktop and mobile devices.
- Mathematical consistency with the course lecture material.
- Immediate visual feedback when parameters change.

---

## AI-Assisted Development

AI coding assistants were used as development tools throughout the project. Their role was to support technical reasoning, implementation, code review, and interface refinement. All team members remain responsible for understanding and explaining their respective implementations.

### Amjad Adi - Module 1

**AI tool:** ChatGPT (GPT-6)

**What I asked:**

I used ChatGPT throughout the development of Module 1 to support the implementation of the first-order time-response model, its interactive controls, mathematical calculations, and visualizations.

I provided the technical requirements and explicitly specified the frontend technologies and libraries to be used, including React, TypeScript, Tailwind CSS, Plotly, and KaTeX. I also guided the component architecture and implementation structure to ensure consistency with the intended application design.

My prompts covered:

- Translating the first-order differential equation and transfer function into interactive response calculations.
- Implementing step and ramp response models.
- Calculating and displaying characteristic response points.
- Deriving and visualizing ramp tracking lag and steady-state error.
- Implementing the logarithmic error-fraction plot and interpreting its slope.
- Reviewing React component structure, mathematical presentation, and responsive layouts.
- Refining the interface to improve clarity and usability.

**What I learned:**

- How the time constant governs the transient behavior of a first-order measurement system.
- How to connect analytical response equations to interactive visualizations.
- How logarithmic error analysis reveals the exponential decay rate.
- How to organize an engineering visualization application using reusable React components.
- How to integrate Plotly and KaTeX into a TypeScript-based frontend.

**How I used it:**

I directed the implementation by defining the required libraries, frontend structure, mathematical behavior, and presentation requirements. My frontend development knowledge allowed me to evaluate the generated code critically, assess component composition and styling decisions, identify unsuitable suggestions, and request targeted revisions.

I used the AI-generated assistance selectively, reviewing and adapting the resulting implementation rather than accepting suggestions without evaluation. I also checked the implemented calculations against the mathematical relationships and validation values specified in the assignment.

### Yazeed - Module 2

**AI tool:** Claude Opus

**What I asked:** I provided it with the backend code in python and it develop the needed UI for it. 

**What I learned:** It used a known UI lib streamlit in python. I have been able to see and understand how the backend could be translated into UI graphs. 

**How I used it:** AI assisted with the Streamlit user interface, including the interactive controls, layout, plots, and presentation of results.

### Hanan — Module 3

**AI tool:** ChatGPT (GPT-6) and an AI coding assistant integrated into WebStorm

**What I asked:** I used AI assistance throughout the development of Module 3. I provided the project requirements and asked for help planning the implementation, following the existing Module 1 and Module 2 architecture, and organizing the code into domain logic, controls, pages, and charts.

I also requested assistance with:

Implementing second-order system equations, damping regimes, step responses, response metrics, poles, and state-space calculations.

Designing interactive visualizations for step response, the complex s-plane, and phase-plane trajectories using Plotly.

Connecting physical parameters (mass, damping, and stiffness) to live calculations and visualizations.

Implementing a "Predict, then check" interactive exercise.

Reviewing the implementation against the assignment requirements, identifying missing features, and fixing issues.

Testing numerical accuracy, validating eigenvalues against transfer-function poles, and checking the production build.

**What I learned:** I improved my understanding of second-order dynamic systems, including the relationship between mass, damping, stiffness, natural frequency, and damping ratio. I learned how underdamped, critically damped, overdamped, and undamped systems behave differently.

I also gained practical knowledge of calculating step-response characteristics such as rise time, peak time, percentage overshoot, and settling time. Additionally, I strengthened my understanding of transfer-function poles, state-space representation, eigenvalues, and phase-plane trajectories.

From the software engineering perspective, I learned how to structure a React and TypeScript feature, separate domain calculations from UI components, connect state to interactive charts, validate numerical results, and integrate a new module into an existing application.

**How I used it:** I used AI as a development and review assistant while remaining involved in the implementation decisions and testing process.

I first used it to break the requirements into manageable implementation phases and establish a structure consistent with the existing modules. I then used an AI coding assistant to help implement the domain calculations, interactive controls, charts, state-space analysis, and prediction exercise.

After implementation, I reviewed the generated code and used AI assistance to identify and fix issues found during the requirements audit. I also tested the application by changing the physical parameters and observing how the response curves, damping regime, metrics, and pole locations changed.

Finally, I verified the numerical benchmark results, checked the prediction interaction, ran the TypeScript and production build checks, and used Git to commit and push the completed changes.

### Rahaf — Module 4: Sensor Challenge

**AI tool:**
ChatGPT (GPT-6) and GitHub Copilot.

**What I asked:**
I used ChatGPT to understand the Module 4 requirements, plan the implementation, and prepare technical prompts for GitHub Copilot. I asked for assistance with designing the sensor identification challenge, generating hidden first-order and second-order sensor parameters, adding measurement noise, calculating parameter estimates, and implementing the scoring and feedback system. I also used AI assistance to troubleshoot TypeScript build errors and integrate the module into the existing project structure.

**What I learned:**
I learned how to identify first-order system parameters using the 63.2% response method and how to estimate second-order system parameters using percentage overshoot and peak time. I also improved my understanding of noisy sensor measurements, parameter estimation, error calculation, and comparing estimated values with actual system parameters. Additionally, I learned about React component integration, TypeScript error handling, and Git workflows.

**How I used it:**
I used AI assistance to plan and implement the Sensor Challenge module within the existing React and TypeScript project. GitHub Copilot helped generate the implementation, including random sensor generation, noisy response visualization, parameter input fields, answer validation, accuracy calculations, hints, and score tracking. ChatGPT helped review the implementation process, resolve integration issues, and guide the build and testing steps. I then ran the project locally and successfully completed the production build.

### Bonus Numerical ODE Solver

An AI coding assistant supported the development process for this standalone feature through planning, implementation assistance, code review, debugging, and verification. This included help examining the feature requirements and integration points, reasoning about and implementing the user-interface code, reviewing the changes, investigating issues, and checking numerical behavior, routes, and the production build. AI assistance contributed to code and technical decisions; it is not represented as work independently written by the student. The project team remains responsible for reviewing, understanding, and validating the submitted work.

## Validation

The toolkit is evaluated against the numerical validation cases supplied in the homework specification.

| # | Validation case | Expected result |
|---|---|---|
| 1 | First-order step response at $t = \tau$ | $y(\tau) = 0.632KA$ |
| 2 | First-order step response at $t = 3\tau$ | $y(3\tau) = 0.95KA$ |
| 3 | Frequency response, $\tau = 0.2\,s$, $\omega = 2\,rad/s$ | $M \approx 0.93$, phase lag $\approx 21.8^\circ$ |
| 4 | Maximum time constant for 100 Hz signals with 5% dynamic error | $\tau_{\max} \approx 0.52\,ms$ |
| 5 | Phase lag at 50 Hz using the maximum time constant | $\approx 9.3^\circ$ |
| 6 | Second-order response with $\zeta = 0.5$ | Overshoot $\approx 16.3\%$ |
| 7 | Second-order response with $\zeta = 1$ | No overshoot |
| 8 | State-space model, $m = 1,\ b = 2,\ k = 4$ | Eigenvalues $-1 \pm j1.732$, matching the poles |

The validation results are presented within the relevant modules, allowing users to compare expected values with the application's calculated results.

---

## GitHub Contributions

**Repository:** [encs4380-dynamics-Remy](https://github.com/Amjad-Adi/encs4380-dynamics-Remy)

The project is maintained in a shared public repository. Each member contributes through their own GitHub account, maintaining a traceable development history.

| Team Member | GitHub Username | Contribution History |
|---|---|---|
| Hanan | [7enno](https://github.com/7enno) | [View Commits](https://github.com/Amjad-Adi/encs4380-dynamics-Remy/commits/main/?author=7enno) |
| Amjad Adi | [Amjad-Adi](https://github.com/Amjad-Adi) | [View Commits](https://github.com/Amjad-Adi/encs4380-dynamics-Remy/commits/main/?author=Amjad-Adi) |
| Rahaf | [rahafalqam](https://github.com/rahafalqam) | [View Commits](https://github.com/Amjad-Adi/encs4380-dynamics-Remy/commits/main/?author=rahafalqam) |
| Yazeed | [yazeedalhaddad](https://github.com/yazeedalhaddad) | [View Commits](https://github.com/Amjad-Adi/encs4380-dynamics-Remy/commits/main/?author=yazeedalhaddad) |


Each module is tracked through a dedicated GitHub Issue assigned to its responsible member. Commits document implementation, refinements, bug fixes, and integration work.

## Screenshots

The project screenshots are maintained in the repository's `screenshots/` directory.

```text
screenshots/
├── module-1-step-response.png
├── module-1-ramp-response.png
├── module-1-error-analysis.png
├── module-2-frequency-response.png
├── module-2-bode-analysis.png
├── module-2-dynamic-error.png
├── module-3-main.png
├── module-3-state-space.png
├── module-4-challenge.png
├── module-4-results.png
├── bonus-numerical-ode-controls.png
├── bonus-numerical-ode-comparison.png
├── bonus-numerical-ode-errors.png
├── bonus-numerical-ode-prediction.png
└── bonus-numerical-ode-mobile.png
```

The screenshots above are referenced directly in the corresponding module sections.

---

## Running Locally

```bash
git clone https://github.com/Amjad-Adi/encs4380-dynamics-Remy.git

cd encs4380-dynamics-Remy

npm install

npm run dev
```

To generate a production build:

```bash
npm run build
```

## Deployment

The application is deployed as a static website through GitHub Pages. GitHub Actions automates the production build and deployment process whenever changes are pushed to the `main` branch.

**Live application:** https://amjad-adi.github.io/encs4380-dynamics-Remy/

## Academic Information

**Course:** ENCS4380 – Interfacing Techniques  
**University:** Birzeit University  
**Instructor:** Dr. Wasel Ghanem  
**Assignment:** Homework 1 – Dynamic Characteristics Interactive Toolkit  
**Released:** Thursday, 29 October 2026  
**Due:** Thursday, 12 November 2026  
**Final release:** v1.0
