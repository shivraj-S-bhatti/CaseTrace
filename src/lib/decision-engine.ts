import {
  CaseTemplate,
  Counterfactual,
  DecisionAction,
  Recommendation,
  TriggeredRule
} from "@/lib/types";

const ACTION_LABEL: Record<DecisionAction, string> = {
  approve: "Approve",
  escalate_review: "Escalate for manual review",
  request_docs: "Request additional documents",
  clear_false_positive: "Clear as false positive"
};

function buildRules(caseItem: CaseTemplate): TriggeredRule[] {
  const rules: TriggeredRule[] = [];

  if (caseItem.sanctionsMatch >= 0.7) {
    rules.push({
      id: "rule-watchlist-close-match",
      label: "Close watchlist match requires escalation",
      rationale: "A high-confidence watchlist hit must stay human-reviewed until cleared.",
      severity: "high"
    });
  }

  if (caseItem.registryMismatch) {
    rules.push({
      id: "rule-registry-mismatch",
      label: "Registry inconsistency blocks auto-approval",
      rationale: "Submitted ownership details do not fully match external registry data.",
      severity: "medium"
    });
  }

  if (caseItem.deviceLinkCount >= 3 || caseItem.velocityAnomaly) {
    rules.push({
      id: "rule-linked-device",
      label: "Linked device and velocity spike require review",
      rationale: "The same device appears across multiple entities during a short review window.",
      severity: "medium"
    });
  }

  if (!caseItem.documentsVerified || caseItem.identityConfidence < 0.58) {
    rules.push({
      id: "rule-low-identity-confidence",
      label: "Identity confidence below safe threshold",
      rationale: "Incomplete or weak identity evidence requires a step-up check.",
      severity: "medium"
    });
  }

  if (caseItem.falsePositiveEvidence) {
    rules.push({
      id: "rule-false-positive-evidence",
      label: "Counter-evidence supports safe downgrade",
      rationale: "Matched identifiers diverge on date of birth, registration data, or sanctions alias details.",
      severity: "low"
    });
  }

  return rules;
}

function chooseAction(caseItem: CaseTemplate, rules: TriggeredRule[]): DecisionAction {
  if (caseItem.falsePositiveEvidence && caseItem.sanctionsMatch < 0.45) {
    return "clear_false_positive";
  }

  if (caseItem.sanctionsMatch >= 0.7) {
    return "escalate_review";
  }

  if (caseItem.registryMismatch && !caseItem.documentsVerified) {
    return "request_docs";
  }

  if (caseItem.fraudScore >= 0.75 || rules.some((rule) => rule.id === "rule-linked-device")) {
    return "escalate_review";
  }

  if (caseItem.identityConfidence < 0.62 || !caseItem.documentsVerified) {
    return "request_docs";
  }

  return "approve";
}

function buildCounterfactuals(caseItem: CaseTemplate, action: DecisionAction): Counterfactual[] {
  const counterfactuals: Counterfactual[] = [];

  if (caseItem.sanctionsMatch >= 0.7) {
    counterfactuals.push({
      title: "Clear the watchlist close match with analyst-confirmed identity evidence.",
      outcome: caseItem.registryMismatch ? "request_docs" : "approve"
    });
  }

  if (caseItem.registryMismatch || !caseItem.documentsVerified) {
    counterfactuals.push({
      title: "Confirm registry ownership details and re-verify supporting documents.",
      outcome: caseItem.sanctionsMatch >= 0.7 ? "escalate_review" : "approve"
    });
  }

  if (action === "escalate_review" && caseItem.deviceLinkCount >= 3) {
    counterfactuals.push({
      title: "Separate the shared device cluster or verify the shared operator is legitimate.",
      outcome: "request_docs"
    });
  }

  if (action === "clear_false_positive") {
    counterfactuals.push({
      title: "If the divergent identifiers disappear, keep the case in analyst review.",
      outcome: "escalate_review"
    });
  }

  return counterfactuals.slice(0, 2);
}

export function evaluateCase(caseItem: CaseTemplate): Recommendation {
  const triggeredRules = buildRules(caseItem);
  const action = chooseAction(caseItem, triggeredRules);
  const confidenceScore = Number(
    (
      caseItem.fraudScore * 0.45 +
      (1 - caseItem.identityConfidence) * 0.2 +
      caseItem.sanctionsMatch * 0.25 +
      Math.min(caseItem.deviceLinkCount / 5, 1) * 0.1
    ).toFixed(2)
  );

  const confidenceLabel =
    confidenceScore >= 0.78 ? "High confidence" : confidenceScore >= 0.58 ? "Moderate confidence" : "Needs more evidence";

  const supportingFacts = caseItem.facts
    .filter((fact) => fact.impact !== "neutral")
    .slice(0, 4);

  const narrative = [
    `${ACTION_LABEL[action]} is recommended because ${caseItem.storyline.toLowerCase()}.`,
    `The case combines a model risk score of ${Math.round(caseItem.fraudScore * 100)}% with ${triggeredRules.length} deterministic policy hits.`,
    `The recommendation is grounded in cited evidence only and is intended for human approval, not autonomous execution.`
  ];

  return {
    action,
    confidenceLabel,
    confidenceScore,
    narrative,
    supportingFacts,
    triggeredRules,
    counterfactuals: buildCounterfactuals(caseItem, action)
  };
}
