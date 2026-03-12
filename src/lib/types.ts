export type QueueBadge =
  | "identity"
  | "watchlist"
  | "ownership"
  | "device"
  | "velocity"
  | "docs";

export type DecisionAction =
  | "approve"
  | "escalate_review"
  | "request_docs"
  | "clear_false_positive";

export type EvidenceFact = {
  id: string;
  title: string;
  value: string;
  source: string;
  impact: "positive" | "neutral" | "negative";
};

export type EntityNode = {
  id: string;
  label: string;
  kind: "business" | "person" | "device" | "bank" | "watchlist" | "document";
  x: number;
  y: number;
};

export type EntityEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  severity: "low" | "medium" | "high";
};

export type CaseTemplate = {
  id: string;
  title: string;
  applicant: string;
  programArea: string;
  typology: string;
  jurisdiction: string;
  storyline: string;
  reviewType: string;
  priority: "low" | "medium" | "high";
  queueBadges: QueueBadge[];
  fraudScore: number;
  identityConfidence: number;
  sanctionsMatch: number;
  registryMismatch: boolean;
  deviceLinkCount: number;
  ownershipDepth: number;
  documentsVerified: boolean;
  falsePositiveEvidence: boolean;
  velocityAnomaly: boolean;
  analystPrompt: string;
  facts: EvidenceFact[];
  nodes: EntityNode[];
  edges: EntityEdge[];
};

export type TriggeredRule = {
  id: string;
  label: string;
  rationale: string;
  severity: "low" | "medium" | "high";
};

export type Counterfactual = {
  title: string;
  outcome: DecisionAction;
};

export type Recommendation = {
  action: DecisionAction;
  confidenceLabel: string;
  confidenceScore: number;
  narrative: string[];
  supportingFacts: EvidenceFact[];
  triggeredRules: TriggeredRule[];
  counterfactuals: Counterfactual[];
};

export type ValidationSignal = {
  title: string;
  status: "pass" | "watch";
  metric: string;
  note: string;
};
