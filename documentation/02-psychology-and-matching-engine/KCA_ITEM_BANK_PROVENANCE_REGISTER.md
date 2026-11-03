# KITHRA CONNECTION ASSESSMENT (KCA) — ITEM BANK PROVENANCE & IP REGISTER
**Document Version:** 2026.11-REV-1.0  
**Scope:** Intellectual Property Audit, SPDX Apache-2.0 Licensing Assessment, Originality Verification, and Trade Asset Strategy  
**Prepared For:** Kithra Leadership & Intellectual Property Legal Counsel

---

## 1. Executive Summary & Legal Purpose

Kithra is building a defensible, proprietary, psychology-first companion discovery platform. To ensure long-term enterprise valuation, prevent copyright infringement claims, and safeguard Kithra’s proprietary psychometric assets, this document establishes:
1. **The Provenance of the Item Bank:** How items Q1–Q125 were created and whether they infringe on third-party copyrighted personality tests.
2. **The Legal Effect of `SPDX-License-Identifier: Apache-2.0`:** A legal analysis of existing open-source header tags in codebase files and a dual-licensing separation strategy.
3. **Public Domain Scientific Frameworks vs Proprietary Expression:** The boundary between academic psychological theory and Kithra’s copyrightable creative expression.
4. **Trade Secret & Trademark Protections:** Recommendations for protecting adaptive algorithms, lenses, and brand assets.
5. **Actionable Counsel Directives:** Formal steps required prior to the Stage 2 human research pilot.

---

## 2. Item Bank Authorship & Originality Audit

### 2.1 Absence of Third-Party Scale Infringement
A rigorous line-by-line audit was conducted across all 125 candidate questions (`src/data/pilotQuestionBank.ts` and `src/data/expandedCandidateBank.ts`) to ensure zero infringement of commercial psychometric instruments:
- **No Myers-Briggs Type Indicator (MBTI) Items:** No items reproduce copyrighted questions from the Myers-Briggs Type Indicator or The Myers-Briggs Company.
- **No Enneagram Institute Scales:** No copyrighted descriptions or Riso-Hudson Enneagram Type Indicator (RHETI) questions are reproduced.
- **No Gallup CliftonStrengths:** No proprietary Gallup assessment items are utilized.
- **No Proprietary Commercial Dating App Algorithmic Scraping:** Prompts do not duplicate proprietary questionnaire items from eHarmony, Match Group, or OkCupid.

### 2.2 Public Domain Science vs Original Creative Expression
Under copyright law (17 U.S.C. § 102(b) and Indian Copyright Act 1957, Section 13), ideas, systems, and theoretical concepts are not copyrightable; only the **specific expression** is protected:
- **Public Domain Psychological Frameworks:** The underlying peer-reviewed theories referenced (e.g., Lazarus & Folkman’s 1984 coping models, Gottman’s 1999 repair concepts, Schwartz’s 1992 human value dimensions, Bowlby’s attachment theory, Walther’s 1996 hyperpersonal CMC model) are published scientific literature in the public domain.
- **Originality of Kithra Expressions:** Every scenario prompt, question option, option label, participant reflection text, and paired triangulation relationship in Q1–Q125 is an **original literary and psychometric work** authored specifically for Kithra, tailored to contemporary adult life and Indian cultural contexts (e.g., WhatsApp voice note etiquette, filter coffee café meetups, family emergency handling, wedding scale negotiations).

---

## 3. SPDX License Header Audit & Separation Strategy

### 3.1 The Present Dilemma
Several TypeScript source files currently include the header:
```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
```
While appropriate for general-purpose open-source utility libraries, applying Apache-2.0 indiscriminately to psychometric item banks and proprietary matching algorithms poses severe business risks:
- The Apache 2.0 license grants a perpetual, worldwide, non-exclusive, no-charge, royalty-free copyright license to reproduce, prepare derivative works of, publicly display, and sublicense the code.
- If `expandedCandidateBank.ts` or `kithraLogic.ts` is distributed under Apache 2.0 without reservation, competitors could legally copy the entire 125-item question bank, its translations, and its triangulation logic.

### 3.2 Dual-Licensing Architecture & Clean Separation
Kithra must implement a strict architectural and legal separation between **Open Infrastructure Code** and **Proprietary Psychometric Assets**:

```
├── OPEN INFRASTRUCTURE (Apache-2.0)
│   ├── React UI Components & Design System Shell
│   ├── Cloudflare Workers Hono Routing Scaffold
│   ├── Generic Storage Middleware & D1 Migration Tools
│   └── Generic Utility Helpers
│
└── PROPRIETARY PSYCHOMETRIC ASSETS (All Rights Reserved / Proprietary Trade Secret)
    ├── KCA Item Bank (Prompts, Options, Semantic IDs, Reflections)
    ├── Psychometric Construct Weights & Triangulation Matrices
    ├── Response-Aware Adaptive Branching Rule Trees
    ├── Dynamic Pairwise Scoring Formulas & Lens Algorithms
    └── Proprietary Member Self-Understanding Text Templates
```

### 3.3 License Header Correction Directive
1. Files containing psychometric items (`expandedCandidateBank.ts`, `pilotQuestionBank.ts`, `triangulationEngine.ts`, `psychologicalInsightsEngine.ts`) should replace generic Apache-2.0 headers with:
   ```typescript
   /**
    * Copyright (c) 2026 Kithra Inc. All Rights Reserved.
    * PROPRIETARY PSYCHOMETRIC INTELLECTUAL PROPERTY.
    * Unauthorized copying, adaptation, distribution, or reverse-engineering
    * of these assessment items, scoring rubrics, or triangulation models
    * is strictly prohibited.
    */
   ```
2. The open-source client shell (frontend rendering components) may remain Apache-2.0, ensuring strong developer community adoption while keeping the core psychological engine protected behind authenticated backend endpoints.

---

## 4. Contributor Rights & Assignment Framework

To guarantee clear, unencumbered chain of title for Kithra's intellectual property:
1. **Founder & Co-Founder IP Assignment Agreements:** Ensure all original psychometric items, drafts, notes, and code created by founders prior to company formation are formally assigned in writing to the corporate entity (Kithra Technologies Inc. / Kithra Pvt. Ltd.).
2. **Work-Made-for-Hire / IP Inventions Agreements:** All software engineers, psychometricians, translation reviewers, and contractors must execute written Proprietary Information and Inventions Agreements (PIIA) assigning all copyrights, moral rights waivers, and patent rights to Kithra.
3. **Stage 1 Expert Reviewers & Academic Advisors:** Independent psychologists participating in cognitive interviews or qualitative reviews must sign academic consultancy agreements stipulating that all feedback, item revisions, and validation contributions belong exclusively to Kithra.

---

## 5. Trade Secret & Trademark Protection Strategy

### 5.1 Trade Secret Protection Under Indian Law and Global Standards
Unlike patents, which require public disclosure of algorithms, psychometric matching engines are best protected as **Trade Secrets**:
- **Adaptive Selection Weights:** The exact mathematical penalties for fatigue, response latency thresholds, and information-gap optimization weights should remain server-side only in Cloudflare Workers and private D1 databases.
- **Triangulation Spread Cutoffs:** The specific numerical thresholds (e.g., spread $\le 28$ vs $29–58$ vs $\ge 59$) must never be disclosed to end users or client browsers. This protects the system from reverse-engineering and bad-faith manipulation.
- **Client Security:** Raw questionnaire responses and internal construct vector weights must remain inaccessible to standard admin/support staff (HTTP 403 zero-raw-answer invariant).

### 5.2 Trademark Protection Register
The following proprietary terms and phrases must be filed for trademark registration across Class 9 (Software) and Class 42 (Software as a Service / Scientific and Technological Services):
1. **"Kithra"** (Word mark and Logo).
2. **"Kithra Connection Assessment (KCA)"** (Assessment instrument mark).
3. **"We Balance Each Other"** (Discovery lens trademark).
4. **"Not who society thinks you should love. Who truly understands you."** (Corporate brand tagline).
5. **"My Connection Compass"** (Member insights visualization mark).

---

## 6. Recommendations for Legal Counsel

Prior to commencing the Stage 2 Quantitative Research Pilot, legal counsel is advised to execute the following five-step protocol:
1. **Execute Copyright Registration:** File Form TX with the U.S. Copyright Office and Indian Copyright Office for the complete text of the *Kithra Connection Assessment Item Bank (Version 2026.11)* as an original registered literary work.
2. **Clean-Room License Update:** Refactor source repository licenses to reflect the dual-licensing model, isolating proprietary JSON/TS item banks from open UI scaffolding.
3. **Audit PIIA Agreements:** Confirm executed IP assignment agreements exist for 100% of past and present code and research contributors.
4. **Execute Non-Disclosure Agreements (NDAs):** Ensure all pilot research participants and institutional review boards execute informed consent forms containing non-disclosure clauses regarding raw questionnaire items.
5. **File Trademark Applications:** File trademark applications for Kithra and its core discovery lenses in India, the United States, and other planned launch jurisdictions.

---
*End of KCA Item Bank Provenance & IP Register (Canonical Document).*

