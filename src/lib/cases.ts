import { evaluateCase } from "@/lib/decision-engine";
import { CaseTemplate, ValidationSignal } from "@/lib/types";

export const CASES: CaseTemplate[] = [
  {
    id: "ct-001",
    title: "Northstar Imports LLC",
    applicant: "Northstar Imports LLC",
    programArea: "Watchlist screening",
    typology: "Close-match sanctions alert",
    jurisdiction: "Delaware, US",
    storyline: "a beneficial owner is a close watchlist match and registry ownership is incomplete",
    reviewType: "Business onboarding",
    priority: "high",
    queueBadges: ["watchlist", "ownership", "docs"],
    fraudScore: 0.82,
    identityConfidence: 0.46,
    sanctionsMatch: 0.78,
    registryMismatch: true,
    deviceLinkCount: 2,
    ownershipDepth: 4,
    documentsVerified: false,
    falsePositiveEvidence: false,
    velocityAnomaly: false,
    analystPrompt: "Escalate this case only if the sanctions ambiguity survives registry and document review.",
    facts: [
      { id: "f-101", title: "Beneficial owner alias match", value: "0.78 watchlist similarity", source: "Dow Jones", impact: "negative" },
      { id: "f-102", title: "Registry mismatch", value: "1 owner missing from filing", source: "OpenCorporates", impact: "negative" },
      { id: "f-103", title: "Document verification", value: "Passport scan pending", source: "Persona", impact: "negative" },
      { id: "f-104", title: "Business age", value: "Registered 18 months ago", source: "Secretary of State", impact: "neutral" }
    ],
    nodes: [
      { id: "biz", label: "Northstar Imports", kind: "business", x: 48, y: 42 },
      { id: "owner-a", label: "A. Petrov", kind: "person", x: 20, y: 20 },
      { id: "owner-b", label: "J. Lee", kind: "person", x: 78, y: 22 },
      { id: "watch", label: "Watchlist hit", kind: "watchlist", x: 16, y: 76 },
      { id: "doc", label: "Pending docs", kind: "document", x: 82, y: 72 }
    ],
    edges: [
      { id: "e-1", source: "owner-a", target: "biz", label: "51% UBO", severity: "high" },
      { id: "e-2", source: "owner-b", target: "biz", label: "49% UBO", severity: "low" },
      { id: "e-3", source: "owner-a", target: "watch", label: "Alias overlap", severity: "high" },
      { id: "e-4", source: "doc", target: "biz", label: "Verification pending", severity: "medium" }
    ]
  },
  {
    id: "ct-002",
    title: "Harborline Payments",
    applicant: "Harborline Payments",
    programArea: "Origination",
    typology: "Coordinated onboarding attack",
    jurisdiction: "New York, US",
    storyline: "a shared device cluster and bursty submissions point to mule-style coordination",
    reviewType: "Business onboarding",
    priority: "high",
    queueBadges: ["device", "velocity", "ownership"],
    fraudScore: 0.88,
    identityConfidence: 0.67,
    sanctionsMatch: 0.18,
    registryMismatch: false,
    deviceLinkCount: 4,
    ownershipDepth: 3,
    documentsVerified: true,
    falsePositiveEvidence: false,
    velocityAnomaly: true,
    analystPrompt: "Show why this is suspicious even without a watchlist hit.",
    facts: [
      { id: "f-201", title: "Shared device", value: "4 entities in 48 hours", source: "FingerprintJS", impact: "negative" },
      { id: "f-202", title: "Velocity spike", value: "6 high-risk applications in 1 hour", source: "Event stream", impact: "negative" },
      { id: "f-203", title: "Document verification", value: "Docs passed", source: "Persona", impact: "positive" },
      { id: "f-204", title: "Corporate filing", value: "Registry match confirmed", source: "OpenCorporates", impact: "positive" }
    ],
    nodes: [
      { id: "biz", label: "Harborline Payments", kind: "business", x: 48, y: 42 },
      { id: "device", label: "Shared device", kind: "device", x: 20, y: 68 },
      { id: "operator", label: "Applicant", kind: "person", x: 24, y: 18 },
      { id: "bank", label: "Linked beneficiary", kind: "bank", x: 78, y: 24 },
      { id: "doc", label: "Verified docs", kind: "document", x: 78, y: 72 }
    ],
    edges: [
      { id: "e-5", source: "operator", target: "biz", label: "Filed application", severity: "medium" },
      { id: "e-6", source: "device", target: "operator", label: "Clustered activity", severity: "high" },
      { id: "e-7", source: "biz", target: "bank", label: "Beneficiary route", severity: "medium" },
      { id: "e-8", source: "doc", target: "biz", label: "Evidence verified", severity: "low" }
    ]
  },
  {
    id: "ct-003",
    title: "Blue Cedar Advisory",
    applicant: "Blue Cedar Advisory",
    programArea: "Onboarding remediation",
    typology: "Recoverable identity friction",
    jurisdiction: "Texas, US",
    storyline: "the business is clean but identity confidence is weak and supporting documents are incomplete",
    reviewType: "Business onboarding",
    priority: "medium",
    queueBadges: ["identity", "docs"],
    fraudScore: 0.54,
    identityConfidence: 0.49,
    sanctionsMatch: 0.12,
    registryMismatch: false,
    deviceLinkCount: 1,
    ownershipDepth: 2,
    documentsVerified: false,
    falsePositiveEvidence: false,
    velocityAnomaly: false,
    analystPrompt: "Keep this case recoverable rather than punitive.",
    facts: [
      { id: "f-301", title: "Owner DOB mismatch", value: "Manual entry differs from document", source: "Persona", impact: "negative" },
      { id: "f-302", title: "Registry match", value: "Entity details confirmed", source: "OpenCorporates", impact: "positive" },
      { id: "f-303", title: "Watchlist screening", value: "No material hit", source: "Dow Jones", impact: "positive" },
      { id: "f-304", title: "Proof of address", value: "Missing utility bill", source: "Upload portal", impact: "negative" }
    ],
    nodes: [
      { id: "biz", label: "Blue Cedar", kind: "business", x: 48, y: 42 },
      { id: "owner", label: "R. Gomez", kind: "person", x: 24, y: 22 },
      { id: "doc", label: "Address proof", kind: "document", x: 80, y: 64 }
    ],
    edges: [
      { id: "e-9", source: "owner", target: "biz", label: "Managing member", severity: "low" },
      { id: "e-10", source: "doc", target: "owner", label: "Pending upload", severity: "medium" }
    ]
  },
  {
    id: "ct-004",
    title: "Astra Freight",
    applicant: "Astra Freight",
    programArea: "Business onboarding",
    typology: "Clean approval",
    jurisdiction: "Florida, US",
    storyline: "all high-risk signals clear and the case is supported by stable documents and registry data",
    reviewType: "Business onboarding",
    priority: "low",
    queueBadges: ["identity"],
    fraudScore: 0.18,
    identityConfidence: 0.91,
    sanctionsMatch: 0.05,
    registryMismatch: false,
    deviceLinkCount: 1,
    ownershipDepth: 2,
    documentsVerified: true,
    falsePositiveEvidence: false,
    velocityAnomaly: false,
    analystPrompt: "Show what a healthy approval packet looks like.",
    facts: [
      { id: "f-401", title: "Registry confirmation", value: "Business and owners match filings", source: "OpenCorporates", impact: "positive" },
      { id: "f-402", title: "Document verification", value: "Pass", source: "Persona", impact: "positive" },
      { id: "f-403", title: "Watchlist screening", value: "No material hit", source: "Dow Jones", impact: "positive" },
      { id: "f-404", title: "Device activity", value: "Single known device", source: "FingerprintJS", impact: "neutral" }
    ],
    nodes: [
      { id: "biz", label: "Astra Freight", kind: "business", x: 48, y: 42 },
      { id: "owner", label: "S. Martin", kind: "person", x: 28, y: 18 },
      { id: "doc", label: "Verified docs", kind: "document", x: 76, y: 66 }
    ],
    edges: [
      { id: "e-11", source: "owner", target: "biz", label: "UBO", severity: "low" },
      { id: "e-12", source: "doc", target: "biz", label: "Complete file", severity: "low" }
    ]
  },
  {
    id: "ct-005",
    title: "Mira Santos",
    applicant: "Mira Santos",
    programArea: "Watchlist screening",
    typology: "False-positive clearance",
    jurisdiction: "California, US",
    storyline: "a sanctions near-match is likely benign because the conflicting identifiers do not line up",
    reviewType: "Consumer onboarding",
    priority: "medium",
    queueBadges: ["watchlist", "identity"],
    fraudScore: 0.42,
    identityConfidence: 0.79,
    sanctionsMatch: 0.39,
    registryMismatch: false,
    deviceLinkCount: 1,
    ownershipDepth: 1,
    documentsVerified: true,
    falsePositiveEvidence: true,
    velocityAnomaly: false,
    analystPrompt: "Demonstrate a safe downgrade rather than over-blocking.",
    facts: [
      { id: "f-501", title: "Name overlap", value: "Partial alias match only", source: "Dow Jones", impact: "negative" },
      { id: "f-502", title: "DOB conflict", value: "Watchlist DOB differs by 11 years", source: "Dow Jones", impact: "positive" },
      { id: "f-503", title: "Document verification", value: "Pass", source: "Persona", impact: "positive" },
      { id: "f-504", title: "Device behavior", value: "No unusual linkage", source: "FingerprintJS", impact: "positive" }
    ],
    nodes: [
      { id: "person", label: "Mira Santos", kind: "person", x: 46, y: 38 },
      { id: "watch", label: "Watchlist hit", kind: "watchlist", x: 22, y: 70 },
      { id: "doc", label: "Verified ID", kind: "document", x: 78, y: 68 }
    ],
    edges: [
      { id: "e-13", source: "person", target: "watch", label: "Alias overlap", severity: "medium" },
      { id: "e-14", source: "doc", target: "person", label: "DOB mismatch clears hit", severity: "low" }
    ]
  },
  {
    id: "ct-006",
    title: "Silverline Commerce",
    applicant: "Silverline Commerce",
    programArea: "KYB / UBO review",
    typology: "Ownership mismatch",
    jurisdiction: "Nevada, US",
    storyline: "a thin-file business uses a recycled email and incomplete ownership docs, making the case recoverable but not approvable yet",
    reviewType: "Business onboarding",
    priority: "medium",
    queueBadges: ["ownership", "docs", "device"],
    fraudScore: 0.63,
    identityConfidence: 0.57,
    sanctionsMatch: 0.16,
    registryMismatch: true,
    deviceLinkCount: 2,
    ownershipDepth: 3,
    documentsVerified: false,
    falsePositiveEvidence: false,
    velocityAnomaly: false,
    analystPrompt: "Make the next-best action explicit for the analyst.",
    facts: [
      { id: "f-601", title: "Registry inconsistency", value: "Ownership percentages do not sum to 100", source: "OpenCorporates", impact: "negative" },
      { id: "f-602", title: "Recycled contact", value: "Email linked to prior declined application", source: "Internal graph", impact: "negative" },
      { id: "f-603", title: "Watchlist screening", value: "No hit", source: "Dow Jones", impact: "positive" },
      { id: "f-604", title: "Document status", value: "Articles of organization missing", source: "Upload portal", impact: "negative" }
    ],
    nodes: [
      { id: "biz", label: "Silverline Commerce", kind: "business", x: 48, y: 42 },
      { id: "contact", label: "Shared contact", kind: "device", x: 20, y: 64 },
      { id: "owner", label: "K. Shah", kind: "person", x: 22, y: 18 },
      { id: "doc", label: "Missing docs", kind: "document", x: 80, y: 66 }
    ],
    edges: [
      { id: "e-15", source: "owner", target: "biz", label: "UBO", severity: "medium" },
      { id: "e-16", source: "contact", target: "biz", label: "Reused email/device", severity: "medium" },
      { id: "e-17", source: "doc", target: "biz", label: "Need formation docs", severity: "high" }
    ]
  }
];

export const EVALUATIONS = CASES.map((caseItem) => ({
  caseItem,
  recommendation: evaluateCase(caseItem)
}));

export const VALIDATION_SIGNALS: ValidationSignal[] = [
  {
    title: "Actionability coverage",
    status: "pass",
    metric: "6 / 6 scenarios match expected action",
    note: "The research pack covers escalation, request-docs, approval, and false-positive clearance."
  },
  {
    title: "Policy replay",
    status: "pass",
    metric: "100% stable replay",
    note: "The symbolic layer reproduces the same output for the same customer profile and evidence set."
  },
  {
    title: "Evidence grounding",
    status: "pass",
    metric: "4 cited facts per recommendation",
    note: "Every recommendation packet points back to explicit source-tagged facts."
  },
  {
    title: "Counterfactual discipline",
    status: "watch",
    metric: "2 alternative outcomes per case",
    note: "Counterfactuals stay bounded to auditable changes like watchlist clearance, document verification, or registry confirmation."
  }
];

export const DASHBOARD_STATS = {
  casesInQueue: EVALUATIONS.length,
  escalationRate: "33%",
  clearableFalsePositives: "17%",
  auditCoverage: "100%"
};
