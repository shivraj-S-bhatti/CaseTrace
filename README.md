# CaseTrace

CaseTrace is a visual fraud/compliance review workspace for turning messy onboarding cases into evidence-backed recommendations, rule traces, counterfactuals, and audit-ready packets.

If you want the practical walkthrough for what to click and how to present it, start with [docs/demo-guide.md](/Users/apple/Projects/CaseTrace/docs/demo-guide.md).

## What is in this first build

- Synthetic queue of onboarding and watchlist-review cases
- Rule-backed recommendation engine with human-in-the-loop actions
- Entity graph, evidence timeline, recommendation card, and audit packet view
- Validation loop section showing deterministic replay and evidence citation discipline

## Stack

- Next.js
- React
- TypeScript
- Custom CSS

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Project framing

The product thesis is simple:

1. AI explores evidence.
2. Rules verify constraints.
3. Humans decide.

This repo is intentionally self-contained so the demo works without private data or third-party keys.
