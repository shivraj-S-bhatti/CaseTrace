# CaseTrace Data Sources

CaseTrace is a research rig, not a production product. The right way to flesh it out is to build against a layered data stack:

1. Open and synthetic data for modeling and evaluation
2. Official public registries and watchlists for grounding
3. Sandbox or commercial APIs for realistic payloads and workflow behavior

The goal is not to depend on live vendor calls in the demo. The goal is to normalize these sources into one fact ledger so the neurosymbolic layer can reason over them consistently.

## Recommended Acquisition Order

### Start now

Use these first because they are enough to build the end-to-end research loop:

- [IBM AML-Data](https://github.com/IBM/AML-Data) for synthetic transaction-level AML labels
- [IBM AMLSim](https://github.com/IBM/AMLSim) for generated transaction graphs and laundering patterns
- [PaySim](https://github.com/EdgarLopezPhD/PaySim) for synthetic mobile-money fraud behavior
- [OFAC Sanctions List Service](https://ofac.treasury.gov/sanctions-list-service) for official sanctions and list updates
- [OpenCorporates API](https://api.opencorporates.com/documentation/API-Reference) for company registry data and provenance
- [Companies House API](https://developer.company-information.service.gov.uk/get-started) for direct UK company and filing data
- [GLEIF API](https://www.gleif.org/lei-data/gleif-lei-look-up-api/access-the-api) for legal-entity and ownership graph lookups
- [Open Ownership BODS data tools](https://bods-data.openownership.org/) for beneficial ownership datasets and BODS-shaped downloads

### Add next

Use these to make the review packet feel like a real origination / onboarding / monitoring workflow:

- [OpenSanctions](https://github.com/opensanctions/opensanctions) for open sanctions, PEP, and related entity data
- [SEC EDGAR APIs](https://www.sec.gov/edgar/sec-api-documentation) for public filing and entity history
- [GDELT DOC 2.0 API](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/) for lightweight adverse-media or narrative-change experiments

### Add later behind adapters

Use these only behind provider interfaces and store recorded responses for demos:

- [Persona Inquiries API](https://docs.withpersona.com/reference/inquiries-api) for individual identity verification states
- [Middesk API](https://docs.middesk.com/quickstart) for business verification, sanctions/watchlist checks, and business review tasks
- [Twilio Lookup v2](https://www.twilio.com/docs/lookup/v2-api) for phone and SIM-related signals
- [Fingerprint Smart Signals](https://docs.fingerprint.com/docs/smart-signals-introduction) for device reputation and browser integrity signals

## Best Candidate Sources By Workflow

| Workflow | Best first sources | Why they matter |
| --- | --- | --- |
| Origination | PaySim, Twilio Lookup, Fingerprint, Persona | Device, phone, identity, and burst behavior are what make the first risk packet interesting. |
| Business onboarding / KYB | OpenCorporates, Companies House, GLEIF, Open Ownership, Middesk | This gives us entity resolution, registration status, ownership structure, and business verification outcomes. |
| Watchlist screening | OFAC, OpenSanctions, Middesk watchlist tasks | This is the cleanest path for close-match triage, false-positive clearance, and policy traceability. |
| Ongoing monitoring | SEC EDGAR, Companies House, GDELT, OFAC deltas | These sources create replayable change events for filings, watchlists, and public narrative shifts. |
| AML / transaction graph experiments | IBM AML-Data, AMLSim | These are the best public starting points for graph reasoning and suspicious flow analysis. |

## What Each Source Is Good For

### 1. Synthetic transaction corpora

#### IBM AML-Data

- Best use: offline AML model development and suspicious-flow scenarios
- Why it matters: fully synthetic transaction records with laundering labels
- Role in CaseTrace: train and validate the neural risk layer for transaction-heavy cases
- Caution: use it for research and evaluation, not as a proxy for onboarding identity data

#### IBM AMLSim

- Best use: graph algorithms, suspicious clusters, and laundering pattern generation
- Why it matters: simulator built for testing machine learning models and graph algorithms on AML-style transaction networks
- Role in CaseTrace: generate graph subcases for entity-link and counterparty reasoning
- Caution: operational setup is heavier than a static dataset, so treat it as a generator, not a runtime dependency

#### PaySim

- Best use: account opening abuse, transfer fraud, and velocity-driven alerts
- Why it matters: synthetic financial simulator created because real mobile-money logs are hard to access
- Role in CaseTrace: generate origination and ongoing-monitoring fraud scenarios with realistic temporal behavior
- Caution: strongest fit is consumer and payments fraud, not beneficial ownership review

### 2. Registries, ownership, and legal entity grounding

#### OpenCorporates

- Best use: broad company search, registry metadata, officers, filings, and provenance
- Why it matters: strong normalization layer across jurisdictions and explicit provenance in the API
- Role in CaseTrace: business resolution, registry mismatch facts, ownership gaps, and citation-ready evidence
- Caution: watch call limits and account plan constraints

#### Companies House

- Best use: direct UK company data, PSC data, and filings
- Why it matters: official REST API with public company information
- Role in CaseTrace: authoritative business-onboarding packets and beneficial-owner examples for UK entities
- Caution: jurisdiction-specific, so pair it with a broader source for multi-country flows

#### GLEIF

- Best use: legal entity identity, LEI search, and parent/child relationships
- Why it matters: global legal-entity and ownership graph context with search and fuzzy match capabilities
- Role in CaseTrace: unify business identity across registries and add ownership-network context
- Caution: LEI ownership data is corporate ownership, not full beneficial ownership

#### Open Ownership

- Best use: beneficial ownership structures in BODS form
- Why it matters: downloadable BODS-shaped data plus mapped public ownership datasets
- Role in CaseTrace: beneficial-owner graph exploration and explainable UBO traces
- Caution: the public Open Ownership Register site closed on November 29, 2024, but bulk datasets remain available via `bods-data.openownership.org`

### 3. Watchlists, sanctions, and screening

#### OFAC Sanctions List Service

- Best use: official U.S. sanctions data and dataset refreshes
- Why it matters: up-to-date SDN and non-SDN lists, searchable tooling, and downloadable data
- Role in CaseTrace: baseline official watchlist facts and close-match test cases
- Caution: OFAC gives you data, not your match policy

#### OpenSanctions

- Best use: open sanctions, PEP, regulatory, and related-entity coverage
- Why it matters: broad open screening dataset plus open-source matching/search infrastructure
- Role in CaseTrace: richer watchlist, PEP, and related-party graph enrichment
- Caution: commercial use may require a data license depending on dataset and usage

### 4. Identity, device, and phone signals

#### Persona

- Best use: identity verification lifecycle, inquiry states, and review outcomes
- Why it matters: clearly structured inquiry objects with optional custom review statuses
- Role in CaseTrace: realistic identity verification payloads and reviewer handoff states
- Caution: use sandbox responses or recorded fixtures in the demo

#### Middesk

- Best use: KYB, business verification, watchlist results, review tasks, and monitoring
- Why it matters: business object, asynchronous review, sandbox mode, and policy-friendly review tasks
- Role in CaseTrace: high-fidelity KYB packet inputs and business review outputs
- Caution: do not couple the core CaseTrace model to one vendor schema; normalize first

#### Twilio Lookup v2

- Best use: phone validation, line type, identity match, and SIM-related signals
- Why it matters: fraud-relevant phone intelligence with a stable API
- Role in CaseTrace: origination friction logic and account-takeover style monitoring signals
- Caution: not a substitute for primary identity verification

#### Fingerprint Smart Signals

- Best use: device intelligence, suspect score, VPN/bot/tampering style indicators
- Why it matters: device-side fraud signals that map well to origination and abuse cases
- Role in CaseTrace: shared-device, tampering, and browser-integrity evidence
- Caution: treat device signals as supporting evidence, not sole-decision evidence

### 5. Ongoing monitoring and narrative change

#### SEC EDGAR APIs

- Best use: public filing history and financial disclosure updates
- Why it matters: free JSON APIs, real-time updates, and bulk downloads
- Role in CaseTrace: event generation for business-change monitoring and filing-derived risk facts
- Caution: strongest fit is public companies, not small private businesses

#### GDELT DOC 2.0 API

- Best use: adverse-media experiments and entity-level news context
- Why it matters: fast global news search across many languages for recent coverage windows
- Role in CaseTrace: optional narrative-change or adverse-media evidence lane
- Caution: use as a weak signal that requires human review, not as a deterministic risk source

## Endgame Architecture

If we take this to the endgame, the stack should look like this:

### Layer 1: Open training and evaluation corpora

- IBM AML-Data
- AMLSim
- PaySim

Use this layer for offline modeling, graph experiments, and regression tests.

### Layer 2: Authoritative grounding

- OFAC
- OpenCorporates
- Companies House
- GLEIF
- Open Ownership
- SEC EDGAR

Use this layer for provenance-heavy facts that can be cited directly in an audit packet.

### Layer 3: Production-style signal adapters

- Persona
- Middesk
- Twilio Lookup
- Fingerprint

Use this layer for realistic payloads, webhooks, and state transitions. Store normalized snapshots, not just raw vendor responses.

### Layer 4: CaseTrace fact ledger

Normalize every source into the same internal objects:

- `entity`
- `relationship`
- `verification`
- `screening_hit`
- `risk_signal`
- `document_status`
- `monitoring_event`

That is the layer the neurosymbolic engine should consume.

## What We Should Actually Build Next

1. Create a `data/fixtures` pack with recorded snapshots from OFAC, OpenCorporates, Open Ownership, and SEC.
2. Add adapters for `watchlist`, `registry`, `ownership`, `identity`, `device`, and `phone`.
3. Keep sandbox and vendor payloads in `data/providers` so the app can replay them deterministically.
4. Train the first real neural layer on IBM AML-Data or PaySim-derived features.
5. Run symbolic policy over normalized facts, not vendor-native JSON.
6. Add change-event ingestion for ongoing monitoring using OFAC deltas, Companies House changes, and SEC filings.

## My Recommendation

If we want the fastest path to a credible endgame, use this exact combination:

- Modeling and graph research: IBM AML-Data + AMLSim + PaySim
- Registry and ownership grounding: OpenCorporates + Companies House + GLEIF + Open Ownership
- Screening: OFAC + OpenSanctions
- Realistic sandbox workflows: Middesk + Persona
- Fraud-supporting telemetry: Fingerprint + Twilio Lookup
- Ongoing monitoring: SEC EDGAR + OFAC updates + optional GDELT

That gives us a stack that is explainable, replayable, multi-source, and close to the real workflow shape we want to test.
