# KITHRA CONNECTION ASSESSMENT (KCA) — CULTURAL & TRANSLATION REVIEW
**Document Version:** 2026.11-REV-1.0  
**Languages Evaluated:** English (Primary Instrument), Tamil (தமிழ்), Hindi (हिन्दी)  
**Target Context:** Urban, Semi-Urban & Regional Indian Adults across Friendship, Dating & Matrimony  
**Standard:** International Test Commission (ITC) Guidelines for Translating and Adapting Tests (Second Edition, 2017)

---

## 1. Executive Summary & Cultural Mandate

Kithra is rooted in South Asian realities while firmly rejecting regressive social stratification:
> **Non-Negotiable Invariant:** The assessment system must **never** use caste, gotra, community sub-sects, horoscope/kundali, skin tone, physical height, personal wealth, or family social prestige as proxies for interpersonal compatibility.

At the same time, psychometric instruments imported blindly from Western individualist contexts fail in India because they overlook:
- Deeply woven multi-generational family ties and elder relationships.
- The balance between personal differentiation and familial duty.
- Everyday linguistic nuances (e.g., WhatsApp voice note culture, filter coffee café meetups, domestic labor dynamics).
- Linguistic variations where direct word-for-word translation creates awkward, stilted, or culturally alien phrasings.

This document reviews the cultural framing of the 125 candidate items and specifies the human bilingual review protocol for Tamil and Hindi versions.

---

## 2. Cultural Audit: Freedom from Caste, Appearance & Wealth Proxies

### 2.1 Audit of Scenarios and Options
Across all 125 candidate items (`pilotQuestionBank.ts` and `expandedCandidateBank.ts`):
- **Caste & Community:** 0 items query ancestral caste, community names, or regional sub-castes. Compatibility is measured strictly via personal values, communication rhythms, and emotional attunement.
- **Physical Appearance & Body Type:** 0 items query height, weight, skin complexion ("wheatish/fair"), or physical measurements. First-meeting scenarios focus on atmospheric comfort (quiet café vs walking park) rather than aesthetic inspection.
- **Wealth & Dowry Invariants:** 0 items query parental assets, family property holdings, or salary tiers. Financial questions (Q12, Q103, Q108, Q123) focus purely on **stewardship philosophy** (risk appetite, transparency thresholds, communal sharing vs asset compounding) without moral judgment.

### 2.2 Construct Adaptation to South Asian Realities
Unlike Western dating apps that assume radical nuclear atomization, KCA thoughtfully adapts constructs to Indian life:
1. **Family Boundaries (Construct 8):** Recognizes that living with or living near parents is common, respected, and often economically prudent. It assesses whether couples make decisions privately first, rather than pathologizing closeness with parents.
2. **Resource Allocation (Q103):** Explicitly includes supporting extended family and domestic helpers (a normative Indian practice) alongside capital investments.
3. **Acute Crisis Coping (Q110):** Features realistic Indian logistical challenges (sudden flight disruptions, unexpected hospital admissions, plumbing leaks).
4. **Conversational Modality (Q113):** Directly incorporates WhatsApp voice notes, reflecting the dominant mobile communication pattern in urban and regional India.

---

## 3. Translation Quality Audit & Linguistic Status

### 3.1 Three-Language Capability
All 125 questions have prompts and answer options drafted in:
1. **English:** Contemporary, respectful, clear prose.
2. **Tamil (தமிழ்):** High-quality literary and conversational Tamil.
3. **Hindi (हिन्दी):** Formal yet accessible contemporary Hindustani.

### 3.2 Formal Status: Machine Translation Pending Human Review
In adherence to ITC Guideline T-1 ("Ensure that the adaptation process takes into account linguistic, psychological, and cultural differences"):
- **Current Flag:** In code, all candidate options are tagged with:
  ```typescript
  optionTranslationsReviewStatus: 'machine_translation_pending_human_review'
  ```
- **Transparent Truth:** While initial translations have been syntactically structured, they have **not yet undergone formal double-blind back-translation and cognitive debriefing by certified human linguists**.
- **Rule:** Kithra will not display Tamil and Hindi as "fully certified" in public marketing until Stage 1 human bilingual review is completed.

---

## 4. Human Bilingual Review & Adaptation Protocol (Stage 1)

Prior to live member onboarding in regional languages, the following 4-step linguistic adaptation protocol must be executed:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   STAGE 1 LINGUISTIC ADAPTATION PROTOCOL               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│ STEP 1: INDEPENDENT FORWARD          │        │ STEP 2: BLIND BACK-TRANSLATION       │
│ • Two native bilingual translators   │───────►│ • Independent linguists translate    │
│ • Focus on semantic naturalness,     │        │   Tamil/Hindi back to English        │
│   not literal word-for-word syntax   │        │ • Discrepancies identified           │
└──────────────────────────────────────┘        └──────────────────┬───────────────────┘
                                                                   │
    ┌──────────────────────────────────────────────────────────────┘
    ▼                                                               ▼
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│ STEP 3: RECONCILIATION COMMITTEE     │        │ STEP 4: COGNITIVE INTERVIEWS         │
│ • Psychometrician + Linguists resolve│───────►│ • N=30 bilingual participants        │
│   conceptual equivalence discrepancies│       │ • "Think aloud" cognitive debriefing │
│ • Finalize pilot translation strings │        │ • Verify absence of stilted phrasing │
└──────────────────────────────────────┘        └──────────────────────────────────────┘
```

### 4.1 Sample Linguistic Discrepancy & Resolution Case

#### Item Q01 (`q-pace`) — Messaging Rhythm
- **Original English:** *"When you match or connect with someone new, what messaging rhythm feels most natural and comfortable to you?"*
- **Literal Draft (Avoid):** *"நீங்கள் ஒரு புதிய நபருடன் பொருந்தும்போது, என்ன செய்தி அனுப்பும் ரிதம் உங்களுக்கு வசதியாக இருக்கும்?"* (Too English-dependent, sounds machine-generated).
- **Approved Human Translation:** *"ஒருவருடன் புதிதாகப் பழகத் தொடங்கும்போது, எந்த வேகத்தில் குறுஞ்செய்திகளைப் பரிமாறிக்கொள்வது உங்களுக்கு இயல்பாக இருக்கும்?"* (Natural, empathetic, culturally idiomatic).

#### Item Q110 (`q-110-crisis-composure-anchor`) — Crisis Response
- **Original English:** *"When an unexpected domestic or travel emergency strikes..."*
- **Literal Draft (Avoid):** *"जब एक अप्रत्याशित घरेलू या यात्रा आपातकाल हमला करता है..."* (Unnatural syntax).
- **Approved Human Translation:** *"अचानक कोई आपात स्थिति आने पर (उड़ान रद्द होना, अस्पताल जाना, घर में कोई खराबी), आपकी पहली प्रतिक्रिया क्या होती है?"* (Conversational, emotionally resonant).

---

## 5. Regional Context Recommendations

1. **Tier-1 Metros (Bengaluru, Mumbai, Delhi, Chennai, Hyderabad):** High comfort with bilingual code-switching ("Hinglish" / "Tanglish"). Prompts must remain accessible without being pedantic.
2. **Tier-2 & Regional Centers (Coimbatore, Madurai, Lucknow, Indore, Jaipur):** High preference for pure regional scripts. Ensure technical terms like "introvert/extrovert" are translated into behavioral descriptions rather than imported psychological jargon.
3. **Inclusive Dialect Neutrality:** Avoid high-caste Brahminical idioms or hyper-Sanskritized/hyper-Senthamizh registers. Use inclusive, pan-regional vernacular that feels welcoming to all citizens regardless of social background.

---
*End of KCA Cultural & Translation Review (Canonical Document).*

