# KITHRA — PHASE 12 GATHERING SALON SPECIFICATION
## Unhurried Small-Table Salon, Venue Privacy & Psychological Covenant

**Workspace:** `C:\Users\hp\Desktop\Kithra`  
**Date:** November 2026  
**Auditor:** Antigravity AI Engineering & Architecture  
**Mission:** *"Not who society thinks you should love. Who truly understands you."*

---

## 1. Concept: The Virtual Gathering Salon

In typical event apps, once an RSVP is submitted, members are either redirected to a noisy WhatsApp group or left with a static calendar invite.

Kithra introduces the **Gathering Salon**—an intentional, dignified, unhurried virtual chamber that precedes and follows the physical in-person gathering.

The Gathering Salon serves three essential purposes:
1. **Physical Safety & Privacy:** Obscures the specific address and timing until a member's RSVP is confirmed.
2. **Host Grounding & Logistics:** Gives the circle host a clear broadcast channel (Host Noticeboard) to communicate instructions (e.g., parking, dress comfort, reading excerpt).
3. **Unhurried Roundtable Reflections:** Provides an ambient, thoughtful conversation space where attendees can share reflections without chat notifications, read receipts, or instant-reply pressures.

---

## 2. Venue Privacy Protection Architecture

### 2.1 The Two-Tier Visibility Model

| Viewer Type | API Endpoint | Rendered Venue String | Salon Access |
| :--- | :--- | :--- | :--- |
| **Public / Non-Attendee** | `GET /api/member/circles/:id` | `"Private gathering location disclosed to confirmed attendees upon RSVP."` | Blocked (`HTTP 403 NOT_A_MEMBER`) |
| **Confirmed Attendee / Host** | `GET /api/member/circles/:id` & `.../salon` | Full physical address (e.g., *"Third Wave Coffee Roasters, Indiranagar, Bengaluru — Reserved back corner table"*). | Granted (`HTTP 200 OK`) |

### 2.2 Server-Side Enforcement in D1
In [src/server/d1Database.ts](file:///C:/Users/hp/Desktop/Kithra/src/server/d1Database.ts#L1250-L1275):

```typescript
// Query attendee membership in D1
const membership = await this.db
  .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
  .bind(circle.id, viewerId)
  .first<D1CircleMembershipRecord>();

const joined = membership && (membership.rsvp_status === 'confirmed' || membership.role === 'host');

// Privacy Invariant: Private venue details are sanitized if viewer is not joined or host
const venueDesc = joined
  ? (circle.venue_details || circle.venueDetails)
  : 'Private gathering location disclosed to confirmed attendees upon RSVP.';
```

Non-attendees never receive the venue coordinates over the wire. The data is intercepted and sanitized at the database query layer.

---

## 3. Gathering Salon UI Components

In [src/components/MemberViews.tsx](file:///C:/Users/hp/Desktop/Kithra/src/components/MemberViews.tsx#L2490-L2680), when a member views a circle they have joined (`circle.joined === true` or `isHost === true`), a prominent button appears:
`[ Enter Gathering Salon → ]`

Clicking this button sets `salonCircleId` and opens the full **Gathering Salon View**.

```
┌────────────────────────────────────────────────────────────────────────┐
│  ← Back to Circles Roster                                              │
│                                                                        │
│  INDIC WRITERS & PHILOSOPHY SALON                                      │
│  Format: Small table conversation (Max 12)  •  Cadence: Bi-weekly      │
│  Host: Ananya Rao  •  Confirmed Attendees: 7 / 12 Seats                │
├────────────────────────────────────────────────────────────────────────┤
│  📍 GATHERING VENUE & LOGISTICS (CONFIRMED ATTENDEE ACCESS)            │
│  Venue: Third Wave Coffee Roasters, 12th Main Indiranagar, Bengaluru   │
│         (Reserved back corner table under the ficus tree)             │
│  Timing: Saturday, Nov 14, 2026 at 10:30 AM IST                        │
├────────────────────────────────────────────────────────────────────────┤
│  📢 HOST NOTICEBOARD                                     [ + Post ]    │
│  "Welcome everyone. Please read Chapter 3 of 'The Forest Passage'      │
│   before our Saturday table. No slides, no pitches—just tea."          │
│   — Posted by Ananya Rao (Host) • 2 days ago                          │
├────────────────────────────────────────────────────────────────────────┤
│  💬 UNHURRIED ROUNDTABLE REFLECTIONS                                   │
│  • Vikram Joshi: "The line on quiet courage stayed with me all week." │
│  • Meera Patel: "Looking forward to meeting everyone in person."      │
│                                                                        │
│  [ Write a contemplative reflection...                      ] [ Share ]│
├────────────────────────────────────────────────────────────────────────┤
│  👥 CONFIRMED ATTENDEES (7 / 12)                                       │
│  [AR] Ananya Rao (Host)   [VJ] Vikram Joshi   [MP] Meera Patel ...     │
├────────────────────────────────────────────────────────────────────────┤
│  🛡️ KITHRA COMMUNITY COVENANT                                         │
│  "Every table is held in confidentiality. We listen without            │
│   interruption, judge without haste, and honor each person's pace."    │
│                                           [ Report Gathering Issue ]   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Mechanics of Salon Features

### 4.1 Host Noticeboard
- **Host Exclusivity:** Only the member with `role === 'host'` (or co-host) sees the `+ Post Notice` button.
- **Posting API:** `POST /api/member/circles/:id/notices` with `{ title, content }`.
- **Security Check:** If a non-host member posts, the API returns `HTTP 403: Only the circle host can post notices`.

### 4.2 Unhurried Roundtable Reflections
- **Reflection Composer:** Any confirmed attendee can post thoughts to the salon.
- **Posting API:** `POST /api/member/circles/:id/reflections` with `{ content }`.
- **Unhurried Cadence:** No typing indicators, no delivery ticks, and no real-time push interruptions. Posts are displayed chronologically with author name and relative timestamp.

### 4.3 Confirmed Attendee Roster
- Displays member avatars, names, and roles (Host vs Attendee).
- Shows live capacity tally (e.g., `7 / 12 seats filled`).
- Zero private phone numbers, email addresses, or raw personality vectors are revealed.

### 4.4 Psychological Safety Covenant & Report Action
- At the bottom of every salon, the non-negotiable **8 Community Respect Covenants** are reaffirmed.
- The `[ Report Gathering Issue ]` button opens a direct, confidential trust modal to alert Kithra stewards of boundary violations, harassment, or commercial solicitation.

