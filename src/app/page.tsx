"use client";

import { useMemo, useState } from "react";
import { DASHBOARD_STATS, EVALUATIONS, VALIDATION_SIGNALS } from "@/lib/cases";
import { DecisionAction, EntityNode, QueueBadge } from "@/lib/types";

const BADGE_LABELS: Record<QueueBadge, string> = {
  identity: "Identity",
  watchlist: "Watchlist",
  ownership: "Ownership",
  device: "Device",
  velocity: "Velocity",
  docs: "Docs"
};

const ACTION_LABELS: Record<DecisionAction, string> = {
  approve: "Approve",
  escalate_review: "Escalate review",
  request_docs: "Request docs",
  clear_false_positive: "Clear false positive"
};

function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
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

export default function Home() {
  const [selectedId, setSelectedId] = useState(EVALUATIONS[0].caseItem.id);
  const [panel, setPanel] = useState<"recommendation" | "audit">("recommendation");
  const activeCase = useMemo(
    () => EVALUATIONS.find((entry) => entry.caseItem.id === selectedId) ?? EVALUATIONS[0],
    [selectedId]
  );

  return (
    <main className="shell">
      <section className="hero card">
        <div className="hero-copy">
          <p className="eyebrow">CaseTrace</p>
          <h1>Evidence-backed fraud and compliance reviews built for human approval.</h1>
          <p className="hero-text">
            A visual workspace for turning messy onboarding and watchlist cases into recommendations, rule traces,
            counterfactuals, and audit-ready packets without letting AI make the final call.
          </p>
          <div className="hero-stats">
            <div>
              <span>{DASHBOARD_STATS.casesInQueue}</span>
              <p>Seeded demo cases</p>
            </div>
            <div>
              <span>{DASHBOARD_STATS.auditCoverage}</span>
              <p>Audit coverage</p>
            </div>
            <div>
              <span>{DASHBOARD_STATS.escalationRate}</span>
              <p>Escalation rate</p>
            </div>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="signal-column">
            <span>Identity</span>
            <span>Watchlist</span>
            <span>Registry</span>
            <span>Device</span>
          </div>
          <div className="signal-beam" />
          <div className="decision-stack">
            <div>
              <strong>Facts</strong>
              <p>Normalized evidence ledger</p>
            </div>
            <div>
              <strong>Rules</strong>
              <p>Deterministic policy trace</p>
            </div>
            <div>
              <strong>Recommendation</strong>
              <p>Human-approved next step</p>
            </div>
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="card queue-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Review queue</p>
              <h2>Priority cases</h2>
            </div>
            <span className="subtle">Synthetic demo data</span>
          </div>

          <div className="queue-list">
            {EVALUATIONS.map(({ caseItem, recommendation }) => (
              <button
                key={caseItem.id}
                type="button"
                className={classNames("queue-item", caseItem.id === activeCase.caseItem.id && "queue-item-active")}
                onClick={() => setSelectedId(caseItem.id)}
              >
                <div className="queue-item-head">
                  <div>
                    <p>{caseItem.title}</p>
                    <span>
                      {caseItem.reviewType} · {caseItem.jurisdiction}
                    </span>
                  </div>
                  <span className={classNames("pill", `pill-${caseItem.priority}`)}>{caseItem.priority}</span>
                </div>
                <div className="queue-item-meta">
                  <strong>{ACTION_LABELS[recommendation.action]}</strong>
                  <span>{Math.round(recommendation.confidenceScore * 100)} confidence score</span>
                </div>
                <div className="badge-row">
                  {caseItem.queueBadges.map((badge) => (
                    <span key={badge} className="chip">
                      {BADGE_LABELS[badge]}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="card workspace-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Case workspace</p>
              <h2>{activeCase.caseItem.title}</h2>
            </div>
            <div className="workspace-tags">
              <span className="chip">{activeCase.caseItem.reviewType}</span>
              <span className="chip">{activeCase.caseItem.analystPrompt}</span>
            </div>
          </div>

          <div className="workspace-columns">
            <div className="evidence-column">
              <h3>Evidence timeline</h3>
              <div className="fact-list">
                {activeCase.caseItem.facts.map((fact) => (
                  <article key={fact.id} className={classNames("fact-card", `fact-${fact.impact}`)}>
                    <div className="fact-head">
                      <strong>{fact.title}</strong>
                      <span>{fact.id}</span>
                    </div>
                    <p>{fact.value}</p>
                    <small>{fact.source}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="graph-column">
              <div className="graph-head">
                <h3>Entity graph</h3>
                <p>Suspicious links pulse brighter as rule severity increases.</p>
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
                        <text
                          className="graph-label"
                          x={(source.x + target.x) / 2}
                          y={(source.y + target.y) / 2}
                        >
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
            </div>

            <div className="recommendation-column">
              <div className="panel-toggle">
                <button
                  type="button"
                  className={classNames(panel === "recommendation" && "toggle-active")}
                  onClick={() => setPanel("recommendation")}
                >
                  Recommendation
                </button>
                <button
                  type="button"
                  className={classNames(panel === "audit" && "toggle-active")}
                  onClick={() => setPanel("audit")}
                >
                  Audit packet
                </button>
              </div>

              {panel === "recommendation" ? (
                <div className="recommendation-card">
                  <p className="eyebrow">Suggested action</p>
                  <h3>{ACTION_LABELS[activeCase.recommendation.action]}</h3>
                  <div className="confidence-row">
                    <strong>{activeCase.recommendation.confidenceLabel}</strong>
                    <span>{Math.round(activeCase.recommendation.confidenceScore * 100)} / 100</span>
                  </div>
                  <div className="narrative-list">
                    {activeCase.recommendation.narrative.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>

                  <div className="subsection">
                    <h4>Triggered policy checks</h4>
                    {activeCase.recommendation.triggeredRules.map((rule) => (
                      <article key={rule.id} className={classNames("rule-card", `rule-${rule.severity}`)}>
                        <strong>{rule.label}</strong>
                        <p>{rule.rationale}</p>
                      </article>
                    ))}
                  </div>

                  <div className="subsection">
                    <h4>Top cited facts</h4>
                    <div className="supporting-list">
                      {activeCase.recommendation.supportingFacts.map((fact) => (
                        <div key={fact.id} className="supporting-card">
                          <span>{fact.id}</span>
                          <p>{fact.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="subsection">
                    <h4>What would change the outcome?</h4>
                    {activeCase.recommendation.counterfactuals.map((counterfactual) => (
                      <div key={counterfactual.title} className="counterfactual-card">
                        <strong>{counterfactual.title}</strong>
                        <span>{ACTION_LABELS[counterfactual.outcome]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="audit-card">
                  <p className="eyebrow">Audit packet</p>
                  <h3>Replay-ready decision record</h3>
                  <div className="audit-grid">
                    <div>
                      <span>Case ID</span>
                      <p>{activeCase.caseItem.id}</p>
                    </div>
                    <div>
                      <span>Model score</span>
                      <p>{Math.round(activeCase.caseItem.fraudScore * 100)}%</p>
                    </div>
                    <div>
                      <span>Policy hits</span>
                      <p>{activeCase.recommendation.triggeredRules.length}</p>
                    </div>
                    <div>
                      <span>Human action</span>
                      <p>{ACTION_LABELS[activeCase.recommendation.action]}</p>
                    </div>
                  </div>
                  <div className="audit-log">
                    <div>
                      <strong>Provenance</strong>
                      <p>Every recommendation sentence is grounded in source-tagged facts from registry, watchlist, identity, and device checks.</p>
                    </div>
                    <div>
                      <strong>Versioning</strong>
                      <p>Model v0.1 · Ruleset 2026.03 · Synthetic case pack seeded for deterministic replay.</p>
                    </div>
                    <div>
                      <strong>Override support</strong>
                      <p>Analysts can approve, escalate, request docs, or clear a false positive with a reason attached to the case history.</p>
                    </div>
                  </div>
                  <div className="audit-facts">
                    {activeCase.caseItem.facts.map((fact) => (
                      <div key={fact.id} className="audit-fact-row">
                        <span>{fact.id}</span>
                        <p>
                          {fact.title} · {fact.source}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>

      <section className="validation-grid">
        <div className="card validation-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Validation loop</p>
              <h2>Ship the proof, not just the pitch</h2>
            </div>
            <span className="subtle">Synthetic data + deterministic replay</span>
          </div>
          <div className="validation-list">
            {VALIDATION_SIGNALS.map((signal) => (
              <article key={signal.title} className="validation-card">
                <div className="validation-head">
                  <strong>{signal.title}</strong>
                  <span className={classNames("status-dot", signal.status === "pass" ? "status-pass" : "status-watch")}>
                    {signal.status}
                  </span>
                </div>
                <p>{signal.metric}</p>
                <small>{signal.note}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Demo storyboard</p>
              <h2>Ready for a short visual walkthrough</h2>
            </div>
          </div>
          <ol className="storyboard">
            <li>Start on the queue and open a red-flag business onboarding case with a watchlist near-match.</li>
            <li>Let the entity graph pulse while the evidence timeline highlights the facts driving the recommendation.</li>
            <li>Show the recommendation panel building its rule trace and counterfactual next steps in real time.</li>
            <li>Switch to the audit packet to prove provenance, replayability, and human-control over the final action.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
