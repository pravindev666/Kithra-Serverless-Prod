# KITHRA — PRODUCT FRICTION & USABILITY TESTING PROTOCOL
**Auditing Standard:** Behavioral Observation & Friction Mapping (Don Norman / Steve Krug)  
**Target Environment:** Staging Deployment (`https://kithra-staging.pravindev666.workers.dev` or Local Dev `http://localhost:3000`)  
**Status:** Protocol Ready for Consenting Adult Participant Observation

---

## 1. THE USABILITY TESTING PHILOSOPHY

> *"Watch what people do, not what they say. When someone gets confused, do not explain the product to them—write down what made them stumble."*

In usability testing, the facilitator is **forbidden from assisting or guiding the user**. If a user asks: *"What does 'We Balance Each Other' mean?"*, the facilitator must answer: *"What would you expect it to mean?"*

---

## 2. THE 10 OBSERVATIONAL TASKS

Each participant is given an unprompted task card and asked to "think aloud" while navigating on their own mobile smartphone or laptop.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  TESTING PIPELINE (ESTIMATED TOTAL DURATION: 30 MINUTES)                              │
│                                                                                        │
│  [Task 1: Signup] ──► [Task 2: 5-Q Onboarding] ──► [Task 3: Profile Setup]            │
│         │                                                                             │
│  [Task 4: Explore Matches] ◄── [Task 5: Match Explanation] ◄── [Task 6: Self-Insights]│
│         │                                                                             │
│  [Task 7: Send Request] ──► [Task 8: Privacy Controls] ──► [Task 9: Pricing Check]    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### TASK 1: Account Registration
* **Prompt Given to User:** *"Please sign up for an account on this website as yourself."*
* **What to Observe:**
  - Do they hesitate when asked for Email + Password instead of Phone / WhatsApp OTP?
  - Do they notice or understand the 18+ adult age confirmation checkbox?
  - How long does it take them to reach the next screen?
* **Red Flag Metrics:** > 90 seconds to register; trying to click a non-existent Google/Apple button.

### TASK 2: 5-Item Starter Battery Completion
* **Prompt Given to User:** *"The platform asks you a few initial questions. Go ahead and answer them naturally."*
* **What to Observe:**
  - Do they read the scenario descriptions carefully, or do they skim?
  - Do they struggle to choose between the options?
  - Do they look for a "Skip" button?
  - Do they ask: *"Who will see my answers?"*
* **Red Flag Metrics:** Abandoning before Q5; spending > 4 minutes total; asking if their boss/parents could see this.

### TASK 3: Profile Completion & Progressive Indicator
* **Prompt Given to User:** *"Finish setting up your basic profile so you're ready to explore."*
* **What to Observe:**
  - Do they understand the "Progressive Profile Completion" circular meter?
  - Do they fill out their Bio and Headline easily, or do they get writer's block?
  - Do they understand the 3 intentions (Friendship, Dating, Matrimony)?
* **Red Flag Metrics:** Leaving Bio blank; confusion over whether selecting "Matrimony" makes their profile visible to marriage brokers.

### TASK 4: Companion Discovery & Lenses
* **Prompt Given to User:** *"You are now on the discovery screen. Explore the profiles shown to you."*
* **What to Observe:**
  - What do they look at first—the portrait photo, the location, or the 0–100 similarity score?
  - Do they click on the 3 lens tabs (*Similar to Me*, *Different from Me*, *We Balance Each Other*)?
  - Can they articulate the difference between the 3 lenses in their own words?
* **Red Flag Metrics:** Completely ignoring the lenses and treating the feed like a photo list; expressing confusion over why a "Different from Me" match was shown to them.

### TASK 5: Match Explanation Comprehension
* **Prompt Given to User:** *"Click on one person who looks interesting and inspect why the app thinks you two might connect."*
* **What to Observe:**
  - Do they read the "Why You Align" explanatory breakdown?
  - Does the explanation sound like genuine human advice or robotic algorithmic jargon?
  - Do they understand the shared values and pacing notes?
* **Red Flag Metrics:** Skipping the explanation entirely; saying: *"This sounds like an AI horoscope."*

### TASK 6: Psychological Self-Understanding Insights
* **Prompt Given to User:** *"Find your own psychological insights report in the menu."*
* **What to Observe:**
  - Can they locate the Insights tab without coaching?
  - When reading their reflection note, do they nod in agreement, look confused, or look defensive?
  - Do they believe the report over-claims or diagnoses them?
* **Red Flag Metrics:** Feeling judged, psychoanalyzed, or uncomfortable with the wording.

### TASK 7: Initiating a Connection / Sending a Message
* **Prompt Given to User:** *"Imagine you'd like to talk to this person. How would you initiate contact?"*
* **What to Observe:**
  - Do they expect to swipe, send a like, or send a text note?
  - Do they notice that messaging is simulated in this preview stage?
* **Red Flag Metrics:** Frustration that they cannot send a direct message immediately.

### TASK 8: Privacy, Blocking & Data Erasure
* **Prompt Given to User:** *"Imagine you decided to leave the platform and wanted all your psychological answers deleted. How would you do that?"*
* **What to Observe:**
  - Do they easily find the "Delete My Assessment Data" button?
  - Does the warning dialog clearly explain what will be erased?
* **Red Flag Metrics:** Inability to locate privacy controls within 30 seconds.

### TASK 9: Understanding Subscription Offerings & Pricing
* **Prompt Given to User:** *"Find the membership pricing page. Look at the options and tell me what you think."*
* **What to Observe:**
  - What is their immediate, unprompted facial expression upon seeing ₹1,299/month?
  - Do they understand what features require paying vs. what is free?
  - Do they notice the "Payment Provider Not Connected (Pilot Mode)" banner?
* **Red Flag Metrics:** Immediate laughter or recoil at the ₹1,299 price point; confusion over what the paid tier actually unlocks.

---

## 3. FRICTION SCORING MATRIX (THE "HALT" SCORE)

Every observed friction incident is categorized under the **HALT Framework**:

| Severity Level | Definition | Code Implication |
| :--- | :--- | :--- |
| **P0: Critical Blocker** | User cannot complete task; abandons app entirely. | Must be fixed before any human pilot. |
| **P1: Severe Confusion** | User completes task, but with intense frustration or incorrect mental model. | Needs immediate redesign. |
| **P2: Minor Friction** | User pauses or hesitates for 5–10 seconds, but recovers independently. | Polish in subsequent release. |
| **P3: Cosmetic / Nuance** | Slight wording or styling oddity; no impact on task flow. | Backlog item. |

