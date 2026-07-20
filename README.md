# LOOP — Personal Activity Intelligence

LOOP turns scattered digital activity into a clear picture of what you finished, what is still open, who needs a reply, and what to do next.

**Live demo:** https://lockframe.misatokikuchi.chatgpt.site

## The problem

At the end of a busy day, work is spread across creative apps, files, browser tabs, and email. A normal screen-time report can say that Photoshop was open for three hours, but it cannot tell you whether the work was exported, delivered, forgotten, or still waiting for feedback.

LOOP organizes activity by meaning instead of time:

- **Done** — completed work
- **Still Open** — work that was started but not finished
- **You Owe** — messages or actions that still need a response
- **Waiting** — items currently blocked by someone else
- **Tomorrow** — the three most relevant next actions

## Current prototype

This repository contains a runnable web prototype with realistic sample activity data. It demonstrates the complete product experience, including interactive work-state circles, AI analysis, Tomorrow tasks, task details, and a Ready state.

The prototype also includes an experimental local macOS collector in `public/loop-agent.swift`. It records changes to the frontmost application and window title in a local JSONL file. It is an early proof of the local collection architecture, not a background production application.

## How GPT-5.6 is used

The `/api/analyze-day` route sends activity events to GPT-5.6 through the OpenAI Responses API. The model receives a strict JSON schema and returns:

- a short daily headline;
- completed and unfinished work;
- replies the user owes;
- responses the user is waiting for; and
- three priorities for tomorrow.

The prompt deliberately separates editing from completion: opening or modifying a file is not treated as proof that it was exported, delivered, or sent.

When `OPENAI_API_KEY` is not configured, the route returns deterministic sample results so judges can still run and explore the full interface.

## How Codex was used

Codex was used throughout the build to:

- turn the initial idea into a working product architecture;
- implement the React interface and circular interaction system;
- create the structured GPT-5.6 analysis route;
- model the activity states and sample events;
- debug the UI and API flow;
- add the interactive Tomorrow task dialog and Ready state; and
- build, test, and deploy the runnable prototype.

The majority of the core functionality was developed in the Codex session submitted with the project.

## Tech stack

- GPT-5.6 and the OpenAI Responses API
- React 19
- Next.js 16
- TypeScript
- Vite / Vinext
- CSS
- Swift proof-of-concept collector for macOS

## Run locally

### Requirements

- Node.js 22.13 or newer
- npm

### Setup

```bash
git clone https://github.com/miiiiiii828/loop.git
cd loop
npm ci
```

To run with live GPT-5.6 analysis, create a `.env.local` file:

```bash
OPENAI_API_KEY=your_openai_api_key
```

The key is optional. Without it, LOOP uses the included sample analysis.

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal.

### Optional macOS collector

On macOS, the proof-of-concept collector can be run separately:

```bash
swift public/loop-agent.swift
```

macOS will request Accessibility permission because reading the active window title requires it. The collector stores its output locally at:

```text
~/Library/Application Support/LOOP/activity.jsonl
```

The current web demo does not automatically import this file yet.

## Privacy approach

LOOP is designed around local-first collection, limited metadata, and user-controlled sources. The future product is intended to let users choose exactly which apps and signals it can access. The submitted demo uses sample data and does not read a judge's computer, email, or files.

## Known limitations

- The submitted interface demonstrates the workflow with sample activity data.
- The Swift collector and web interface are not connected automatically yet.
- Email and browser integrations are represented as sample signals rather than live account connections.

## Next steps

- Connect user-approved local activity to the analysis route.
- Add editable AI classifications and feedback.
- Link every task back to its original file, app, or thread.
- Generate daily and weekly closure reports.

## Build and test

```bash
npm run build
npm test
```

## License

MIT
