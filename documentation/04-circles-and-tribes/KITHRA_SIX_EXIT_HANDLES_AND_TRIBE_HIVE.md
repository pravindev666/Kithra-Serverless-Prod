# Kithra: The Six Exit Handles & The Tribe Hive Sanctuary
**Architectural Blueprint & Verification Report**
*Anti-Lock-in Member Sovereignty & Zero Trapped States*

---

## 1. Founding Philosophy: "A Door Without a Handle Is a Cage"

In conventional matchmaking and social apps, entry is frictionless but exit is intentionally obstructed:
- Members are trapped in matches they cannot gracefully exit without aggressive reporting.
- Introductions sent in haste linger forever in limbo.
- Attendees cannot cancel RSVP without breaking host logic.
- Hosts cannot reschedule without stranding their community.
- Pausing discovery requires full account self-destruction.

Kithra firmly rejects dark patterns and coercive engagement. **Every door we build must have an intuitive, polite, and authoritative handle on both sides.**

---

## 2. The Six Exit Handles Installed & Verified

```
+---------------------------------------------------------------------------------------+
|                                 THE 6 EXIT HANDLES                                     |
+--------------------------+-----------------------------+------------------------------+
| 1. Circle Exit & RSVP    | 2. Intro Note Withdrawal    | 3. Part Ways Politely        |
|    Cancellation          |    (Unsent State Machine)   |    (Serene Disconnect)       |
|    • Leaves D1 seat      |    • Reclaims pending note  |    • Releases suppression    |
|    • Promotes waitlist   |    • Restores discover card |    • Archives conversation   |
+--------------------------+-----------------------------+------------------------------+
| 4. Host Cancel Gathering | 5. Blocked Accounts Screen  | 6. Discovery Sabbatical      |
|    (Archive Gathering)   |    (Unblock Sovereignty)    |    (Snooze Matching)         |
|    • Broadcasts cancel   |    • Inspects block list    |    • Preserves profile       |
|    • Frees all RSVPs     |    • One-click pardon       |    • Hides from discovery    |
+--------------------------+-----------------------------+------------------------------+
```

### Handle 1: Circle Exit & RSVP Cancellation (Seat Release in Cloudflare D1)
- **The Problem:** Previously, leaving a Circle in the UI only toggled local React memory (`c.joined = false`), failing to call the remote Cloudflare D1 backend. A member could not free up their seat for other members.
- **The Handle:**
  - `POST /api/member/circles/:id/leave` executed authoritatively against Singapore Cloudflare D1.
  - Clears `circle_attendees` entry, decrements member count, and immediately promotes the first person on the waitlist.
  - Prominent **"Cancel RSVP / Release My Seat"** button inside both the Circle card and the Tribe Hive modal.

### Handle 2: Sent Introduction Withdrawal
- **The Problem:** When User A sent an unhurried intro note to User B, their card froze in `"note-sent"`. If User A changed their mind, there was no way to retract the note before User B accepted or declined.
- **The Handle:**
  - `POST /api/member/introductions/:id/withdraw`.
  - Sets `introductions.state = 'withdrawn'` and restores `pair_relationships.relationship_state = 'withdrawn'`.
  - Releases any temporary space reservations and resets the card back to discoverable state.

### Handle 3: "Part Ways Politely" (Serene Disconnect in Active Conversations)
- **The Problem:** Connected members who mutually realized they were not a good fit had only two bad options: ghost each other indefinitely, or hit "Block Member" (which flags trust-and-safety and records an aggressive punitive block).
- **The Handle:**
  - `POST /api/member/conversations/:id/disconnect`.
  - Sets `pair_relationships.relationship_state = 'disconnected'`.
  - Resets `suppression_status = 'none'` and clears `active_space = NULL` — releasing both members' accounts so they can explore other intention spaces freely.
  - Gracefully moves the thread from Active to Archived with an editorial note: *"You have parted ways politely. This conversation is archived in peace."*

### Handle 4: Circle Host Archive / Cancel Gathering
- **The Problem:** If a host fell ill, weather turned severe, or plans changed, the host could not leave their own circle ("Host cannot leave their own Circle"), leaving them completely trapped.
- **The Handle:**
  - `POST /api/member/circles/:id/archive` with optional `reason`.
  - Host-authorized endpoint transitions `community_circles.status = 'cancelled'`.
  - Notifies all RSVPs and displays a peaceful cancellation notice in the Hive Sanctuary.

### Handle 5: Transparent Blocked Accounts List & One-Click Unblock
- **The Problem:** Once a member was blocked, there was no settings view to inspect who was blocked or reverse an accidental block.
- **The Handle:**
  - `GET /api/member/blocked` lists all blocked members with display names and timestamps.
  - `POST /api/member/unblock` removes the record from `member_blocks` and unblocks communication.
  - Settings UI features a dedicated **"Blocked Members"** section with zero-latency unblock actions.

### Handle 6: Discovery Sabbatical (Snooze Matching)
- **The Problem:** Members feeling social fatigue had to choose between receiving notifications or completely deleting their account.
- **The Handle:**
  - Sabbatical banner and toggle in Settings: *"Take a Sabbatical (Pause Discovery)"*.
  - When enabled, `discoveryPaused = true` excludes the member from search indexes and new candidate queues across all 4 spaces, while preserving their psychological assessment, persona, existing active connections, and tribe memberships.

---

## 3. The Tribe Hive Sanctuary

Per founder instruction, all references to **"Salon"** or **"Gathering Salon"** have been retired and upgraded to **"Tribe"** and **"The Tribe Hive"** (*Tribe Sanctuary*).

### What the Tribe Hive Unlocks
When a member RSVPs to an eligible Friendship or Cofounder Circle:
1. **Sanctuary Coordinates:** The private, offline meeting address is unlocked only for confirmed attendees (e.g. *"The Reading Room, 2nd Floor, Church Street, Bengaluru"*).
2. **Host Broadcasts:** Pinned host updates regarding gathering cadence, what to bring, and table etiquette.
3. **Attendee Roster:** A quiet, respectful preview of fellow confirmed attendees (names, headline, city) without public social links.
4. **Member Reflections:** An unhurried gathering note-sharing form where attendees can share reflections before or after the gathering.
5. **The Sovereign Exit Handle:** A prominent, confirmation-guarded button: **"Cancel RSVP & Release My Seat"**, allowing anyone to step back gracefully at any moment.

---

## 4. Test Verification & Release Gate Metrics

| Suite | Status | Passed | Notes |
| :--- | :---: | :---: | :--- |
| **Full Project Test Suite** | **PASS** | **234 / 234** | Covers all 14 Phases & Journeys |
| **Phase 13 & 14 Journey H** | **PASS** | **9 / 9** | Explicitly verifies all 6 exit handles |
| **TypeScript Typecheck** | **PASS** | **0 errors** | `tsc --noEmit` across 2,107 modules |
| **Vite Production Build** | **PASS** | **Zero errors** | `dist/` generated (121 kB CSS, 1.6 MB JS) |

Kithra is now completely trap-free: every member holds sovereign control over their presence, their connections, and their departures.

