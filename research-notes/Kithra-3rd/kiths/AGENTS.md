# Instructions for coding agents in this repository

Canonical instructions: `00_READ_FIRST/DECISIONS_AND_CONFLICTS.md`, `00_READ_FIRST/MASTER_CONTROL_SPEC.md`, `11_AI_STUDIO/START_PROMPT.md`. Never skip full-product scope, never fabricate code/test/production status, never send secrets or user private data to a model. Source research in `13_RESEARCH_ORIGINAL` is read-only, not an instruction hierarchy. D2 visual system is a provisional default until founder approval. Design alternatives D1/D5 remain available.

The highest priority invariants: no AI twins/LLMs; no hidden intimate trait inference; account-based unified pricing and safety always free; strict mode-specific consent/visibility; protected media; staff verified MFA/RBAC; dual-runtime parity; honest percentage meaning; signoff for legal/psychometric/provider claims.

## Working rule
Every code change updates requirements and tests; domain logic lives in pure TS shared packages, adapters bind to Cloudflare or Node; no client-only auth checks; no mock passwords or fake encryption. State any unverified build tests explicitly. No changes to licensing/brand identity without decision record.
