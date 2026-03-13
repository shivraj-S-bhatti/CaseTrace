# CaseTrace Demo Guide

## What This Is

CaseTrace is not meant to be pitched as a finished product. It is a research testbed for demonstrating a novel neurosymbolic approach to fraud and compliance review.

The point of the demo is:

1. Show the workflows we care about: origination, business onboarding, watchlist screening, ongoing monitoring, and manual review.
2. Show the technical novelty: neural pattern finding plus symbolic policy verification plus counterfactual reasoning.
3. Show the output quality: a human-review packet with evidence, policy hits, recommended next step, and replay-ready audit context.

## What To Do With It

Use the page as a narrative demo, not as a dashboard walkthrough.

Start with the thesis at the top:

- We are not trying to replace analysts or case managers.
- We are testing whether a neurosymbolic layer can make customer-risk review more actionable and auditable.
- The value is fewer dead-end alerts, better manual-review packets, and clearer reasoning about what changes the outcome.

Then move through the page in this order:

1. `Research surfaces`
   Explain that the work is grounded in real workflows: origination, KYB/KYC, ongoing monitoring, and watchlist screening.
2. `Scenario panel`
   Click through the tabs to show the problem spaces we are modeling, not features we are pretending to sell.
3. `Live case lab`
   Open one or two synthetic cases and show the evidence, entity graph, recommendation packet, policy checks, and counterfactual lane.
4. `Validation and proof loop`
   End on replay, evidence grounding, and bounded counterfactuals so the story closes on rigor rather than aesthetics.

## Recommended Demo Flow

### 1. Open on `Origination`

Say:

> We start at origination because that is where identity, fraud, device, and watchlist signals first have to resolve into a customer-level risk view.

Then click `Harborline Payments` in the live case lab and explain:

- The typology is a coordinated onboarding attack.
- The system does not just score it; it packages a recommended next step.
- The reason for escalation is visible in evidence and policy, not hidden in a black box.

### 2. Switch to `KYB / KYC`

Say:

> Business onboarding is where beneficial-owner research, registry data, sanctions checks, and document verification collide.

Then show `Silverline Commerce` and explain:

- The issue is not simply “high risk.”
- The test is whether the system can tell the analyst why this should be recoverable with document requests rather than denied too early.
- The counterfactual lane shows what evidence would move the case forward.

### 3. Switch to `Watchlist screening`

Say:

> Watchlist screening is not just about finding a match. It is about resolving close matches and false positives quickly with supporting evidence.

Then show `Mira Santos` and explain:

- The typology is false-positive clearance.
- The point is to reduce unnecessary manual review and preserve explainability.
- The output is a review packet, not an autonomous decision.

### 4. Close on `Validation and proof loop`

Say:

> If the recommendation is not replayable, evidence-grounded, and easy to challenge, the rest of the system does not matter.

## What To Say

Good framing:

- “This is a research rig for identity risk and compliance workflows.”
- “We are testing whether neurosymbolic review can produce more actionable packets.”
- “The system explores patterns, verifies policy constraints, and hands a human reviewer a next step.”
- “We care about customer-level risk, manual review quality, and false-positive reduction.”
- “The output is designed for fraud, AML, and risk operations teams.”

## What Not To Say

Avoid these:

- “This is our new product.”
- “AI makes the decision.”
- “This replaces manual review.”
- “This is already production-ready.”
- “This is just a prettier case-management UI.”

## If You Only Have 90 Seconds

Use this sequence:

1. Read the top thesis.
2. Click `Origination`.
3. Open `Harborline Payments`.
4. Point to the evidence table, rule hit, and recommended next step.
5. Click `Watchlist screening`.
6. Open `Mira Santos`.
7. End on the validation section.

## Local Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
