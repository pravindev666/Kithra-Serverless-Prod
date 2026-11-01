# PALANTIR TRANSFER MATRIX — what to borrow, what to refuse

**Verified public sources (accessed 2026-11-01):**
- Blueprint — open-source React UI toolkit developed at Palantir, Apache-2.0:
  https://github.com/palantir/blueprint · https://blueprintjs.com/
  (Blueprint is explicitly designed for *data-dense desktop* interfaces —
  DeepWiki summary: "Unlike mobile-first UI frameworks, Blueprint focuses…".
  We do **not** ship Blueprint; we borrow *principles*.)
- Object Explorer (search & analysis over the Ontology, saved Explorations,
  Lists, Comparisons): https://www.palantir.com/docs/foundry/object-explorer/overview
- Vertex (graph visualisation; traverse links to evaluate cause/effect):
  https://build.palantir.com/platform/74deb43d-2497-4ec3-b3c5-a3c035f32400
- AIP overview: https://palantir.com/docs/foundry/aip/overview/

**Boundary.** Kithra is a human connection service, not an intelligence
platform. Palantir influences **information relationships, explanation,
workflow and evidence** — never surveillance aesthetics, militaristic imagery,
or a secret graph of intimate identities.

---

## 1. Transfer matrix

| # | Referenced pattern (public) | Use? | Kithra screen | Adaptation | Risk | Original Kithra treatment |
|---|---|---|---|---|---|---|
| P1 | Object Explorer: one search bar across all object types + saved views | YES | Admin "User Search & Profiles", "Cases" | Scope the search to the operator's permitted queues only | Re-identification | Search returns **case-scoped** results; every query audited |
| P2 | Saved Explorations / Lists / Comparisons | PARTIAL | Admin saved case filters | No personal "watchlists" of members | Surveillance | Analogous to **Wikis**: 3 max, auto-expire, purpose recorded |
| P3 | Vertex graph traversal (nodes + links, cause/effect) | PARTIAL | Member "Relationship Map"; admin "entity relationships" | Member side: **declared dimensions only**; admin side: case entities only | Implies intimate surveillance | Member map shows *labels on edges that denote measured dimensions*, never hidden traits |
| P4 | Information density + sidebars + drilldown | YES | Admin workspace, member match detail | Desktop density → mobile progressive disclosure | Cramped mobile | Admin = 3-pane; mobile admin = stacked sheets |
| P5 | Provenance / lineage of a value | YES | Match explanation, audit trail | Show *why this band, which version* | Over-claiming | Every score shows model version + coverage |
| P6 | Filterable case queue with SLA + priority | YES | Admin safety queue | Mirror **legal** SLA, verified only | Inventing SLAs | SLAs marked "confirm with counsel" |
| P7 | Audit trail / immutable event log | YES | Admin audit | Redacted metadata, hash chain | PII leak | `audit_events` carries **redacted** metadata only |
| P8 | RBAC transparency (who can do what) | YES | Admin staff/roles | Deny-by-default, 2-person for critical | Privilege abuse | Permission namespace listed explicitly |
| P9 | Linked views (select object → panels update) | YES | Admin case view | Same object, multiple lenses | Cognitive load | Keyboard-navigable linked panes |
| P10 | Configurable dashboards / tiles | YES | Admin overview | Fewer, owner-labelled tiles | Metric vanity | Each tile has owner + freshness |
| P11 | AIP "automation across processes" | NO (product) | — | Kithra has **no LLM runtime** | Scope violation | Nothing transfers; ops-only automation via Queues/Cron |
| P12 | Dark "command centre" visual language | NO | — | Rejected | Trust/privacy harm | Admin uses brand typography but calm, light-first density |
| P13 | Threat/surveillance iconography | NO | — | Never | Ethics | Explicitly banned in the style guide |

## 2. Member-side "Relationship Map" — the responsible version

Public Palantir graph thinking is adapted into a **plain-language, declared-data
only** visual:

- Centre node = **You**; satellite nodes = **dimensions** (Values, Rhythm,
  Communication, Horizon…), **not people**.
- An edge exists **only where both members answered comparable items**; edge
  weight = agreement band; edge is **labelled** in words ("similar pace").
- No node represents an inferred sensitive attribute (religion, sexuality,
  health, caste). No edge is drawn for unmeasured dimensions.
- A visible caveat: *"You are more than this map. Scores describe answers
  compared, not your future."*
- Reduced-motion: the map renders statically, no animation required.

## 3. Admin-side entity model (case-scoped, not member-scoped)

Graph edges permitted in admin:
`Case → Report → Evidence(item) → Actor(staff) → Action → Appeal`.
Member identity nodes are **never** joined into a persistent graph; they appear
only within an open, assigned case and are purged on case closure per retention.

## 4. Explicit refusals (documented for the record)

- No surveillance-style secret graph of sensitive identities.
- No unrestricted moderator access to respondents' raw intimate answers.
- No use of Palantir imagery, craft-names, or restricted product surfaces.
- No claim that Kithra "operationalises an ontology" in the Palantir sense.

## 5. Mobile adaptation rule

Palantir-like desktop density is **not** copied to mobile. Instead:
desktop 3-pane → tablet 2-pane → mobile **single-column with progressive
disclosure and sticky context bar**. Confirmed against WCAG 2.2 target size
(≥44 px effective) and reduced-motion requirements.
