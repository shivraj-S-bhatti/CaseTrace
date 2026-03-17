# CaseTrace 10-Minute YouTube Script

## Working Title

**CaseTrace: A Neurosymbolic Research Rig for Fraud and Compliance Review**

## Goal

Use this video to explain three things clearly:

1. What problem CaseTrace is trying to solve
2. Why the approach is neurosymbolic instead of just "AI plus UI"
3. Why the system is useful even though it is a research testbed and not a production product

## Recording Notes

- Speak a little slower than normal.
- Keep the browser at `http://localhost:3000`.
- Use the page as the visual spine of the video.
- Do not pitch this as a finished product.
- Frame it as a serious technical exploration for customer-risk, onboarding, screening, and manual-review workflows.

## Script

### 0:00 - 0:35

**On screen**

- Open the top of the homepage
- Keep the hero and thesis visible

**Voiceover**

This project is called CaseTrace. It is not a polished product launch and it is not a generic AI dashboard. It is a research rig for a much narrower question: can a neurosymbolic system make fraud and compliance review materially more actionable, more auditable, and easier for human operators to trust?

The basic idea is simple. Neural systems are good at finding patterns in messy, multi-source data. Symbolic systems are good at enforcing policy, staying deterministic, and making reasoning easy to replay. CaseTrace is an attempt to combine those two strengths into one review packet.

### 0:35 - 1:25

**On screen**

- Slowly scroll through the top framing section
- Pause on the workflow language

**Voiceover**

The workflow language here is deliberate. I am framing the project around origination, business onboarding, watchlist screening, ongoing monitoring, and manual review. Those are the places where teams have to take identity signals, business data, device behavior, sanctions results, registry information, and other fragmented evidence and somehow turn that into a defendable next step.

The problem is not just detection. The real problem is actionability. A high score by itself is not useful. A rule hit by itself is not useful. A language model summary by itself is definitely not enough. What teams need is a packet that says: here is the evidence, here are the policies that matter, here is the recommended next action, and here is what would change the outcome.

### 1:25 - 2:20

**On screen**

- Highlight the section that explains the stack or thesis
- Point to the research-rig framing

**Voiceover**

That is where the neurosymbolic framing comes in. In the endgame version of this project, the neural layer would do the heavy pattern finding: things like tabular risk scoring, graph-based relationship analysis, and signal aggregation across transactions, device linkages, ownership structures, and identity checks.

Then the symbolic layer would take over. It would enforce hard policy constraints, produce deterministic rule traces, generate bounded counterfactuals, and make sure the final packet is grounded in evidence that a human reviewer can inspect.

So the thesis is not "let AI decide." The thesis is: let machine intelligence explore, let symbolic logic verify, and let humans make the final call with a much better packet in front of them.

### 2:20 - 3:25

**On screen**

- Move to the `Research surfaces` section
- Click through the tabs one by one

**Voiceover**

This section is here to show the scope of the research, not to pretend I built five products. Each tab represents a high-value workflow where the same underlying architecture can be tested.

Origination is about resolving customer-level risk early, when identity, device, velocity, and watchlist signals are first coming together.

KYB and KYC are about business onboarding, beneficial ownership, registry mismatches, document verification, and sanctions ambiguity.

Ongoing monitoring is about change events over time: new filings, watchlist changes, suspicious activity, and behavior shifts that should trigger a fresh review.

Watchlist screening is especially important because the challenge is not just finding a match. The challenge is resolving close matches and false positives quickly, while keeping the reasoning explainable.

### 3:25 - 4:15

**On screen**

- Stop at the `Live case lab`
- Hover over the case queue without clicking yet

**Voiceover**

The live case lab is the core of the demo. This is where synthetic cases get turned into actionable review packets. Each case has a program area, a typology, supporting facts, graph relationships, triggered policies, and a recommendation that is explicitly designed for human approval rather than autonomous execution.

The important thing is that the interface is not trying to look like a generic enterprise dashboard. It is trying to make the reasoning legible. The queue tells you what kind of case you are looking at, the evidence table tells you what facts matter, the graph tells you how entities connect, and the packet tells you what to do next.

### 4:15 - 5:40

**On screen**

- Click `Harborline Payments`
- Keep the evidence table, graph, and recommendation visible

**Voiceover**

Let us start with Harborline Payments. This case sits in origination, and the typology is a coordinated onboarding attack. There is no dramatic sanctions hit here. The interesting part is the combination of signals: a shared device cluster, bursty submissions, and the shape of the linked activity.

This is a good example of why simple fraud scoring is not enough. A model might tell you something is risky, but that still leaves an analyst asking, risky in what way, because of what evidence, and what should I do with it?

Here, the packet is trying to answer that directly. The evidence table shows the key facts. The graph makes the shared device and linked relationships visible. The policy trace turns those facts into explicit review logic. And the final recommendation is not vague. It tells the reviewer to escalate for manual review because the combination of device linkage and velocity behavior crosses a meaningful threshold.

### 5:40 - 6:50

**On screen**

- Click `Silverline Commerce`
- Then click `Mira Santos`

**Voiceover**

Now switch to Silverline Commerce. This is a better example of recoverable friction. The problem here is not that the business should be denied immediately. The problem is that the ownership picture is incomplete, the documents are incomplete, and there is enough conflicting information that approval would be premature.

This is exactly the kind of case where a good system should reduce overreaction. Instead of pushing everything toward denial or escalation, it should identify the next best action. In this case, that action is to request documents and resolve the ownership mismatch.

Then there is Mira Santos, which is the false-positive clearance example. Watchlist work is full of cases like this. You have a partial name match, but the underlying identifiers do not actually line up. If the system is working correctly, it should not just flag the case. It should help the operator clear it safely, with evidence. That is why the downgrade logic and the cited facts matter so much here.

### 6:50 - 7:55

**On screen**

- Point to triggered policy checks
- Point to counterfactuals
- Point to audit fields

**Voiceover**

This right-hand side is really the heart of the project. The recommendation panel is where the symbolic side becomes tangible.

First, there are triggered policy checks. These are deterministic. Given the same evidence, they should replay the same way every time.

Second, there are counterfactuals. This is one of the more interesting parts of the experiment. Instead of just saying what the decision is, the system tries to say what would change it. Clear the close watchlist match, verify the documents, resolve the registry inconsistency, and now the next-best action changes too.

Third, there is the audit packet. This is where the project moves away from "AI assistant" territory and toward something more defensible. Every recommendation needs provenance, supporting facts, and a trace that a human reviewer or auditor can challenge later.

### 7:55 - 8:50

**On screen**

- Scroll to the validation section
- Keep the validation cards visible

**Voiceover**

Validation is not an afterthought here. For a system like this, validation is part of the product thesis.

The research rig only matters if the outputs are replayable, evidence-grounded, and bounded. That is why the validation section focuses on actionability coverage, policy replay, evidence grounding, and counterfactual discipline.

In other words, the goal is not to say, "look, AI produced a plausible paragraph." The goal is to ask harder questions. Did the same evidence produce the same symbolic outcome? Are the cited facts actually the ones driving the recommendation? Are the counterfactuals tied to auditable changes, or are they just free-form speculation? That is the standard that matters in regulated workflows.

### 8:50 - 9:35

**On screen**

- Briefly show the repo docs
- Show `docs/data-sources.md` or mention the sourcing plan visually if convenient

**Voiceover**

Under the hood, this current version is still a front-end heavy research demo with synthetic cases and a deterministic decision engine. The endgame is much bigger.

The data strategy is already mapped out. For open modeling and evaluation, I would use sources like IBM AML-Data, AMLSim, and PaySim. For authoritative grounding, I would use sanctions lists, registry data, legal entity identifiers, and beneficial ownership datasets. And for production-shaped workflows, I would plug in sandbox or recorded responses from identity, business verification, device, and phone intelligence providers.

The important design choice is that all of those sources should be normalized into one fact ledger before the neurosymbolic layer sees them. That is what makes the system explainable and replayable instead of being trapped inside vendor-specific payloads.

### 9:35 - 10:00

**On screen**

- Return to the top of the page or keep the live case lab centered

**Voiceover**

So that is CaseTrace. The point is not that I built a finished compliance platform. The point is that I built a concrete environment to test a stronger technical idea: neural pattern finding for messy signals, symbolic verification for deterministic policy reasoning, and human-facing packets that make the final action easier to justify.

If this direction works, it does not just make review faster. It makes review clearer, more challengeable, and much more actionable. That is the endgame I care about.

## Optional Intro Line For The First 5 Seconds

If you want a stronger hook, start with this:

> Most fraud and compliance systems can tell you something looks risky. Very few can tell you what to do next, why, and what would change the outcome. That is what CaseTrace is trying to fix.

## Optional Closing Line

If you want a stronger ending, use this:

> AI should not replace judgment in regulated review. It should produce a better packet for the people who own the judgment.
