# KITHRA — PHASE 14: CLOUDFLARE R2 MEDIA STORAGE DESIGN
## Pre-Signed URL Architecture, Content Moderation & Access Control

**Storage Provider:** Cloudflare R2 (S3-Compatible Object Storage)  
**Security Standard:** Zero public read access; authenticated pre-signed URL generation.

---

### 1. Architectural Overview

Kithra members upload curated, calm portrait photographs and salon materials. To prevent DDoS vectors and database bloat, image binaries are stored in Cloudflare R2, while D1 stores only verified metadata references.

```
[ Member Client ] ──(1. Request Upload URL)──> [ Cloudflare Worker ]
       │                                              │
       │                                     (Validate Auth, Mime, Quota)
       │                                              │
       │ <───(2. Return Pre-signed PUT URL)───────────┘
       │
       └───(3. Direct Binary PUT)───> [ Cloudflare R2 Bucket: kithra-media-staging ]
                                                      │
                                             (Background Scan / Size Check)
                                                      │
[ Member Client ] ──(4. Confirm Upload)───────> [ Cloudflare Worker ]
                                                      │
                                             (Persist R2 Key in D1 member_profiles)
```

---

### 2. Pre-Signed URL Generation Specification

- **Bucket Name:** `kithra-media-staging` (Singapore / APAC region)
- **Object Key Convention:** `media/{space}/{userId}/{uuid}.{ext}`
- **TTL:** 10 minutes (600 seconds)
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`
- **Max File Size:** 5 MB per photo (enforced via `Content-Length-Range` header in pre-signed policy)

```typescript
// Worker R2 Binding: env.MEDIA_BUCKET
export async function generateMediaUploadUrl(
  r2: R2Bucket,
  userId: string,
  space: string,
  contentType: string
): Promise<{ uploadUrl: string; objectKey: string }> {
  const extension = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
  const objectKey = `media/${space}/${userId}/${crypto.randomUUID()}.${extension}`;
  
  // Custom signed URL logic using AWS S3 v4 signature algorithm on Worker edge
  const uploadUrl = await createPresignedR2PutUrl(r2, objectKey, 600, contentType);
  return { uploadUrl, objectKey };
}
```

---

### 3. Media Serving & Redaction

1. **Private Access:** The R2 bucket does not have public read access enabled.
2. **CDN Delivery:** Images are served through Cloudflare Workers with edge caching (`Cache-Control: private, max-age=86400`) and signed authorization cookies.
3. **Account Deletion / Purge:** When a member invokes DPDP Act account erasure, a background job purges all R2 objects prefixed with `media/*/{userId}/`.
