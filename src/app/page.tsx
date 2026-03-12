"use client";

import { startTransition, useMemo, useState } from "react";
import { EVALUATIONS, VALIDATION_SIGNALS } from "@/lib/cases";
import { DecisionAction, EntityNode } from "@/lib/types";

const ACTION_LABELS: Record<DecisionAction, string> = {
  approve: "Approve",
  escalate_review: "Escalate to manual review",
  request_docs: "Request documents",
  clear_false_positive: "Clear false positive"
};

const TYPOLOGIES = [
  "Synthetic identity",
  "Account takeover",
  "First-party fraud",
  "Money mule activity",
  "Bust-out behavior",
  "Watchlist close matches"
];

const SCENARIOS = [
  {
    id: "origination",
    label: "Origination",
    title: "Onboarding and customer-level risk",
    theme: "coral",
    caseId: "ct-002",
    description:
      "Identity, device, fraud, and watchlist signals should resolve into one customer-level view before a step-up, approval, or manual review path is chosen.",
    bullets: [
      "Surface coordinated onboarding attacks before they become approved accounts.",
      "Show which signals are predictive versus which ones only add noise.",
      "Package an actionable next step instead of a raw model score."
    ]
  },
  {
    id: "kyb",
    label: "KYB / KYC",
    title: "Business onboarding and UBO research",
    theme: "rose",
    caseId: "ct-006",
    description:
      "Business onboarding is where KYB, KYC, sanctions, fraud, and document verification collide. This is the place to test how symbolic policy should react to messy ownership structures.",
    bullets: [
      "Compare registry records, UBO claims, and document verification in one packet.",
      "Escalate when ownership gaps are material instead of auto-denying on weak evidence.",
      "Make manual review faster by showing what would change the outcome."
    ]
  },
  {
    id: "monitoring",
    label: "Ongoing monitoring",
    title: "Alert triage after onboarding",
    theme: "plum",
    caseId: "ct-002",
    description:
      "PII changes, behavioral shifts, high-velocity events, and structuring-style patterns create alert volume. This lane is about triage quality, not just alert generation.",
    bullets: [
      "Group related signals into a single review packet instead of flooding queues.",
      "Suppress obvious noise so risk teams only see action-worthy alerts.",
      "Keep the decision path auditable for AML, fraud, and compliance operations."
    ]
  },
  {
    id: "watchlist",
    label: "Watchlist screening",
    title: "Recurring sanctions, PEP, and adverse media checks",
    theme: "magenta",
    caseId: "ct-005",
    description:
      "Watchlist screening is not just about finding a match. It is about separating true positives from false positives quickly and documenting why a customer should be escalated or cleared.",
    bullets: [
      "Test close-match triage with grounded supporting evidence.",
      "Re-run the decision when a date of birth, alias, or document changes.",
      "Hand investigators a clean packet instead of disconnected search results."
    ]
  }
] as const;

function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function toSentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function NodeBubble({ node, active }: { node: EntityNode; active: boolean }) {
  return (
    <div
      className={classNames("graph-node", `graph-node-${node.kind}`, active && "graph-node-active")}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <span>{node.label}</span>
    </div>
  );
}

function IntroMap() {
  const rows = [
    ["Data ecosystem", "Identity, business, fraud, device, phone, watchlist, and registry signals."],
    ["Decision orchestration", "Origination, step-up verification, manual review routing, and ongoing monitoring."],
    ["Neurosymbolic layer", "Neural pattern finding, symbolic policy gates, counterfactuals, and replay."],
    ["Actionable packet", "Recommended next step, cited evidence, policy trace, and audit-ready output."]
  ];

  return (
    <div className="map-card">
      {rows.map(([title, copy]) => (
        <div key={title} className="map-row">
          <strong>{title}</strong>
          <p>{copy}</p>
        </div>
      ))}
    </div>
  );
}

function OriginationDiagram() {
  return (
    <div className="diagram-surface">
      <svg viewBox="0 0 100 100" className="diagram-svg" aria-hidden="true">
        <path d="M28 18 H58" className="diagram-line" />
        <path d="M28 36 H58" className="diagram-line" />
        <path d="M28 54 H58" className="diagram-line" />
        <path d="M28 72 H58" className="diagram-line" />
        <path d="M58 18 C70 18 70 30 70 36" className="diagram-line" />
        <path d="M58 36 H70" className="diagram-line" />
        <path d="M58 54 C70 54 70 42 70 36" className="diagram-line" />
        <path d="M58 72 C70 72 70 60 70 54" className="diagram-line" />
        <path d="M70 36 H86" className="diagram-line" />
        <path d="M70 54 H86" className="diagram-line" />
      </svg>
      <div className="diagram-box at-1">Credit data</div>
      <div className="diagram-box at-2">Fraud signals</div>
      <div className="diagram-box at-3">Document verification</div>
      <div className="diagram-box at-4">Watchlist / AML</div>
      <div className="diagram-card at-5">
        <span>Customer profile</span>
      </div>
      <div className="diagram-card at-6">
        <span>Review packet</span>
      </div>
    </div>
  );
}

function JourneyDiagram() {
  return (
    <div className="diagram-surface">
      <svg viewBox="0 0 100 100" className="diagram-svg" aria-hidden="true">
        <path d="M14 50 H28" className="diagram-line" />
        <path d="M28 50 C36 50 36 34 44 34" className="diagram-line" />
        <path d="M28 50 C36 50 36 66 44 66" className="diagram-line" />
        <path d="M56 34 H72" className="diagram-line" />
        <path d="M56 66 H72" className="diagram-line" />
        <path d="M72 34 H88" className="diagram-line" />
        <path d="M72 50 H88" className="diagram-line" />
        <path d="M72 66 H88" className="diagram-line" />
      </svg>
      <div className="diagram-pill at-1">Start</div>
      <div className="diagram-pill at-2">Person</div>
      <div className="diagram-pill at-3">Business</div>
      <div className="diagram-box wide at-4">Individual onboarding</div>
      <div className="diagram-box wide at-5">Business onboarding</div>
      <div className="diagram-pill outcome-good at-6">Approved</div>
      <div className="diagram-pill outcome-review at-7">Manual review</div>
      <div className="diagram-pill outcome-bad at-8">Denied</div>
    </div>
  );
}

function MonitoringDiagram() {
  return (
    <div className="diagram-surface">
      <svg viewBox="0 0 100 100" className="diagram-svg" aria-hidden="true">
        <path d="M56 30 H70" className="diagram-line" />
        <path d="M56 46 H70" className="diagram-line" />
        <path d="M56 62 H70" className="diagram-line" />
      </svg>
      <div className="diagram-stack at-1">
        <div>Funneling</div>
        <div>Structuring</div>
        <div>PII changes</div>
        <div>Behavioral changes</div>
        <div>Velocity attacks</div>
      </div>
      <div className="diagram-arrow">→</div>
      <div className="diagram-stack at-2 compact">
        <div className="alert-on">Compliance alert</div>
        <div>Fraud alert</div>
        <div>Grouped low-signal noise</div>
      </div>
    </div>
  );
}

function WatchlistDiagram() {
  return (
    <div className="diagram-surface">
      <svg viewBox="0 0 100 100" className="diagram-svg" aria-hidden="true">
        <path d="M28 26 H54" className="diagram-line" />
        <path d="M28 74 H54" className="diagram-line" />
        <path d="M64 20 H82 V34" className="diagram-line" />
        <path d="M64 80 H82 V66" className="diagram-line" />
        <path d="M54 50 H64" className="diagram-line" />
        <path d="M64 50 H82 V50" className="diagram-line" />
      </svg>
      <div className="diagram-box at-1">PEP lists</div>
      <div className="diagram-box at-2">Adverse media</div>
      <div className="diagram-card at-3">
        <span>Customer profile</span>
      </div>
      <div className="diagram-box at-4">Global sanctions</div>
      <div className="diagram-box at-5">US sanctions</div>
    </div>
  );
}

function ScenarioDiagram({ scenarioId }: { scenarioId: (typeof SCENARIOS)[number]["id"] }) {
  switch (scenarioId) {
    case "origination":
      return <OriginationDiagram />;
    case "kyb":
      return <JourneyDiagram />;
    case "monitoring":
      return <MonitoringDiagram />;
    case "watchlist":
      return <WatchlistDiagram />;
    default:
      return null;
  }
}

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState<(typeof SCENARIOS)[number]["id"]>(SCENARIOS[0].id);
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[0].caseId);

  const activeScenario = useMemo(
    () => SCENARIOS.find((scenario) => scenario.id === activeScenarioId) ?? SCENARIOS[0],
    [activeScenarioId]
  );

  const activeCase = useMemo(
    () => EVALUATIONS.find((entry) => entry.caseItem.id === selectedId) ?? EVALUATIONS[0],
    [selectedId]
  );

  const summaryItems = [
    { label: "Program area", value: activeCase.caseItem.programArea },
    { label: "Typology", value: activeCase.caseItem.typology },
    { label: "Customer risk", value: formatPercent(activeCase.caseItem.fraudScore) },
    { label: "Watchlist similarity", value: formatPercent(activeCase.caseItem.sanctionsMatch) },
    { label: "Identity confidence", value: formatPercent(activeCase.caseItem.identityConfidence) },
    { label: "Policy hits", value: String(activeCase.recommendation.triggeredRules.length) }
  ];

  const auditItems = [
    { label: "Recommended next step", value: ACTION_LABELS[activeCase.recommendation.action] },
    { label: "Program area", value: activeCase.caseItem.programArea },
    { label: "Typology", value: activeCase.caseItem.typology },
    { label: "Policy version", value: "2026.03" },
    { label: "Replay seed", value: "synthetic-case-pack-v1" }
  ];

  return (
    <main className="showcase">
      <div className="page-bar">
        <strong>CaseTrace</strong>
        <span>Neurosymbolic research rig for identity risk, onboarding, watchlist screening, and ongoing monitoring</span>
      </div>

      <section className="intro-grid">
        <div className="intro-copy">
          <h1>Novel neurosymbolic infrastructure for fraud and compliance review.</h1>
          <p>
            This is not a product shell. It is a place to test whether a better combination of neural pattern finding,
            symbolic policy verification, counterfactual reasoning, and action-ready review packets can make origination,
            business onboarding, watchlist screening, case management, and ongoing monitoring materially better.
          </p>
          <ul className="typology-list">
            {TYPOLOGIES.map((typology) => (
              <li key={typology}>{typology}</li>
            ))}
          </ul>
        </div>
        <IntroMap />
      </section>

      <section className="scenario-section">
        <div className="section-header">
          <h2>Research surfaces</h2>
          <p>
            The page uses the language of origination, customer-level risk, business onboarding, watchlist screening,
            ongoing monitoring, and manual review because those are the workflows we are trying to improve.
          </p>
        </div>

        <div className="scenario-tabs">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className={classNames("scenario-tab", scenario.id === activeScenario.id && "scenario-tab-active")}
              onClick={() => {
                setActiveScenarioId(scenario.id);
                startTransition(() => setSelectedId(scenario.caseId));
              }}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        <div className="scenario-frame">
          <div className={classNames("scenario-copy", `scenario-${activeScenario.theme}`)}>
            <h3>{activeScenario.title}</h3>
            <p>{activeScenario.description}</p>
            <ul>
              {activeScenario.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className="scenario-visual">
            <ScenarioDiagram scenarioId={activeScenario.id} />
          </div>
        </div>
      </section>

      <section className="lab-section">
        <div className="section-header">
          <h2>Live case lab</h2>
          <p>
            Pick a synthetic case and inspect the packet the neurosymbolic layer would hand to a fraud, AML, or risk
            operations team.
          </p>
        </div>

        <div className="lab-grid">
          <aside className="queue-panel">
            <div className="queue-head">
              <h3>Case pack</h3>
              <span>{EVALUATIONS.length} scenarios</span>
            </div>
            <div className="queue-list">
              {EVALUATIONS.map(({ caseItem, recommendation }) => (
                <button
                  key={caseItem.id}
                  type="button"
                  className={classNames("queue-item", caseItem.id === activeCase.caseItem.id && "queue-item-active")}
                  onClick={() => setSelectedId(caseItem.id)}
                >
                  <div className="queue-item-top">
                    <strong>{caseItem.title}</strong>
                    <span>{caseItem.programArea}</span>
                  </div>
                  <p>{caseItem.typology}</p>
                  <div className="queue-item-bottom">
                    <strong>{ACTION_LABELS[recommendation.action]}</strong>
                    <span>{Math.round(recommendation.confidenceScore * 100)} score</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div className="lab-main">
            <div className="lab-header">
              <div>
                <h3>{activeCase.caseItem.title}</h3>
                <p>{toSentenceCase(activeCase.caseItem.storyline)}.</p>
              </div>
              <div className="lab-note">
                <span>{activeCase.caseItem.programArea}</span>
                <span>{activeCase.caseItem.typology}</span>
              </div>
            </div>

            <div className="summary-strip">
              {summaryItems.map((item) => (
                <div key={item.label} className="summary-cell">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="lab-columns">
              <section className="block">
                <div className="section-row">
                  <h3>Evidence</h3>
                  <span>{activeCase.caseItem.facts.length} source-backed facts</span>
                </div>
                <div className="evidence-table">
                  <div className="evidence-head">
                    <span>Signal</span>
                    <span>Observed pattern</span>
                    <span>Source</span>
                    <span>Effect</span>
                  </div>
                  {activeCase.caseItem.facts.map((fact) => (
                    <div key={fact.id} className="evidence-row">
                      <div>
                        <strong>{fact.title}</strong>
                        <span>{fact.id}</span>
                      </div>
                      <p>{fact.value}</p>
                      <span>{fact.source}</span>
                      <span className={classNames("impact-tag", `impact-${fact.impact}`)}>{fact.impact}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="block">
                <div className="section-row">
                  <h3>Entity graph</h3>
                  <span>Signals that shaped the packet</span>
                </div>
                <div className="graph-frame">
                  <svg viewBox="0 0 100 100" className="graph-lines" aria-hidden="true">
                    {activeCase.caseItem.edges.map((edge) => {
                      const source = activeCase.caseItem.nodes.find((node) => node.id === edge.source);
                      const target = activeCase.caseItem.nodes.find((node) => node.id === edge.target);

                      if (!source || !target) {
                        return null;
                      }

                      return (
                        <g key={edge.id}>
                          <line
                            className={classNames("graph-line", `graph-line-${edge.severity}`)}
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                          />
                          <text className="graph-label" x={(source.x + target.x) / 2} y={(source.y + target.y) / 2}>
                            {edge.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  {activeCase.caseItem.nodes.map((node) => (
                    <NodeBubble key={node.id} node={node} active={node.kind === "watchlist" || node.kind === "device"} />
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="packet-panel">
            <section className="block">
              <div className="section-row">
                <h3>Question under test</h3>
                <span>Human review stays in control</span>
              </div>
              <p className="packet-question">{activeCase.caseItem.analystPrompt}</p>
            </section>

            <section className="block">
              <div className="section-row">
                <h3>Recommendation packet</h3>
                <span>{activeCase.recommendation.confidenceLabel}</span>
              </div>
              <div className="decision-title">{ACTION_LABELS[activeCase.recommendation.action]}</div>
              <div className="decision-copy">
                {activeCase.recommendation.narrative.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>

            <section className="block">
              <div className="section-row">
                <h3>Policy checks</h3>
                <span>{activeCase.recommendation.triggeredRules.length} hits</span>
              </div>
              <div className="rule-list">
                {activeCase.recommendation.triggeredRules.map((rule) => (
                  <article key={rule.id} className={classNames("rule-item", `rule-${rule.severity}`)}>
                    <strong>{rule.label}</strong>
                    <p>{rule.rationale}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="block">
              <div className="section-row">
                <h3>What changes the outcome</h3>
                <span>Counterfactual lane</span>
              </div>
              <div className="counterfactual-list">
                {activeCase.recommendation.counterfactuals.map((counterfactual) => (
                  <div key={counterfactual.title} className="counterfactual-row">
                    <strong>{counterfactual.title}</strong>
                    <span>{ACTION_LABELS[counterfactual.outcome]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="block">
              <div className="section-row">
                <h3>Audit packet</h3>
                <span>Replay-ready output</span>
              </div>
              <div className="audit-list">
                {auditItems.map((item) => (
                  <div key={item.label} className="audit-row">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>

      <section className="validation-section">
        <div className="section-header">
          <h2>Validation and proof loop</h2>
          <p>
            The testbed only works if the recommendation is reproducible, grounded in evidence, and easy to challenge.
          </p>
        </div>
        <div className="validation-grid">
          {VALIDATION_SIGNALS.map((signal) => (
            <div key={signal.title} className="validation-card">
              <div className="validation-top">
                <strong>{signal.title}</strong>
                <span className={classNames("status-tag", signal.status === "pass" ? "status-pass" : "status-watch")}>
                  {signal.status}
                </span>
              </div>
              <p>{signal.metric}</p>
              <small>{signal.note}</small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
