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

export default function Home() {
  const [selectedId, setSelectedId] = useState(EVALUATIONS[0].caseItem.id);
  const activeCase = useMemo(
    () => EVALUATIONS.find((entry) => entry.caseItem.id === selectedId) ?? EVALUATIONS[0],
    [selectedId]
  );
  const summaryItems = [
    { label: "Review type", value: activeCase.caseItem.reviewType },
    { label: "Jurisdiction", value: activeCase.caseItem.jurisdiction },
    { label: "Risk score", value: formatPercent(activeCase.caseItem.fraudScore) },
    { label: "Identity confidence", value: formatPercent(activeCase.caseItem.identityConfidence) },
    { label: "Watchlist similarity", value: formatPercent(activeCase.caseItem.sanctionsMatch) },
    { label: "Policy hits", value: String(activeCase.recommendation.triggeredRules.length) }
  ];
  const auditItems = [
    { label: "Case id", value: activeCase.caseItem.id },
    { label: "Analyst action", value: ACTION_LABELS[activeCase.recommendation.action] },
    { label: "Model score", value: formatPercent(activeCase.caseItem.fraudScore) },
    { label: "Policy version", value: "2026.03" },
    { label: "Replay seed", value: "synthetic-case-pack-v1" }
  ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div>
            <strong>CaseTrace</strong>
            <p>Human-reviewed onboarding and watchlist cases</p>
          </div>
          <span>{DASHBOARD_STATS.casesInQueue} open</span>
        </div>

        <div className="queue-summary">
          <div>
            <span>Audit coverage</span>
            <strong>{DASHBOARD_STATS.auditCoverage}</strong>
          </div>
          <div>
            <span>Escalation rate</span>
            <strong>{DASHBOARD_STATS.escalationRate}</strong>
          </div>
          <div>
            <span>False positives cleared</span>
            <strong>{DASHBOARD_STATS.clearableFalsePositives}</strong>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-row">
            <h2>Queue</h2>
            <span>Synthetic data pack</span>
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
                  <span className={classNames("priority-badge", `priority-${caseItem.priority}`)}>{caseItem.priority}</span>
                </div>
                <p>
                  {caseItem.reviewType} · {caseItem.jurisdiction}
                </p>
                <div className="queue-item-bottom">
                  <strong>{ACTION_LABELS[recommendation.action]}</strong>
                  <span>{Math.round(recommendation.confidenceScore * 100)} score</span>
                </div>
                <div className="queue-tags">
                  {caseItem.queueBadges.map((badge) => (
                    <span key={badge}>{BADGE_LABELS[badge]}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="main-shell">
        <header className="topbar">
          <div>
            <h1>{activeCase.caseItem.title}</h1>
            <p>{toSentenceCase(activeCase.caseItem.storyline)}.</p>
          </div>
          <div className="topbar-note">
            <span>Case {activeCase.caseItem.id}</span>
            <span>Recommendation is advisory</span>
          </div>
        </header>

        <section className="summary-strip">
          {summaryItems.map((item) => (
            <div key={item.label} className="summary-cell">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="workspace-grid">
          <div className="primary-column">
            <section className="block">
              <div className="section-row">
                <h2>Evidence</h2>
                <span>{activeCase.caseItem.facts.length} source-backed facts</span>
              </div>
              <div className="evidence-table">
                <div className="evidence-head">
                  <span>Fact</span>
                  <span>Finding</span>
                  <span>Source</span>
                  <span>Impact</span>
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
                <h2>Relationships</h2>
                <span>Linked entities that shaped the recommendation</span>
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

            <section className="block">
              <div className="section-row">
                <h2>Validation</h2>
                <span>Replay and explanation checks for the demo pack</span>
              </div>
              <div className="validation-table">
                {VALIDATION_SIGNALS.map((signal) => (
                  <div key={signal.title} className="validation-row">
                    <strong>{signal.title}</strong>
                    <span className={classNames("status-tag", signal.status === "pass" ? "status-pass" : "status-watch")}>
                      {signal.status}
                    </span>
                    <p>{signal.metric}</p>
                    <small>{signal.note}</small>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="decision-rail">
            <section className="block decision-block">
              <div className="section-row">
                <h2>Recommendation</h2>
                <span>{activeCase.recommendation.confidenceLabel}</span>
              </div>
              <div className="decision-title">{ACTION_LABELS[activeCase.recommendation.action]}</div>
              <p className="decision-summary">{activeCase.recommendation.narrative[0]}</p>
              <div className="decision-actions">
                {Object.entries(ACTION_LABELS).map(([action, label]) => (
                  <button
                    key={action}
                    type="button"
                    className={classNames("decision-action", action === activeCase.recommendation.action && "decision-action-active")}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="supporting-facts">
                {activeCase.recommendation.supportingFacts.map((fact) => (
                  <div key={fact.id} className="supporting-fact">
                    <span>{fact.id}</span>
                    <p>{fact.title}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="block">
              <div className="section-row">
                <h2>Policy checks</h2>
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
                <h2>What changes the outcome</h2>
                <span>Bounded counterfactuals</span>
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
                <h2>Audit packet</h2>
                <span>Replay-ready record</span>
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
        </section>
      </section>
    </main>
  );
}
