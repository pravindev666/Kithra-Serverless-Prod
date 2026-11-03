# KITHRA — PHASE 14: CIRCLE MEMBERSHIP & RSVP DATABASE
## Gathering Salon Invariants, Capacity Caps & Venue Security

**Gathering Standard:** Small tables and intentional salons capped at 6–22 members.  
**Privacy Invariant:** Venue addresses and private parlor coordinates are never revealed to non-confirmed attendees.

---

### 1. Database Schema for Circles & Salons

```sql
CREATE TABLE IF NOT EXISTS circles (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  space TEXT NOT NULL CHECK (space IN ('friendship', 'dating', 'matrimony', 'cofounders')),
  max_capacity INTEGER NOT NULL CHECK (max_capacity BETWEEN 6 AND 22),
  venue_details TEXT, -- Sensitive: Private salon address / parlor room
  city TEXT NOT NULL,
  scheduled_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS circle_memberships (
  circle_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('creator', 'steward', 'member')),
  rsvp_status TEXT NOT NULL CHECK (rsvp_status IN ('confirmed', 'waitlist', 'declined')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (circle_id, member_id),
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 2. The Strict Venue Protection Invariant

Private salons are safe havens. Stalking, unsolicited drop-ins, and venue exposure are neutralized by backend query sanitization in `d1Database.ts` and `apiRouter.ts`:

```typescript
export async function getCircleById(d1: D1Database, circleId: string, callerMemberId?: string): Promise<any> {
  const circle = await d1.prepare(`SELECT * FROM circles WHERE id = ?`).bind(circleId).first();
  if (!circle) return null;

  let isConfirmedAttendee = false;
  if (callerMemberId) {
    const membership = await d1.prepare(`
      SELECT rsvp_status FROM circle_memberships 
      WHERE circle_id = ? AND member_id = ?
    `).bind(circleId, callerMemberId).first<{ rsvp_status: string }>();

    isConfirmedAttendee = membership?.rsvp_status === 'confirmed' || circle.creator_id === callerMemberId;
  }

  // If caller is NOT a confirmed attendee, redact private venue coordinates
  if (!isConfirmedAttendee) {
    circle.venue_details = 'Private gathering location shared upon RSVP confirmation.';
    circle.venueDetails = circle.venue_details;
  }

  return circle;
}
```

---

### 3. Capacity Caps & Waitlist Promotion

1. **Strict 6–22 Capacity Cap:** `max_capacity` is validated by a database `CHECK (max_capacity BETWEEN 6 AND 22)`. No salon can become an overwhelming 50+ person party.
2. **Atomic RSVP Transaction:**
   - Active confirmed count is queried: `SELECT count(*) FROM circle_memberships WHERE circle_id = ? AND rsvp_status = 'confirmed'`.
   - If `count < max_capacity`, the member is enrolled as `'confirmed'`.
   - If `count >= max_capacity`, the member is enrolled as `'waitlist'`.
3. **Cancellation Promotion:** When a confirmed attendee cancels, the earliest waitlisted member is automatically promoted to `'confirmed'`.
