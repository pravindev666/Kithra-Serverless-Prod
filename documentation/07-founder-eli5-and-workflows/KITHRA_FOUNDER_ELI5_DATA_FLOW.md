# KITHRA — PHASE 14: FOUNDER ELI5 DATA FLOW
## How Member Data Moves Through Kithra (Plain-English Walkthrough)

**Mission:** *"Not who society thinks you should love. Who truly understands you."*

---

### Step 1: A Member Opens the App
When a user opens Kithra on their phone or laptop:
- They log in using their email, phone number, or Google SSO.
- Firebase checks their credentials and signs a secure digital badge (JWT Token).
- The Kithra backend looks up that badge in a special ledger called `external_identities`.
- It finds their permanent Kithra Member ID (`usr_12345`).
- **Why this matters:** Even if the member switches from Google to Apple Sign-In or gets a new phone number tomorrow, their Kithra identity, circles, and conversations stay intact.

---

### Step 2: Finding Someone Who Truly Understands You
- The member explores people through our 3 Lenses (*Similar to Me*, *Different from Me*, *We Balance Each Other*).
- When they want to connect, they send an Introduction.
- If the other person accepts:
  - A **Canonical Pair** is locked into the cloud database.
  - Both members are immediately protected by our **Four-Space Suppression Invariant**: they cannot match with or message anyone else while this connection is active.
  - This eliminates dating app fatigue and superficial swiping.

---

### Step 3: Talking in Unhurried Calm
- When Member A types a message and hits send, the phone shows `Sending...` immediately so the UI feels fluid.
- Cloudflare saves the message in our Singapore database in less than 1 millisecond.
- The phone quietly changes the indicator to `Sent`.
- If Member A's train goes into a tunnel or Wi-Fi drops, the message shows `Failed • Click to Retry`. Tapping retry sends it safely without duplicating the text.

---

### Step 4: Graceful Controls (Unsend & Delete)
- If Member A makes an embarrassing typo, they tap **Unsend**. The database immediately overwrites the message with `[Message un-sent by sender]`. Both people see the neutral note; the typo is gone forever.
- If Member A wants to declutter their screen, they tap **Delete for Me**. It disappears from Member A's phone, while Member B's thread remains intact.

---

### Step 5: Gatherings and Private Salons
- When members want to meet in the real world, they join small, intentional **Circles** (capped at 6 to 22 people).
- The exact parlor or cafe address is **hidden** by default.
- Only members with a confirmed RSVP can see the address. This prevents uninvited drop-ins and protects member safety.

---

### Step 6: Leaving Kithra (Right to Erasure)
- If a member chooses to delete their account:
  - All identifying information (name, email, photos, bio) is scrubbed.
  - Their login credentials are removed.
  - Their past conversations respectfully display `"Deleted Member"` so their past friends don't experience a crashed or broken app.
  - Zero zombie data remains.
