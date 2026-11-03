# KITHRA — PHASE 14: FIREBASE UID TO MEMBER MAPPING SPECIFICATION
## Authoritative Identity Decoupling & Resolution

**Scope:** Authentication Bridge & Multi-Provider Architecture  
**Service:** `resolveOrCreateMemberFromAuth` in `src/server/d1Database.ts`

---

### 1. Problem Statement

Treating third-party identities (like Firebase Auth UID) as the direct database primary key creates severe system hazards:
1. **Multi-Provider Account Collision:** If a user signs in with Google (`firebase_uid_1`) and later signs in with Apple (`firebase_uid_2`) or Phone OTP, a naive system creates split ghost profiles.
2. **Provider Lock-in:** Migrating away from Firebase in the future would require updating millions of foreign key rows across messages, pairs, and audits.
3. **Leaked Provider Semantics:** Client applications can spoof claims if internal APIs rely on raw client-supplied UIDs rather than verified tokens.

---

### 2. The Identity Bridge Design

```
[ Mobile Safari / Android / Desktop Chrome ]
                   │
         (Firebase ID Token)
                   ▼
     [ Cloudflare Worker Edge ]
                   │
    verifyToken(token, "kithra-d3ae1")
                   ▼
  authClaims: { uid, email, provider }
                   │
         [ D1 Database Engine ]
                   │
        external_identities
    (provider, provider_subject_id)
                   │
                   ▼
               users.id  <──(Stable Opaque Kithra Member ID)
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
conversations                 messages
```

---

### 3. Identity Linking Rules

1. **Exact Subject Match:** If `(provider, provider_subject_id)` exists in `external_identities`, return the linked `user_id`.
2. **Verified Email Match:** If the provider is new but the account has a verified email matching an existing active user, insert a new row in `external_identities` linking the new provider to the existing `user_id`.
3. **New User Provisioning:** If no link or email match exists:
   - Generate `newUserId = generateId('usr')`.
   - Insert row into `users` with `role = 'member'`, `is_adult_verified = 1`, and `account_status = 'active'`.
   - Insert row into `external_identities` binding the provider credentials to `newUserId`.
   - Insert default row into `member_profiles`.
4. **Account Erasure:** Upon DPDP Act account deletion, `DELETE FROM external_identities WHERE user_id = ?` ensures the severed credentials can never access or restore the deleted profile.
