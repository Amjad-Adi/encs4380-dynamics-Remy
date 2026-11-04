# Team Development Guide

This guide explains the project's frontend stack, modular structure, and a beginner-friendly workflow for collaborating with AI coding agents. The goal is for every module to feel and behave like part of the same application, even when different team members build different parts.

## 1. The technology stack

The project is a browser-based React application. Here is what the main technologies do:

| Technology | What it does in this project |
|---|---|
| **HTML** | Provides the page entry point and document structure. React renders the application into that page. |
| **React** | Builds the interface from small, reusable components. |
| **TypeScript** | Adds types to JavaScript so that data, component properties, and calculations are easier to understand and errors are easier to catch. |
| **Tailwind CSS** | Provides utility classes for styling layouts, spacing, colors, and responsive behavior. This project uses Tailwind CSS 4. |
| **CSS** | Holds the global styles and design foundations that complement Tailwind. |
| **shadcn/ui** | Supplies a pattern and tools for reusable interface components. The project configuration uses the shadcn ecosystem and Base UI. It is not a single ready-made component library: components are integrated into the project and can be adapted. |
| **Vite** | Runs the local development server and creates the production build. |
| **Plotly** | Creates interactive engineering plots and charts. |
| **KaTeX** | Renders mathematical notation. |
| **React Router** | Handles navigation between application views. |
| **Lucide React / React Icons** | Provide icons for the interface. |

Other libraries are listed in `package.json`. Before adding a dependency, check whether the project already has a suitable library and discuss the addition with the team.

## 2. How the modular design works

The application is divided into learning modules, while shared parts of the interface—such as navigation, common controls, styling conventions, and chart patterns—help the modules feel consistent. React components make it possible to build a screen from smaller pieces and reuse those pieces where it makes sense.

A module should own its own topic-specific calculations, controls, explanations, and visualizations. Shared components should stay general and should not contain calculations that belong to only one module. This separation makes modules easier to build, test, understand, and update independently.

The first two completed modules are useful examples for new work. Before asking an AI agent to implement another module, inspect **Module 1 (First-Order Time Response)** and **Module 2 (First-Order Frequency Response)**. Look at how they are organized, how they use the shared layout and visual style, how controls update plots, and how they explain engineering results. Treat them as examples of project conventions—not as permission to copy unrelated calculations or duplicate large sections of code.

## 3. A safe workflow for building a module with AI

AI agents can help explain code, draft components, identify integration issues, and suggest tests. They do not know the team's intentions unless you explain them, and their output can be incorrect. A team member must review and verify every change.

### Step 1: Understand before changing code

1. Read the assignment requirements and write down what the module must teach or demonstrate.
2. Run the application and explore the first two modules.
3. Find their source files and shared components. Follow the existing folder and naming conventions instead of inventing a new structure.
4. Identify what the new module can reuse and what is unique to it.
5. Agree with the team on the module's entry point, inputs, outputs, and any shared components it needs.

### Step 2: Give the agent useful context

Use an approved coding assistant, preferably in the repository or IDE context so it can see the relevant files. Give it a focused task and point it to the two reference modules. Do not ask it to redesign or rewrite the whole application when you only need one module.

A useful prompt template:

> We are adding **[module name]** to this React and TypeScript learning toolkit. First inspect Module 1 and Module 2 and summarize the existing component, styling, navigation, and chart conventions. Do not edit files yet. The new module must **[requirements and learning outcomes]**. It should integrate through **[agreed route/navigation or parent component]**, use the existing shared components where appropriate, and keep its calculations separate from presentation. Before coding, propose the files to add or change and explain how they connect to the existing app. Do not change unrelated modules or add dependencies without asking. After approval, implement the module and report what changed, assumptions made, and how I can verify it.

Then work in small steps: agree on the plan, implement one piece, run the checks, inspect the diff, and continue. If an answer or calculation is unclear, ask the agent to explain it and compare it with course material or an independently checked example.

### Step 3: Keep the agent on task

- Give it the relevant files, requirements, expected behavior, and examples of expected results.
- Ask it to explain unfamiliar code in plain language before accepting changes.
- Ask it to preserve existing patterns and avoid unrelated edits.
- Never share passwords, API keys, private student data, or other secrets in prompts. Do not commit `.env` files; use the existing `.env.example` as a guide.
- Do not accept a mathematical result just because the code runs. Check formulas, units, edge cases, and at least one known numerical example.
- Review every changed file and the complete Git diff. The person responsible for the module owns the final result, including AI-assisted code.

## 4. Integrate modules consistently

Before implementation, agree on a small integration contract with the team:

- **Where it lives:** follow the existing source tree and module naming patterns.
- **How it opens:** use the application's existing navigation or routing convention.
- **What it shares:** reuse global layout and general-purpose UI components; keep module-specific controls and domain calculations local.
- **How it looks:** use the established spacing, typography, colors, responsive behavior, and chart presentation.
- **How it behaves:** explain inputs, units, outputs, and what happens for boundary or invalid values.

When a module is ready, run it alongside the existing modules, not just in isolation. Check navigation, mobile and desktop layouts, browser console errors, charts, mathematical notation, and whether shared components still work. Coordinate changes to shared files with the team to avoid conflicting edits. Prefer a focused pull request that describes the module, lists files changed, and gives simple review steps.

## 5. Suggested AI coding assistants

Choose an assistant the team can access and that supports the way you work (for example, in-editor help or repository-aware coding). Examples with free or free-tier options have included **GitHub Copilot Free**, **Gemini Code Assist**, and **Qodo** (formerly CodiumAI). Plans, limits, availability, and terms can change, so check each provider's current official plan before choosing. A paid plan is not required for this workflow; a general chat assistant can also help explain code and review a small, pasted snippet, provided no secrets or sensitive data are included.

Use one assistant at a time for a clearly defined task when possible. Keep the team aligned by sharing the task, plan, and changes—not by assuming every member has access to the same conversation or tool.

## 6. Run and check the application

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Before sharing changes, create a production build:

```bash
npm run build
```

The build runs the TypeScript project checks and then builds the site with Vite. The repository currently defines `dev`, `build`, and `preview` scripts; do not assume there is an automated test or lint script unless one has been added. After building, you can preview the production output locally with:

```bash
npm run preview
```

In addition to the build, manually verify module behavior and its calculations against the assignment or a trusted worked example. Report checks that you ran and any known limitations in the pull request.

## 7. Deployment

The project is configured for deployment to **GitHub Pages**. Its Vite configuration accounts for the repository path in production, and the README describes the existing GitHub Actions deployment flow. Follow that workflow rather than introducing a separate hosting setup. After an approved change is deployed, open the live site and confirm the new module, navigation, assets, and plots work at the deployed URL.

If deployment fails, check the Actions run for the failing step, confirm the build succeeds locally, and verify that the Pages workflow and repository settings still match the project's deployment configuration. Do not expose deployment secrets in logs or AI prompts.

## 8. Definition of done

A module is ready to integrate when:

- It meets the agreed learning and assignment requirements.
- Its layout and interactions follow the existing application conventions.
- Its calculations and units have been checked with known examples.
- It builds successfully with `npm run build`.
- It works with the other modules and has been checked at desktop and mobile sizes.
- Its changes have been reviewed by a teammate, including any AI-generated code.
- The pull request explains what changed and how to verify it.
