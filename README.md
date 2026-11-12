# ENCS4380 Homework 1: Dynamic Characteristics Interactive Toolkit

An interactive engineering toolkit for studying the dynamic characteristics of measurement systems through mathematical modeling, real-time simulation, numerical analysis, and visual exploration.

**Course:** ENCS4380 – Interfacing Techniques  
**University:** Birzeit University  
**Instructor:** Dr. Wasel Ghanem  
**Released:** Thursday, 29 October 2026  
**Due:** Thursday, 12 November 2026

---

## Live Application

**[Launch the Dynamic Characteristics Toolkit](https://amjad-adi.github.io/encs4380-dynamics-Remy/)**

**Source Code:** [GitHub Repository](https://github.com/Amjad-Adi/encs4380-dynamics-Remy)

---

## Team and Contributions

The project is developed collaboratively. Each team member contributes to specific learning modules, including their mathematical models, interactive controls, visualizations, and integration into the shared application.

| Team Member | Contributions |
|---|---|
| Amjad Adi | First-Order Time Response, Pole Explorer |
| Yazeed | First-Order Frequency Response, Superposition Simulator |
| Hanan | Second-Order System Response, README documentation and project documentation |
| Rahaf | Guess the Sensor Challenge, Numerical ODE Solver |

---

## Project Overview

The Dynamic Characteristics Toolkit provides an interactive environment for investigating the behavior of measurement systems and understanding the mathematical principles behind their dynamic characteristics.

The application combines time-domain analysis, frequency-domain analysis, second-order system modeling, numerical integration, pole-based analysis, signal superposition, and practical sensor identification.

Each module focuses on a specific engineering concept while following a consistent application architecture, interface design, and interaction pattern.

## Project Modules

### 1. First-Order Time Response

**Developer:** Amjad Adi

An interactive investigation of first-order measurement systems in the time domain, based on the transfer function:

\[
G(s)=\frac{K}{\tau s+1}
\]

The module explores how system gain and time constant influence transient response, steady-state behavior, and tracking performance.

**Implemented features:**

- Interactive first-order step-response simulation.
- Visualization of the 63.2% response point at \(t=\tau\).
- Visualization of the 95% response point at \(t=3\tau\).
- Ramp-response simulation with ideal and actual output comparison.
- Calculation and visualization of ramp tracking lag and steady-state error.
- Logarithmic error-fraction analysis demonstrating exponential response decay.
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

---

### 2. First-Order Frequency Response

**Developer:** Yazeed

An interactive analysis of first-order measurement systems in the frequency domain, examining how a sensor responds to sinusoidal inputs across different operating frequencies.

The module connects the frequency-domain transfer function to observable changes in output amplitude and phase:

\[
M=\frac{1}{\sqrt{1+(\omega\tau)^2}}
\]

\[
\phi=-\tan^{-1}(\omega\tau)
\]

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

---

### 3. Second-Order System Response

**Developer:** Hanan

An interactive study of second-order measurement systems, focusing on the influence of damping ratio and natural frequency on transient response.

The module uses the standard second-order transfer function:

\[
G(s)=\frac{K\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}
\]

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

---

### 4. Guess the Sensor Challenge

**Developer:** Rahaf

An interactive parameter-estimation challenge that applies the concepts introduced in the preceding modules. Users investigate an unknown sensor response and estimate its underlying dynamic parameters from observed behavior.

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

![Module 4 – Screenshot 1](screenshots/4-1.png)

![Module 4 – Screenshot 2](screenshots/4-2.png)

![Module 4 – Screenshot 3](screenshots/4-3.png)

---

### 5. Superposition Simulator

**Developer:** Yazeed

An interactive simulator demonstrating how multiple sinusoidal signals combine through the principle of superposition and how a first-order measurement system affects the resulting signal.

Users can construct a composite signal from an arbitrary number of sinusoidal components and investigate how each frequency component is affected by the sensor.

The individual input components are represented by:

\[
x_i(t)=A_i\sin(\omega_i t+\phi_i)
\]

The combined input is:

\[
x(t)=\sum_{i=1}^{N}x_i(t)
\]

The simulator models the first-order sensor using:

\[
\tau\frac{dy(t)}{dt}+y(t)=Kx(t)
\]

For a sinusoidal component in steady state, the sensor's magnitude ratio and phase lag are:

\[
M_i=\frac{1}{\sqrt{1+(\omega_i\tau)^2}}
\]

\[
\phi_i=-\tan^{-1}(\omega_i\tau)
\]

The resulting output component has amplitude \(KA_iM_i\), with phase \(\phi_i+\phi_i\!{}_{\text{sensor}}\).

**Implemented features:**

- Dynamically add and remove sinusoidal components.
- Independently configure each component's amplitude, angular frequency, and phase.
- Display the mathematical expression of every component.
- Calculate the combined input signal from all active components.
- Configure the first-order sensor gain and time constant.
- Plot individual components, their combined input, and sensor output.
- Display the amplitude attenuation and phase lag associated with each frequency component.
- Demonstrate the increasing attenuation and phase lag experienced by higher-frequency components.
- Interactive prediction activity for exploring the effects of adding, removing, and modifying components.

**Screenshots**

Updated screenshots should demonstrate component management, signal composition, sensor response, and the prediction activity.

---

### 6. Pole Explorer

**Developer:** Amjad Adi

An interactive tool for exploring the relationship between system poles in the complex s-plane and the dynamic characteristics of a system.

Users manipulate pole locations and observe how the resulting system behavior changes, including stability, damping, natural frequency, and time-domain response.

For a standard second-order system:

\[
G(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}
\]

The corresponding complex conjugate poles are:

\[
s_{1,2}=-\zeta\omega_n
\pm j\omega_n\sqrt{1-\zeta^2}
\]

**Implemented features:**

- Interactive complex s-plane with real and imaginary axes.
- Draggable system poles.
- Support for first-order and second-order systems.
- Appropriate complex-conjugate pole relationships for second-order systems.
- Dynamic calculation of damping ratio and natural frequency.
- Real-time step-response updates when pole locations change.
- Calculation and display of percentage overshoot, peak time, and settling time where applicable.
- Visualization of underdamped, critically damped, and overdamped systems.
- Identification of stable and unstable systems based on pole locations.
- Demonstration of instability when poles enter the right half-plane.
- Interactive prediction activity exploring the effects of moving poles.

**Screenshots**

Updated screenshots should demonstrate pole manipulation, system characteristics, and the corresponding response plots.

---

### 7. Numerical ODE Solver

**Developer:** Rahaf

An interactive numerical integration tool demonstrating how numerical methods approximate solutions to differential equations.

The module compares Euler's Method and the Fourth-Order Runge–Kutta (RK4) method against the analytical solution of a first-order measurement system.

The first-order system is described by:

\[
\tau\frac{dy(t)}{dt}+y(t)=Kx(t)
\]

For a step input of amplitude \(A\) and zero initial conditions:

\[
y(t)=KA(1-e^{-t/\tau})
\]

The differential equation used for numerical integration is:

\[
\frac{dy(t)}{dt}=\frac{Kx(t)-y(t)}{\tau}
\]

**Implemented features:**

- Numerical integration using Euler's Method and fourth-order Runge–Kutta.
- Interactive selection of the numerical integration method.
- Adjustable integration step size \(\Delta t\).
- Adjustable system gain, time constant, and input amplitude.
- Comparison of numerical approximations against the analytical solution.
- Real-time response visualization.
- Maximum absolute error, root mean square error (RMSE), and final-time absolute error calculations.
- Euler stability classification using the step-size-to-time-constant ratio.
- Interactive prediction activity comparing the expected accuracy of numerical methods.

**Screenshots**

![Numerical ODE Solver – Controls](screenshots/bonus-numerical-ode-controls.png)

![Numerical ODE Solver – Comparison](screenshots/bonus-numerical-ode-comparison.png)

![Numerical ODE Solver – Error Metrics](screenshots/bonus-numerical-ode-errors.png)

![Numerical ODE Solver – Prediction Activity](screenshots/bonus-numerical-ode-prediction.png)

![Numerical ODE Solver – Mobile Layout](screenshots/bonus-numerical-ode-mobile.png)

---

## Teaching Approach – Predict, Then Check

The toolkit encourages active exploration. Rather than presenting system responses as static results, it allows students to form predictions, manipulate system parameters, and compare their expectations with mathematical calculations and visualizations.

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
11. **Signal superposition:** Add two sinusoidal components with different frequencies. Predict how their combination changes the resulting waveform.
12. **Frequency-dependent sensor response:** Increase the frequency of one component while keeping its amplitude unchanged. Predict how its sensor output changes.
13. **Pole movement:** Move a complex-conjugate pole pair closer to the imaginary axis. Predict the effect on damping, overshoot, and settling time.
14. **System stability:** Move a pole into the right half-plane. Predict the resulting system behavior.
15. **Numerical integration:** Compare Euler's Method and RK4 using the same integration step size. Predict which method will produce the smaller numerical error.
16. **Integration accuracy:** Reduce the integration step size and predict how the numerical approximation approaches the analytical solution.

---

## Technology Stack

The toolkit uses a modular React architecture that combines mathematical computation, interactive visualization, and reusable interface components.

| Technology | Purpose |
|---|---|
| HTML5 | Provides the document structure and application entry point. |
| React | Builds the interface using reusable, component-based architecture and manages interactive application state. |
| TypeScript | Adds static typing to application logic, component properties, and mathematical models, helping identify errors during development. |
| Vite | Provides the local development server and production build process. |
| Tailwind CSS 4 | Provides utility-based styling, responsive layouts, spacing, and consistent visual design. |
| CSS | Defines global styles and design foundations that complement Tailwind CSS. |
| shadcn/ui | Provides reusable component patterns integrated into the project and adapted to its interface requirements. |
| Base UI | Provides accessible interaction primitives used by the project's component implementation. |
| Plotly | Creates interactive engineering plots, response curves, and data visualizations. |
| KaTeX | Renders mathematical equations and engineering notation. |
| React Router | Handles client-side routing and navigation between modules. |
| Lucide React | Supplies consistent interface icons. |
| React Icons | Provides additional icon resources where needed. |

Additional dependencies are documented in `package.json`. The project uses the existing libraries and shared components wherever practical to maintain consistency and avoid unnecessary dependencies.

---

## Architecture and Development

The application follows a modular frontend architecture. Each module maintains its own domain-specific calculations, controls, visualizations, and learning interactions, while shared components provide a consistent application experience.

The architecture emphasizes:

- **Separation of concerns:** Mathematical models and calculations are separated from presentation and interaction components.
- **Reusable components:** Shared navigation, section headings, controls, cards, and layout patterns are reused where appropriate.
- **Consistent visual design:** Modules follow common typography, spacing, colors, responsive behavior, and chart conventions.
- **Interactive state management:** Parameter changes update the corresponding calculations and visualizations.
- **Mathematical verification:** Engineering equations and numerical results are checked against expected values and known examples.
- **Responsive design:** The interface supports desktop and mobile screen sizes.

Module-specific calculations remain within their respective feature directories. Shared interface components are maintained separately so that improvements to common functionality can benefit the entire application.

### Project Structure

The source code follows a feature-oriented organization:

```text
src/
├── components/
│   ├── modules/
│   └── ui/
├── features/
│   ├── first-order-time/
│   ├── first-order-frequency/
│   ├── second-order/
│   ├── sensor-challenge/
│   ├── superposition/
│   ├── pole-explorer/
│   └── numerical-ode/
├── hooks/
├── models/
├── pages/
└── ...
```

Each feature directory contains the domain logic and UI components associated with its module. Shared components are placed in the common components directory.

---

## AI-Assisted Development

AI coding assistants were used as development tools throughout the project. Their role included supporting technical reasoning, implementation planning, code generation, debugging, code review, and interface refinement.

AI assistance does not replace the responsibility of each team member to understand, review, test, and explain their implementation.

### Amjad Adi – First-Order Time Response and Pole Explorer

**AI tool:** ChatGPT (GPT-6)

**What I asked:**

I used ChatGPT throughout the development of the first-order time-response module and the Pole Explorer.

For the first-order module, I requested assistance with translating the mathematical model into interactive calculations, implementing step and ramp responses, deriving characteristic response points, and presenting the results through interactive visualizations.

For the Pole Explorer, I requested assistance with planning the relationship between pole locations and system characteristics, deriving damping ratio and natural frequency from pole coordinates, handling complex-conjugate poles, and connecting pole movement to the corresponding time-domain response.

My prompts also covered React component organization, mathematical presentation, interactive controls, chart behavior, and integration with the existing application architecture.

**What I learned:**

- How the time constant governs the transient behavior of first-order systems.
- How logarithmic error analysis reveals exponential decay.
- How pole locations determine system stability and dynamic characteristics.
- How damping ratio and natural frequency can be derived from second-order pole locations.
- How to connect mathematical models to interactive visualizations using React and TypeScript.
- How to separate domain calculations from presentation components.

**How I used it:**

I provided the technical requirements, mathematical relationships, implementation constraints, and frontend conventions. I reviewed the generated suggestions, evaluated the component structure and calculations, and requested targeted revisions when necessary.

I also checked the implemented calculations against mathematical relationships and known engineering examples. The AI assistance was used selectively as a development and review tool rather than accepted without evaluation.

### Yazeed – First-Order Frequency Response and Superposition Simulator

**AI tool:** Claude Opus

**What I asked:**

For the first-order frequency-response module, I initially provided the existing Python backend and requested assistance developing the user interface. The AI helped translate the backend functionality into an interactive Streamlit application, including controls, plots, and the presentation of calculated results.

For the Superposition Simulator, I used AI assistance to support the development of an interactive signal-combination interface. The implementation requirements included dynamically adding and removing sinusoidal components, configuring amplitude, angular frequency, and phase, calculating their combined input, and modeling the effect of a first-order sensor.

I also requested assistance with the presentation of individual signal components, the combined signal, sensor output, and frequency-dependent attenuation and phase lag.

**What I learned:**

- How a Python backend can be connected to an interactive user interface.
- How Streamlit supports interactive controls and engineering visualizations.
- How multiple sinusoidal signals combine through superposition.
- How a first-order sensor affects different frequency components through attenuation and phase lag.
- How to organize interactive signal components and keep their calculations and visualizations synchronized.

**How I used it:**

I used AI assistance to help translate the existing frequency-response functionality into an interactive interface and to support the development of the Superposition Simulator.

I reviewed the proposed implementation against the mathematical requirements and the expected application behavior, focusing on the correctness of signal composition, sensor response, and the resulting visualizations.

### Hanan – Second-Order System Response and Project Documentation

**AI tool:** ChatGPT (GPT-6) and an AI coding assistant integrated into WebStorm.

**What I asked:**

I used AI assistance throughout the development of the second-order system module. I provided the project requirements and requested help planning the implementation, following the existing module architecture, and organizing the code into domain logic, controls, pages, and charts.

I also requested assistance with implementing second-order system equations, damping regimes, step responses, response metrics, poles, and state-space calculations.

For project documentation, I used AI assistance to review the README structure, improve technical descriptions, organize module contributions, document the technology stack, and maintain consistency between the documentation and the implemented application.

**What I learned:**

I improved my understanding of second-order dynamic systems, including the relationship between mass, damping, stiffness, natural frequency, and damping ratio.

I learned how underdamped, critically damped, overdamped, and undamped systems behave differently. I also strengthened my understanding of step-response characteristics, transfer-function poles, state-space representation, eigenvalues, and phase-plane trajectories.

From the software engineering perspective, I learned how to structure a React and TypeScript feature, separate domain calculations from UI components, connect state to interactive charts, and integrate a module into an existing application.

**How I used it:**

I used AI as a development and review assistant while remaining involved in implementation decisions and testing.

I used it to break requirements into manageable implementation phases, support the development of domain calculations and visualizations, review generated code, and investigate issues.

I also used AI assistance to improve project documentation and organize technical information. The final documentation and implementation were reviewed against the project requirements and available application functionality.

### Rahaf – Guess the Sensor Challenge and Numerical ODE Solver

**AI tool:** ChatGPT (GPT-6) and GitHub Copilot.

**What I asked:**

For the Sensor Challenge, I used ChatGPT to understand the requirements, plan the implementation, and prepare technical prompts for GitHub Copilot. I requested assistance with generating first-order and second-order sensor parameters, adding measurement noise, estimating system parameters, and implementing scoring and feedback.

For the Numerical ODE Solver, I used AI assistance to support the implementation of Euler's Method and fourth-order Runge–Kutta. This included the differential equation formulation, numerical integration, comparison against the analytical solution, error calculations, and interactive parameter controls.

I also requested help with plotting numerical and analytical solutions together, investigating numerical stability, implementing the prediction activity, and resolving integration and build issues.

**What I learned:**

I learned how to identify first-order system parameters using the 63.2% response method and estimate second-order parameters using percentage overshoot and peak time.

I also improved my understanding of numerical integration, the differences between Euler's Method and RK4, integration step size, numerical error, and stability.

Additionally, I strengthened my knowledge of React component integration, TypeScript, interactive visualization, and Git workflows.

**How I used it:**

I used AI assistance to plan and implement both modules within the existing React and TypeScript architecture.

GitHub Copilot helped generate implementation code for interactive components and calculations. ChatGPT supported the development process through requirement analysis, technical explanations, debugging, and review.

I reviewed the generated code, ran the application locally, checked the behavior of the interactive controls, and verified the production build.

---

## Validation

The toolkit is evaluated against the numerical validation cases supplied in the homework specification.

| # | Validation case | Expected result |
|---|---|---|
| 1 | First-order step response at \(t=\tau\) | \(y(\tau)=0.632KA\) |
| 2 | First-order step response at \(t=3\tau\) | \(y(3\tau)=0.95KA\) |
| 3 | Frequency response, \(\tau=0.2\,s\), \(\omega=2\,rad/s\) | \(M\approx0.93\), phase lag \(\approx21.8^\circ\) |
| 4 | Maximum time constant for 100 Hz signals with 5% dynamic error | \(\tau_{\max}\approx0.52\,ms\) |
| 5 | Phase lag at 50 Hz using the maximum time constant | \(\approx9.3^\circ\) |
| 6 | Second-order response with \(\zeta=0.5\) | Overshoot \(\approx16.3\%\) |
| 7 | Second-order response with \(\zeta=1\) | No overshoot |
| 8 | State-space model, \(m=1,\ b=2,\ k=4\) | Eigenvalues \(-1\pm j1.732\), matching the poles |

The additional interactive modules provide further opportunities to investigate numerical behavior, signal superposition, and pole-based stability. Their calculations should be checked against their respective mathematical models and known examples.

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

---

## Screenshots

Project screenshots are maintained in the repository's `screenshots/` directory.

Existing screenshot references are retained in the relevant module sections. The screenshot collection should be maintained by module and should reflect the final deployed implementation.

Recommended organization:

```text
screenshots/
├── module-1/
│   ├── ...
├── module-2/
│   ├── ...
├── module-3/
│   ├── ...
├── module-4/
│   ├── ...
├── superposition/
│   ├── ...
├── pole-explorer/
│   ├── ...
└── numerical-ode/
    ├── ...
```

For each module, screenshots should demonstrate:

- Main functionality and interactive controls.
- Relevant calculations and visualizations.
- Light and dark themes.
- Desktop and mobile layouts.

All image references should point to actual files committed to the repository. Screenshots should be updated whenever a major interface change makes the existing captures inaccurate.

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Amjad-Adi/encs4380-dynamics-Remy.git

cd encs4380-dynamics-Remy
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

To generate a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The repository currently uses the build process as its available automated project check. Do not assume a dedicated test or lint script exists unless one has been added to `package.json`.

---

## Deployment

The application is deployed as a static website through GitHub Pages.

GitHub Actions automates the production build and deployment process whenever changes are pushed to the `main` branch.

**Live application:** https://amjad-adi.github.io/encs4380-dynamics-Remy/

After deployment, verify that all modules, routes, navigation elements, mathematical expressions, charts, and assets work correctly on the published site.

---

## Academic Information

**Course:** ENCS4380 – Interfacing Techniques  
**University:** Birzeit University  
**Instructor:** Dr. Wasel Ghanem  
**Assignment:** Homework 1 – Dynamic Characteristics Interactive Toolkit  
**Released:** Thursday, 29 October 2026  
**Due:** Thursday, 12 November 2026  
**Final release:** v1.0
