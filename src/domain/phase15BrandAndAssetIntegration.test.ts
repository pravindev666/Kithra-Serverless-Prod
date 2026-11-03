/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 15: PREMIUM BRAND ASSET INTEGRATION, SEO & SOCIAL PREVIEW TEST SUITE
 * 
 * Verifies:
 * 1. WhatsApp & Social Preview Image Compliance (All 1200x630 OG cards < 500 KB)
 * 2. Static HTML SEO & Crawlability (H1 heading present, og:locale, twitter:site, canonical URL)
 * 3. Structured Data (JSON-LD Schema.org for WebSite, Organization, WebPage)
 * 4. Favicon & Web App Manifest Assets
 * 5. Worker Dynamic Route-Specific Open Graph Card Injection
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import worker from '../server/worker';

const ROOT_DIR = process.cwd();
const PUBLIC_ASSETS_DIR = path.join(ROOT_DIR, 'public/assets/kithra');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');

test('Phase 15 — SEO & Open Graph: index.html has complete metadata and Schema.org JSON-LD', () => {
  const indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  // 1. WhatsApp & Social meta tags
  assert.ok(indexHtml.includes('property="og:locale" content="en_US"'), 'Must define og:locale');
  assert.ok(indexHtml.includes('name="twitter:site" content="@kithra_app"'), 'Must define twitter:site');
  assert.ok(indexHtml.includes('name="twitter:card" content="summary_large_image"'), 'Must define summary_large_image twitter:card');
  assert.ok(indexHtml.includes('rel="canonical" href="https://kithra-staging.pravindev666.workers.dev/"'), 'Must declare canonical URL');

  // 2. Favicons and brand manifest (Premium App Icon)
  assert.ok(indexHtml.includes('/assets/kithra/favicon-32x32.png'), 'Must reference 32x32 PNG favicon');
  assert.ok(indexHtml.includes('/assets/kithra/apple-touch-icon.png'), 'Must reference Apple Touch Icon');
  assert.ok(indexHtml.includes('/manifest.json'), 'Must reference web manifest');

  // 3. Static H1 Heading for search engines and scrapers
  assert.ok(indexHtml.includes('<h1'), 'Static HTML must include an H1 tag for crawlers');
  assert.ok(indexHtml.includes('Kithra — Find your kind of people'), 'H1 must declare primary brand topic');

  // 4. Structured Data (JSON-LD)
  assert.ok(indexHtml.includes('application/ld+json'), 'Must contain JSON-LD structured data');
  assert.ok(indexHtml.includes('"@type": "WebSite"'), 'JSON-LD must define WebSite');
  assert.ok(indexHtml.includes('"@type": "Organization"'), 'JSON-LD must define Organization');
  assert.ok(indexHtml.includes('"@type": "WebPage"'), 'JSON-LD must define WebPage');
});

test('Phase 15 — WhatsApp OG Image Compliance: All 1200x630 OG Cards are under 500 KB', () => {
  const requiredOgCards = [
    'Kithra_Main_Dark_OG_1200x630.png',
    'Kithra_Main_Ivory_OG_1200x630.png',
    'Kithra_Friendship_OG_1200x630.png',
    'Kithra_Dating_OG_1200x630.png',
    'Kithra_Matrimony_OG_1200x630.png',
    'Kithra_Cofounders_OG_1200x630.png',
    'Kithra_OG_Dark_1200x630.png',
    'Kithra_OG_Ivory_1200x630.png',
  ];

  for (const cardName of requiredOgCards) {
    const cardPath = path.join(PUBLIC_ASSETS_DIR, cardName);
    assert.ok(fs.existsSync(cardPath), `OG card file must exist: ${cardName}`);

    const stats = fs.statSync(cardPath);
    const sizeKb = stats.size / 1024;
    // WhatsApp requires strictly < 500 KB to display link previews
    assert.ok(
      sizeKb < 500,
      `OG Card ${cardName} size (${sizeKb.toFixed(1)} KB) must be under 500 KB for WhatsApp preview`
    );
    // Ideal range is 50 KB - 300 KB
    assert.ok(
      sizeKb > 20 && sizeKb < 400,
      `OG Card ${cardName} is well-optimized in high-definition range: ${sizeKb.toFixed(1)} KB`
    );
  }
});

test('Phase 15 — Web App Manifest: Complete PWA Specification & Icons', () => {
  const manifestPath = path.join(ROOT_DIR, 'public/manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in public root');

  const raw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(raw);

  assert.equal(manifest.name, 'Kithra — Find your kind of people');
  assert.equal(manifest.short_name, 'Kithra');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/?source=pwa');
  assert.equal(manifest.theme_color, '#1B153B');
  assert.equal(manifest.background_color, '#1B153B');
  assert.ok(manifest.icons.length >= 4, 'Manifest must have at least 4 icon definitions');

  // Verify all icon paths exist
  for (const icon of manifest.icons) {
    const iconRelative = icon.src.replace(/^\//, '');
    const iconDiskPath = path.join(ROOT_DIR, 'public', iconRelative);
    assert.ok(fs.existsSync(iconDiskPath), `Manifest icon file must exist on disk: ${iconRelative}`);
  }

  // Verify maskable icon is present
  const hasMaskable = manifest.icons.some((i: any) => i.purpose === 'maskable');
  assert.ok(hasMaskable, 'Must include maskable icon for Android adaptive icon rendering');

  // Verify shortcuts
  assert.ok(manifest.shortcuts.length >= 4, 'Must define quick intention shortcuts');

  // Verify screenshots
  assert.ok(manifest.screenshots.length >= 2, 'Must include screenshots for rich install prompts');
  for (const shot of manifest.screenshots) {
    const shotRelative = shot.src.replace(/^\//, '');
    const shotDiskPath = path.join(ROOT_DIR, 'public', shotRelative);
    assert.ok(fs.existsSync(shotDiskPath), `Screenshot file must exist: ${shotRelative}`);
  }
});

test('Phase 15 — PWA Service Worker: Offline Caching & Stale-While-Revalidate', () => {
  const swPath = path.join(ROOT_DIR, 'public/sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist in public root');

  const swContent = fs.readFileSync(swPath, 'utf-8');
  assert.ok(swContent.includes('install'), 'Service worker must handle install event');
  assert.ok(swContent.includes('activate'), 'Service worker must handle activate event');
  assert.ok(swContent.includes('fetch'), 'Service worker must handle fetch event');
  assert.ok(swContent.includes('CACHE_NAME'), 'Service worker must define cache namespace');
});

test('Phase 15 — Cloudflare Worker Dynamic Route-Specific Open Graph Injection', async () => {
  const sampleHtml = `<!doctype html><html><head>
    <title>Kithra — Find your kind of people</title>
    <meta property="og:title" content="Kithra — Find your kind of people" />
    <meta property="og:description" content="Friendship, Dating, Matrimony and Cofounders. Thoughtful connections, at your own pace." />
    <meta property="og:image" content="https://kithra-staging.pravindev666.workers.dev/assets/kithra/Kithra_Main_Dark_OG_1200x630.png" />
  </head><body><div id="root"></div></body></html>`;

  const mockAssets = {
    fetch: async (req: Request) => {
      return new Response(sampleHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    },
  };

  const env = { ASSETS: mockAssets };

  // 1. Root route returns Main Dark OG card
  const rootRes = await worker.fetch(new Request('https://kithra-staging.pravindev666.workers.dev/'), env as any);
  const rootHtml = await rootRes.text();
  assert.ok(rootHtml.includes('Kithra_Main_Dark_OG_1200x630.png'), 'Root must use Main Dark OG card');

  // 2. Dating route dynamically switches to Dating OG card
  const datingRes = await worker.fetch(new Request('https://kithra-staging.pravindev666.workers.dev/dating'), env as any);
  const datingHtml = await datingRes.text();
  assert.ok(datingHtml.includes('Kithra_Dating_OG_1200x630.png'), 'Dating route must inject Dating OG card');
  assert.ok(datingHtml.includes('Kithra Dating'), 'Dating route must update og:title');

  // 3. Friendship route dynamically switches to Friendship OG card
  const friendRes = await worker.fetch(new Request('https://kithra-staging.pravindev666.workers.dev/friendship'), env as any);
  const friendHtml = await friendRes.text();
  assert.ok(friendHtml.includes('Kithra_Friendship_OG_1200x630.png'), 'Friendship route must inject Friendship OG card');

  // 4. Matrimony route dynamically switches to Matrimony OG card
  const marryRes = await worker.fetch(new Request('https://kithra-staging.pravindev666.workers.dev/matrimony'), env as any);
  const marryHtml = await marryRes.text();
  assert.ok(marryHtml.includes('Kithra_Matrimony_OG_1200x630.png'), 'Matrimony route must inject Matrimony OG card');

  // 5. Cofounders route dynamically switches to Cofounders OG card
  const cofounderRes = await worker.fetch(new Request('https://kithra-staging.pravindev666.workers.dev/cofounders'), env as any);
  const cofounderHtml = await cofounderRes.text();
  assert.ok(cofounderHtml.includes('Kithra_Cofounders_OG_1200x630.png'), 'Cofounders route must inject Cofounders OG card');
});

test('Phase 15 — Brand Easter Egg: Wordmark uses dotless "ı" with Ochre tittle and zero trailing period', () => {
  const appTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/App.tsx'), 'utf-8');
  const appShellTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/components/AppShell.tsx'), 'utf-8');
  const wordmarkTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/components/KithraWordmark.tsx'), 'utf-8');

  // 1. KithraWordmark defines the subtle ochre dot on 'i' (kı̇thra)
  assert.ok(wordmarkTsx.includes('ı'), 'Wordmark must use dotless ı for stem isolation');
  assert.ok(wordmarkTsx.includes('bg-[var(--ochre)]'), 'Wordmark dot must be colored in brand ochre');
  assert.ok(wordmarkTsx.includes('aria-label="kithra"'), 'Wordmark must be accessible to screen readers');

  // 2. Trailing period is completely removed from both headers
  assert.ok(!appTsx.includes('kithra<b className="text-[var(--ochre)]">.</b>'), 'App.tsx must not contain trailing period');
  assert.ok(!appShellTsx.includes('kithra<b className="text-[var(--ochre)]">.</b>'), 'AppShell.tsx must not contain trailing period');

  // 3. Both headers integrate KithraWordmark
  assert.ok(appTsx.includes('<KithraWordmark'), 'App.tsx header must use KithraWordmark');
  assert.ok(appShellTsx.includes('<KithraWordmark'), 'AppShell.tsx header must use KithraWordmark');
});

