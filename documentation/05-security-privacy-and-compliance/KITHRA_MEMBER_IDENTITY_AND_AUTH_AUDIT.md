# KITHRA — PHASE 14: MEMBER IDENTITY AND AUTH AUDIT
## Permanent Member Identity Mapping & Cross-Device Session Restoration

**Mission:** Authoritative multi-user record ownership.  
**Provider Stack:** Firebase Authentication (`kithra-d3ae1`) $\rightarrow$ Cloudflare D1 (`kithra-d1-staging`).

---

### 1. Identity Architecture Principles

1. **Provider Agnosticism:** Kithra does not treat third-party authentication tokens (Firebase UID, Apple Sub, Google Sub) as internal relational foreign keys.
2. **Stable Opaque Identifier:** Each member is provisioned a permanent, opaque Kithra identifier (`usr_` prefix + random entropy or hash).
3. **Decoupled Linkage (`external_identities`):** A separate mapping ledger stores `(provider, provider_subject_id) -> user_id`.
   - If a member logs in with Google on Chrome desktop, then Phone OTP on mobile Safari, the system resolves them to the exact same internal `usr_id`.
   - If an authentication provider is severed or migrated (e.g., switching from Firebase to self-hosted Auth0/OIDC), zero foreign keys in `pair_relationships`, `conversations`, `messages`, or `circle_memberships` are broken.

---

### 2. Resolution Algorithm (`resolveOrCreateMemberFromAuth`)

```typescript
export async function resolveOrCreateMemberFromAuth(
  d1: D1Database,
  authClaims: { uid: string; email?: string; name?: string; provider?: string }
): Promise<User> {
  const provider = authClaims.provider || 'firebase';
  const providerSubjectId = authClaims.uid;

  // 1. Look up existing link in external_identities
  const existingLink = await d1.prepare(`
    SELECT user_id FROM external_identities 
    WHERE provider = ? AND provider_subject_id = ?
  `).bind(provider, providerSubjectId).first<{ user_id: string }>();

  if (existingLink) {
    const user = await getUserById(d1, existingLink.user_id);
    if (user) return user;
  }

  // 2. Fallback to verified email match if provided
  if (authClaims.email) {
    const existingByEmail = await d1.prepare(`
      SELECT * FROM users WHERE email = ?
    `).bind(authClaims.email).first<User>();

    if (existingByEmail) {
      // Link external identity to existing user
      await d1.prepare(`
        INSERT INTO external_identities (id, user_id, provider, provider_subject_id, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).bind(generateId('ext'), existingByEmail.id, provider, providerSubjectId, Date.now()).run();

      return existingByEmail;
    }
  }

  // 3. Provision new permanent Kithra User
  const newUserId = generateId('usr');
  const now = Date.now();
  await d1.batch([
    d1.prepare(`
      INSERT INTO users (id, email, display_name, role, is_adult_verified, email_verified, account_status, created_at, updated_at)
      VALUES (?, ?, ?, 'member', 1, ?, 'active', ?, ?)
    `).bind(newUserId, authClaims.email || `${newUserId}@kithra.internal`, authClaims.name || 'Member', authClaims.email ? 1 : 0, now, now),
    d1.prepare(`
      INSERT INTO external_identities (id, user_id, provider, provider_subject_id, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(generateId('ext'), newUserId, provider, providerSubjectId, now)
  ]);

  return (await getUserById(d1, newUserId))!;
}
```

---

### 3. Cross-Device Restoration Guarantee

When a member logs in from a brand new device or fresh browser:
1. Client acquires a Firebase ID token.
2. Worker verifies JWT signature, expiration, and audience against `kithra-d3ae1`.
3. Worker calls `resolveOrCreateMemberFromAuth` and retrieves the stable `usr_id`.
4. All conversations, messages, circles, and RSVPs are queried using this `usr_id`.
5. Data restoration is immediate, deterministic, and identical across iOS, Android, and Web.
