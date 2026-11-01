# 03 — MULTI-FORMAT QUESTION BLUEPRINT & 60-ITEM ORIGINAL PILOT BANK

## 1. Seven Question Formats & Anti-Memorization Option Shuffling (Deliverable 6)

To prevent survey fatigue, social-desirability bias, and option-order memorization, Kithra uses **7 distinct question formats** (`QuestionFormatType` in [`src/types/kithra.ts`](file:///c:/Users/hp/Desktop/Kithra/src/types/kithra.ts#L45-L52)):

| Format ID | Name | Psychometric Purpose | Example Context |
|---|---|---|---|
| `direct_preference` | **Direct Preference** | Captures clear everyday rhythm and communication preferences | Reply pace during busy workweeks |
| `situational_judgment` | **Situational Judgment** | Evaluates realistic behavioral choices in everyday scenarios | How a free Sunday or changed weekend plan unfolds |
| `contextual_trait` | **Contextual Trait** | Measures trait expression within a specific social/fatigue context | Social energy at a festival vs. after a taxing workday |
| `values_tradeoff` | **Values Trade-Off** | Pairs two positive, socially desirable values to reduce ceiling effects | Balancing financial transparency with personal discretionary space |
| `forced_choice` | **Balanced Forced-Choice** | Presents equally attractive strengths so no option is "the obvious right answer" | Structured itinerary planning vs. spontaneous local discovery |
| `importance_boundary` | **Importance & Boundary** | Separates a member's own preference from how essential it is in a partner | Relationship exclusivity, children goals, extended-family rhythm |
| `optional_reflection` | **Optional Open Reflection** | Qualitative conversation prompt shown on profile/match views; never scored by AI | Sharing a favourite neighbourhood walk or bookshop |

### Deterministic Option Shuffling by `semanticId`
Implemented in [`shuffleQuestionOptionsDeterministically`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L1097-L1112) and [`scoreShuffledResponseOption`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L1120-L1158):
- Every option carries a stable `semanticId` (e.g., `'sem-pace-reflective-letters'`) and `normalizedValue` (`0..100`) independent of its visual index (`0, 1, 2, 3`).
- Options are deterministically shuffled per member session (`seed = session-${memberId}-${questionId}`).
- Scoring always resolves `semanticId`, guaranteeing **100% score invariance** regardless of visual option order (`Test B`).

---

## 2. Original 60-Item Pilot Question Bank (`ORIGINAL / UNVALIDATED`) (Deliverable 7)

All items are **100% original to Kithra** and explicitly tagged `validationStatus: 'ORIGINAL / UNVALIDATED'` until empirical calibration on consented adult pilot cohorts.

### Theme 01: Conversational Pace & Presence (`Q01`–`Q12`)
1. **`Q01` (`direct_preference`, Stage 1, All Intentions, `communication`):** *"When you meet someone new on Kithra, what pace feels most natural to you?"*
   - `sem-pace-reflective-letters` (`25`): A few thoughtful longer messages each week before meeting in person.
   - `sem-pace-daytime-coffee` (`65`): A brief exchange followed by a calm voice call or daytime coffee walk.
   - `sem-pace-circle-gathering` (`85`): Connecting inside small topic Circles before one-on-one introductions.
2. **`Q02` (`contextual_trait`, Stage 1, All Intentions, `communication`):** *"During a demanding workweek, how do you usually handle incoming messages from someone you care about?"*
   - `sem-workweek-evening-window` (`35`): I wait until evening when I can reply with full attention.
   - `sem-workweek-short-note` (`65`): I send a quick warm note saying when I will be free to talk properly.
   - `sem-workweek-continuous` (`90`): I enjoy staying in touch with brief check-ins throughout the day.
3. **`Q03` (`situational_judgment`, Stage 1, All Intentions, `social_friendship`):** *"For a first in-person conversation in your city, which setting puts you most at ease?"*
   - `sem-firstmeet-quiet-walk` (`30`): A morning walk through a quiet park or bookshop street.
   - `sem-firstmeet-filter-coffee` (`60`): A 45-minute filter coffee or tea at a calm daytime café.
   - `sem-firstmeet-circle-table` (`85`): A hosted small-group Circle table where conversation is shared.
4. **`Q04` (`forced_choice`, Stage 2, All Intentions, `communication`):** *"In a long conversation, which role do you naturally gravitate toward first?"*
   - `sem-role-deep-listener` (`30`): Drawing the other person out with thoughtful questions.
   - `sem-role-mutual-weaver` (`60`): Trading stories back and forth at an even pace.
   - `sem-role-expressive-storyteller` (`85`): Bringing energy, humour, and vivid storytelling to break the ice.
5. **`Q05` (`contextual_trait`, Stage 2, All Intentions, `communication`):** *"How do you feel about voice notes compared to written messages?"*
   - `sem-medium-written-first` (`25`): I express myself best in writing where I can gather my thoughts.
   - `sem-medium-mixed` (`60`): Written notes for everyday plans, voice notes for longer stories.
   - `sem-medium-voice-call` (`90`): A 10-minute phone call feels much warmer than a long text thread.
6. **`Q06` (`situational_judgment`, Stage 2, All Intentions, `trust_reliability`):** *"If you need to reschedule a planned coffee or call, what feels most respectful?"*
   - `sem-resched-24h-new-time` (`90`): Giving at least a day's notice and proposing a concrete new time immediately.
   - `sem-resched-honest-check` (`65`): Letting them know as soon as the conflict arises and checking the next week together.
   - `sem-resched-flexible-window` (`35`): Keeping plans loosely pencilled in until the morning of the meet-up.
7. **`Q07` (`values_tradeoff`, Stage 2, All Intentions, `communication`):** *"When a friend or partner shares a problem they are facing, what is your first instinct?"*
   - `sem-support-empathy-first` (`35`): Listen quietly and validate how they feel before offering any advice.
   - `sem-support-ask-mode` (`75`): Ask whether they want a listening ear or practical brainstorming right now.
   - `sem-support-action-plan` (`90`): Help them map out clear, practical steps to solve the problem.
8. **`Q08` (`contextual_trait`, Stage 3, All Intentions, `autonomy_boundaries`):** *"After spending a wonderful afternoon talking with someone new, what do you usually need next?"*
   - `sem-postmeet-quiet-digest` (`25`): A quiet evening alone to read and let the conversation settle.
   - `sem-postmeet-short-note` (`65`): Sending a warm note of appreciation, then returning to my evening routine.
   - `sem-postmeet-keep-momentum` (`90`): Continuing the conversation or planning the next outing right away.
9. **`Q09` (`direct_preference`, Stage 3, All Intentions, `communication`):** *"What kind of humour helps you feel most connected to someone?"*
   - `sem-humour-dry-observational` (`35`): Quiet, observational wit about everyday life.
   - `sem-humour-warm-playful` (`70`): Warm, affectionate banter that never puts anyone down.
   - `sem-humour-spirited-story` (`85`): Lively, expressive storytelling and shared laughter around a group table.
10. **`Q10` (`importance_boundary`, Stage 3, All Intentions, `communication`):** *"How important is it that a close friend or partner shares your exact reply speed?"*
    - `sem-paceimp-flexible` (`85`): Very flexible—as long as we understand each other's rhythm, different paces are fine.
    - `sem-paceimp-moderate` (`55`): Somewhat important—checking in at least once a day keeps us connected.
    - `sem-paceimp-essential` (`20`): Essential—I feel happiest when our daily communication cadence matches closely.
11. **`Q11` (`situational_judgment`, Stage 3, All Intentions, `personality_traits`):** *"When conversation turns to a book, film, or idea neither of you has explored before, how do you react?"*
    - `sem-curiosity-dive-in` (`90`): I love asking questions to learn how they see it.
    - `sem-curiosity-bookmark` (`65`): I make a note to check it out later and return to common ground.
    - `sem-curiosity-familiar` (`30`): I prefer spending most of our time on shared interests we both know well.
12. **`Q12` (`optional_reflection`, Stage 3, All Intentions, `communication`):** *"Which neighbourhood walk, café, or quiet corner in your city makes for the best two-hour conversation?"*

### Theme 02: Everyday Values & Conflict Repair (`Q13`–`Q24`)
13. **`Q13` (`contextual_trait`, Stage 1, All Intentions, `conflict_repair`):** *"When two people see an important question differently, what helps you feel respected?"*
    - `sem-repair-clarifying-curiosity` (`90`): Asking clarifying questions before assuming what the other person meant.
    - `sem-repair-reflective-pause` (`75`): Taking a short pause to reflect privately, then returning to talk calmly.
    - `sem-repair-same-day-direct` (`82`): Addressing the concern warmly and directly on the same day.
14. **`Q14` (`situational_judgment`, Stage 1, All Intentions, `conflict_repair`):** *"If a misunderstanding happens over text message, how do you prefer to clear the air?"*
    - `sem-textrepair-voice-call` (`88`): Move to a calm phone call or in-person chat so tone isn't misread.
    - `sem-textrepair-thoughtful-note` (`70`): Write one clear, gentle message explaining my perspective and asking for theirs.
    - `sem-textrepair-sleep-on-it` (`40`): Pause until the next day so both of us can respond with a cool head.
15. **`Q15` (`values_tradeoff`, Stage 2, All Intentions, `personal_values`):** *"When honesty and tact pull in slightly different directions, how do you navigate it?"*
    - `sem-honesty-gentle-timing` (`80`): Share the truth gently, choosing a calm moment when the other person is ready to hear it.
    - `sem-honesty-direct-clarity` (`92`): Be direct and transparent right away so there is never any guesswork.
    - `sem-honesty-preserve-harmony` (`45`): Focus on kindness first and only raise critiques if the issue truly matters long-term.
16. **`Q16` (`contextual_trait`, Stage 2, All Intentions, `emotional_regulation`):** *"When plans go sideways—like a delayed train or a rained-out gathering—what is your usual state of mind?"*
    - `sem-stress-calm-pivot` (`90`): I take a breath and pivot to a backup plan without much fuss.
    - `sem-stress-quiet-reset` (`65`): I need ten quiet minutes to reset my expectations, then I'm fine.
    - `sem-stress-express-frustration` (`30`): I prefer to vent my frustration briefly with someone sympathetic before moving on.
17. **`Q17` (`situational_judgment`, Stage 2, All Intentions, `trust_reliability`):** *"What builds deep trust fastest for you in any relationship?"*
    - `sem-trust-small-consistency` (`90`): Consistency in small everyday promises—showing up when said and keeping confidences.
    - `sem-trust-emotional-candour` (`75`): Mutual vulnerability and sharing honest feelings early on.
    - `sem-trust-crisis-support` (`80`): Seeing how thoughtfully someone acts during a stressful or inconvenient moment.
18. **`Q18` (`forced_choice`, Stage 2, All Intentions, `conflict_repair`):** *"When offering an apology, what matters most to you?"*
    - `sem-apology-changed-action` (`90`): Demonstrating through consistent future action that the lesson was heard.
    - `sem-apology-explicit-acknowledgment` (`85`): Naming specifically how my action affected the other person without making excuses.
    - `sem-apology-warm-reconnection` (`70`): Restoring warmth and affection quickly so distance doesn't linger.
19. **`Q19` (`importance_boundary`, Stage 2, All Intentions, `autonomy_boundaries`):** *"How do you view privacy regarding conversations shared between two close people?"*
    - `sem-privacy-strict-confidence` (`95`): Personal matters shared in confidence stay strictly between the two of us.
    - `sem-privacy-explicit-ask` (`80`): I never share personal details with friends or family unless I have asked permission first.
    - `sem-privacy-trusted-confidant` (`40`): I occasionally seek perspective from one trusted confidant when I need advice.
20. **`Q20` (`contextual_trait`, Stage 3, All Intentions, `emotional_regulation`):** *(Paired Anchor A for `emotional_regulation`)* *"In a heated discussion where someone raises their voice, what do you need?"*
    - `sem-voice-boundary-pause` (`95`): A clear boundary that we pause and continue only when both of us can speak respectfully.
    - `sem-voice-deescalate-softly` (`75`): Lowering my own voice to help bring the room back to calm.
    - `sem-voice-match-passion` (`25`): Debating spiritedly in the moment and shaking hands right after.
21. **`Q21` (`contextual_trait`, Stage 3, All Intentions, `emotional_regulation`):** *(Paired Anchor B for `emotional_regulation`)* *"What is your non-negotiable standard for how disagreements are handled?"*
    - `sem-standard-mutual-respect` (`95`): Zero personal insults or intimidation; we pause if tempers flare and return with respect.
    - `sem-standard-written-cooldown` (`75`): Writing down thoughts first if a topic feels too emotionally charged to discuss aloud.
    - `sem-standard-blunt-debate` (`25`): Saying whatever is on our minds in the heat of the moment without holding back.
22. **`Q22` (`values_tradeoff`, Stage 3, All Intentions, `personal_values`):** *"Which everyday quality do you admire most in people close to you?"*
    - `sem-admire-steadiness` (`85`): Quiet dependability and following through without fanfare.
    - `sem-admire-empathy` (`88`): Deep emotional attentiveness and kindness toward everyone they meet.
    - `sem-admire-curiosity` (`80`): Intellectual curiosity and willingness to change their mind with new evidence.
23. **`Q23` (`situational_judgment`, Stage 3, All Intentions, `conflict_repair`):** *"If you and a close person have genuinely different tastes on an everyday habit, how do you view it?"*
    - `sem-diff-welcome-complement` (`90`, `welcomesComplementarity: true`): I enjoy when we bring different strengths and perspectives, as long as our core values align.
    - `sem-diff-parallel-space` (`70`, `welcomesComplementarity: true`): Happy for each of us to enjoy our own habit independently without pressuring the other.
    - `sem-diff-prefer-shared` (`25`, `welcomesComplementarity: false`): I feel most comfortable when our daily habits and preferences match closely.
24. **`Q24` (`optional_reflection`, Stage 3, All Intentions, `personal_values`):** *"What is one small everyday gesture that always makes you feel genuinely cared for?"*

### Theme 03: Social Energy, Context & Community (`Q25`–`Q36`)
25. **`Q25` (`situational_judgment`, Stage 1, Friendship & Dating, `personality_traits`):** *"Which kind of free Sunday leaves you feeling most restored?"*
    - `sem-sunday-quiet-walk-reading` (`35`): An early neighbourhood walk, reading, and an unhurried home-cooked lunch.
    - `sem-sunday-gallery-concert` (`88`): Visiting a gallery, concert, or craft market and talking over tea afterward.
    - `sem-sunday-hosting-table` (`78`): Cooking for a small table of close friends with music playing.
26. **`Q26` (`contextual_trait`, Stage 1, All Intentions, `social_friendship`, `contextTag: 'crowded_celebration'`):** *"When attending a lively festival, wedding, or community celebration with people you care about, how do you usually feel?"*
    - `sem-festival-energized-host` (`85`): Warm and energized—I enjoy celebrating with a full room of friends and family.
    - `sem-festival-small-corner` (`55`): Happy to attend for a couple of hours and catch up with a few close people in a quieter corner.
    - `sem-festival-brief-visit` (`25`): I make a brief, polite appearance and prefer intimate gatherings instead.
27. **`Q27` (`contextual_trait`, Stage 1, All Intentions, `social_friendship`, `contextTag: 'post_work_solitude'`):** *"At the end of an exhausting five-day workweek, how do you prefer to spend Friday evening?"*
    - `sem-friday-quiet-solitude` (`20`): Quiet solitude or a calm meal at home so I can recharge my energy.
    - `sem-friday-one-close-person` (`50`): Unwinding over dinner with one close friend or partner.
    - `sem-friday-group-outing` (`85`): Heading out to a lively social gathering to shake off the workweek.
28. **`Q28` (`forced_choice`, Stage 2, All Intentions, `social_friendship`):** *"In a community Circle or hobby group, what role feels most natural?"*
    - `sem-circle-organizer` (`90`): Helping organize the gathering and welcoming newcomers into the conversation.
    - `sem-circle-contributor` (`65`): Participating warmly in discussions and showing up consistently.
    - `sem-circle-observer` (`35`): Listening thoughtfully and connecting one-on-one with one or two people afterward.
29. **`Q29` (`direct_preference`, Stage 2, All Intentions, `daily_lifestyle`):** *"When does your natural energy peak during the day?"*
    - `sem-chrono-early-morning` (`85`): Early mornings—I love 6:30 AM walks, quiet coffee, and daytime plans.
    - `sem-chrono-steady-daytime` (`60`): Mid-morning through early evening at a steady pace.
    - `sem-chrono-late-evening` (`25`): Late evenings—my best reading and deepest conversations happen after 9:00 PM.
30. **`Q30` (`situational_judgment`, Stage 2, All Intentions, `adaptability_change`):** *"When planning a weekend trip to a nearby town or coast, how do you like to organize it?"*
    - `sem-travel-structured-anchor` (`85`, `welcomesComplementarity: true`): Book stays and key stops ahead of time so we can relax without logistics stress.
    - `sem-travel-hybrid-mosaic` (`65`, `welcomesComplementarity: true`): Anchor the accommodation and one main activity, leaving afternoons open to wander.
    - `sem-travel-spontaneous-spark` (`30`, `welcomesComplementarity: true`): Decide on the road and explore local recommendations spontaneously.
31. **`Q31` (`values_tradeoff`, Stage 2, All Intentions, `social_friendship`):** *"How do you balance long-standing friendships with meeting new people?"*
    - `sem-friends-deep-few` (`35`): I invest deeply in a small circle of lifelong friends and add new connections slowly.
    - `sem-friends-balanced-bridge` (`70`): I keep a close core group while staying open to thoughtful new circles.
    - `sem-friends-wide-gatherer` (`90`): I love bringing different circles of friends and new acquaintances together.
32. **`Q32` (`contextual_trait`, Stage 3, All Intentions, `autonomy_boundaries`):** *"When hosting or visiting friends at home, what cadence feels best?"*
    - `sem-homevisit-planned-ahead` (`80`): Planned a few days in advance with a clear start and end time.
    - `sem-homevisit-weekend-table` (`65`): Regular weekend tea or dinner tables with close friends.
    - `sem-homevisit-open-door` (`35`): Casual drop-in warmth whenever friends are in the neighbourhood.
33. **`Q33` (`direct_preference`, Stage 3, All Intentions, `personality_traits`):** *"Which shared activity sounds most appealing for a Saturday afternoon?"*
    - `sem-sat-bookshop-archive` (`80`): Browsing an independent bookshop, museum, or heritage walk.
    - `sem-sat-music-sabha` (`85`): Attending a live classical, indie, or acoustic music session.
    - `sem-sat-cooking-outdoors` (`70`): Cooking a meal together or taking a long nature walk outside the city.
34. **`Q34` (`importance_boundary`, Stage 3, All Intentions, `social_friendship`):** *"If you and a partner or close friend have different social battery sizes (one loves hosting, one loves quiet walks), how do you feel?"*
    - `sem-socialdiff-balance` (`90`, `welcomesComplementarity: true`): We can balance each other nicely if neither person pressures the other.
    - `sem-socialdiff-compromise` (`65`, `welcomesComplementarity: true`): Workable with clear communication and taking turns.
    - `sem-socialdiff-same-battery` (`25`, `welcomesComplementarity: false`): I strongly prefer someone with the same social energy level as mine.
35. **`Q35` (`situational_judgment`, Stage 3, All Intentions, `adaptability_change`):** *"When moving to a new neighbourhood or starting a new chapter, how do you build community?"*
    - `sem-newcity-routine-spots` (`45`): Becoming a regular at a local park, library, or café and letting friendships grow organically.
    - `sem-newcity-join-circles` (`80`): Joining structured interest Circles, walking clubs, or reading groups.
    - `sem-newcity-host-supper` (`90`): Inviting neighbours and colleagues over for a small meal.
36. **`Q36` (`optional_reflection`, Stage 3, All Intentions, `social_friendship`):** *"What kind of small-group Circle would you most love to join or host in your city?"*

### Theme 04: Independence, Home & Finances (`Q37`–`Q48` — Scoped to Dating & Matrimony)
37. **`Q37` (`values_tradeoff`, Stage 2, Dating & Matrimony, `adaptability_change`):** *"How do you prefer to approach shared household planning and personal independence?"*
    - `sem-finance-balanced-transparency` (`75`): Open conversations about shared goals alongside personal creative/discretionary space.
    - `sem-finance-structured-milestones` (`92`): Detailed joint planning for major milestones and household rhythms.
    - `sem-finance-flexible-autonomy` (`35`): High day-to-day independence with periodic check-ins on big decisions.
38. **`Q38` (`importance_boundary`, Stage 1, Dating & Matrimony, `romantic_expectations`):** *"What relationship structure are you looking for in this intention?"*
    - `sem-struct-exclusive-required` (`95`): Committed, monogamous exclusivity is essential for me (`exclusive_required`).
    - `sem-struct-flexible` (`55`): Open to discussing structure as trust develops (`flexible_either`).
    - `sem-struct-open-required` (`15`): Non-exclusive / ethically open structure is required (`open_required`).
39. **`Q39` (`situational_judgment`, Stage 2, Dating & Matrimony, `daily_lifestyle`):** *"In a shared home, how do you like domestic responsibilities (cooking, upkeep, errands) to work?"*
    - `sem-domestic-equal-strengths` (`90`, `welcomesComplementarity: true`): Egalitarian sharing where each person takes the tasks they enjoy most (e.g., one cooks, one manages logistics).
    - `sem-domestic-scheduled-roster` (`85`): A clear, structured weekly rhythm so responsibilities never fall unfairly on one person.
    - `sem-domestic-relaxed-flow` (`45`): Relaxed, flexible sharing as the week unfolds.
40. **`Q40` (`values_tradeoff`, Stage 2, Dating & Matrimony, `personal_values`):** *"When thinking about money and savings, which philosophy feels closest to yours?"*
    - `sem-money-steady-steward` (`88`): Building strong long-term security first while budgeting thoughtfully for travel and culture.
    - `sem-money-balanced-hybrid` (`70`): Equal focus on long-term savings and meaningful present-day experiences.
    - `sem-money-experiential` (`35`): Prioritizing learning, travel, and creative projects over strict long-horizon accumulation.
41. **`Q41` (`contextual_trait`, Stage 2, Dating & Matrimony, `autonomy_boundaries`):** *"In a close romantic partnership, how much solo time or personal hobby space do you need each week?"*
    - `sem-solo-high-autonomy` (`85`): A few dedicated hours each week for solo reading, walks, or creative work keeps me grounded.
    - `sem-solo-moderate-balance` (`60`): A healthy mix of shared evenings and occasional independent plans with friends.
    - `sem-solo-high-togetherness` (`25`): I love doing most weekend and evening activities together as a pair.
42. **`Q42` (`forced_choice`, Stage 3, Dating & Matrimony, `adaptability_change`):** *"When making a major life decision (like changing roles or moving homes), how do you decide?"*
    - `sem-decide-analytical-matrix` (`90`, `welcomesComplementarity: true`): Researching timelines, finances, and contingencies thoroughly before leaping.
    - `sem-decide-values-intuition` (`55`, `welcomesComplementarity: true`): Checking whether the choice aligns with our core values and emotional wellbeing.
    - `sem-decide-iterative-experiment` (`30`, `welcomesComplementarity: true`): Trying a small step first and adapting as we learn.
43. **`Q43` (`importance_boundary`, Stage 3, Dating & Matrimony, `adaptability_change`):** *"How open are you to relocating to another city in the next few years for career or family reasons?"*
    - `sem-reloc-anchored` (`25`): Strongly anchored in my current city due to work or community roots.
    - `sem-reloc-flexible` (`65`): Open to relocating together if the opportunity supports both of our goals.
    - `sem-reloc-mobile` (`90`): Excited by the possibility of living in different cities over time.
44. **`Q44` (`situational_judgment`, Stage 3, Dating & Matrimony, `daily_lifestyle`):** *"What kind of weekday evening atmosphere do you hope to come home to?"*
    - `sem-home-calm-sanctuary` (`85`): A quiet, peaceful sanctuary with tea, music, or unhurried conversation.
    - `sem-home-active-projects` (`65`): Cooking together, working on side projects, or heading out for an evening walk.
    - `sem-home-social-hub` (`35`): A lively home where friends and family frequently drop by.
45. **`Q45` (`values_tradeoff`, Stage 3, Dating & Matrimony, `romantic_expectations`):** *"How do you think about career ambition and work-life boundaries in a partnership?"*
    - `sem-worklife-protected-evenings` (`85`): Meaningful work during the day with protected, unplugged evenings and weekends.
    - `sem-worklife-mutual-seasons` (`75`): Supporting each other through intense career seasons as long as we take restorative breaks.
    - `sem-worklife-high-drive` (`40`): Both partners pouring high energy into ambitious professional or creative goals.
46. **`Q46` (`contextual_trait`, Stage 3, Dating & Matrimony, `conflict_repair`):** *"When discussing household budgets or shared expenses, what tone works best?"*
    - `sem-budgettone-calm-monthly` (`90`): A calm, scheduled monthly check-in where both voices carry equal weight.
    - `sem-budgettone-shared-pool` (`70`): Contributing proportionally to shared expenses while keeping personal accounts autonomous.
    - `sem-budgettone-as-needed` (`40`): Discussing major purchases only when they come up.
47. **`Q47` (`importance_boundary`, Stage 3, Dating & Matrimony, `autonomy_boundaries`):** *"How important is it that a partner respects your personal friendships and independent interests?"*
    - `sem-friendboundary-essential` (`95`): Essential—healthy partnerships thrive on mutual trust and independent friendships.
    - `sem-friendboundary-shared-circle` (`65`): Important, though I also enjoy gradually weaving our friend circles together.
    - `sem-friendboundary-couple-primary` (`30`): I prefer when we attend most social gatherings together as a couple.
48. **`Q48` (`optional_reflection`, Stage 3, Dating & Matrimony, `daily_lifestyle`):** *"What does a peaceful, well-balanced weekday evening at home look like to you?"*

### Theme 05: Long-Term Partnership & Family Context (`Q49`–`Q60` — Scoped to Matrimony)
49. **`Q49` (`importance_boundary`, Stage 2, Matrimony, `family_domestic`):** *"In a serious long-term partnership or marriage, how do you think about family and independence?"*
    - `sem-family-warm-autonomous` (`85`): Warm, affectionate ties with extended family alongside clear autonomy as a couple.
    - `sem-family-closely-interwoven` (`95`): Closely interwoven family life with frequent shared traditions and gatherings.
    - `sem-family-independent-first` (`45`): Building our own quiet household rhythm first while staying supportive from afar.
50. **`Q50` (`importance_boundary`, Stage 1, Matrimony, `family_domestic`):** *"How do you think about having or raising children in the future?"*
    - `sem-children-wants` (`90`): I hope to have or raise children (`wants_children`).
    - `sem-children-open` (`55`): Open to discussing together (`open_or_flexible`).
    - `sem-children-no` (`15`): I prefer a child-free partnership (`does_not_want_children`).
51. **`Q51` (`situational_judgment`, Stage 2, Matrimony, `family_domestic`):** *"When extended family offers strong advice on a decision that affects the two of you as a couple, how should it be handled?"*
    - `sem-inlaw-united-couple` (`90`): Listen respectfully, decide privately together as a couple, and communicate with one united, kind voice.
    - `sem-inlaw-collaborative-elders` (`60`): Weigh family elders' perspectives closely alongside our own preferences.
    - `sem-inlaw-clear-distance` (`40`): Keep couple decisions strictly separate from extended family input.
52. **`Q52` (`values_tradeoff`, Stage 2, Matrimony, `family_domestic`):** *"How do you envision caring for aging parents over the long term?"*
    - `sem-caregiving-equal-both-families` (`90`): Planning proactively as a team so both sets of parents receive equal care, emotional support, and dignity.
    - `sem-caregiving-nearby-independent` (`75`): Living nearby or arranging strong local support while maintaining our household rhythm.
    - `sem-caregiving-shared-roof` (`60`): Welcoming parents to live under the same roof when needed.
53. **`Q53` (`contextual_trait`, Stage 2, Matrimony, `daily_lifestyle`):** *"How do you approach cultural festivals, rituals, and family traditions in your own home?"*
    - `sem-tradition-meaningful-curated` (`75`): Keeping the traditions that feel meaningful and hospitable while creating our own couple rituals.
    - `sem-tradition-full-celebration` (`92`): Celebrating major festivals fully with extended family, traditional food, and music.
    - `sem-tradition-simple-quiet` (`35`): Keeping holidays low-key, restful, and simple.
54. **`Q54` (`forced_choice`, Stage 3, Matrimony, `conflict_repair`):** *"In a decade-long marriage, what keeps two people feeling like true teammates?"*
    - `sem-longterm-daily-kindness` (`90`): Small daily kindnesses, gratitude, and never taking each other's effort for granted.
    - `sem-longterm-shared-horizon` (`85`): Periodically revisiting shared goals and supporting each other's personal growth.
    - `sem-longterm-honest-repair` (`88`): Repairing disagreements early so unspoken resentment never builds up.
55. **`Q55` (`situational_judgment`, Stage 3, Matrimony, `adaptability_change`):** *"If one partner wants to take a career sabbatical or return to study, how would you approach it?"*
    - `sem-sabbatical-plan-together` (`90`): Plan a clear financial runway together so we can take turns supporting each other's growth.
    - `sem-sabbatical-cautious-buffer` (`65`): Support it once our core household savings buffer is fully secured.
    - `sem-sabbatical-steady-path` (`35`): I feel most secure when both of us maintain steady, predictable career paths.
56. **`Q56` (`values_tradeoff`, Stage 3, Matrimony, `family_domestic`):** *"Whenintroducing a potential marriage partner to your family, what timeline feels right?"*
    - `sem-familyintro-couple-clarity-first` (`80`): After the two of us have built mutual trust and clarity over several weeks of conversation.
    - `sem-familyintro-early-involvement` (`90`): Fairly early once we see strong shared values and mutual intention.
    - `sem-familyintro-unhurried-months` (`45`): Only after several months of deep one-on-one getting to know each other.
57. **`Q57` (`contextual_trait`, Stage 3, Matrimony, `trust_reliability`):** *"How do you think about health, preventive wellness, and supporting a partner through illness?"*
    - `sem-wellness-steady-partner` (`92`): Caring for everyday health together and showing up with steady patience during difficult seasons.
    - `sem-wellness-gentle-encouragement` (`75`): Encouraging healthy routines gently without policing each other.
    - `sem-wellness-autonomous` (`45`): Managing personal wellness routines independently while being there in emergencies.
58. **`Q58` (`importance_boundary`, Stage 3, Matrimony, `personal_values`):** *"How important is egalitarian respect (treating both partners' careers, families, and voices as equally important)?"*
    - `sem-egalitarian-essential` (`95`): Essential and non-negotiable for me.
    - `sem-egalitarian-complementary-roles` (`70`): Equal dignity with flexible, complementary day-to-day roles chosen by mutual agreement.
    - `sem-egalitarian-traditional` (`30`): I prefer more traditional household role divisions.
59. **`Q59` (`situational_judgment`, Stage 3, Matrimony, `communication`):** *"Before deciding on marriage, which conversations do you definitely want to have openly?"*
    - `sem-premar-all-foundations` (`95`): Finances, family boundaries, children preferences, conflict repair, and career mobility.
    - `sem-premar-values-and-temperament` (`80`): Core values, emotional steadiness, and how we handle everyday stress.
    - `sem-premar-organic-trust` (`50`): Letting those topics unfold naturally as we spend time together.
60. **`Q60` (`optional_reflection`, Stage 3, Matrimony, `family_domestic`):** *"What quality in a long-term marriage or partnership do you respect most when you see it in couples you admire?"*

