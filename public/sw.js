/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PWA SERVICE WORKER
 * 
 * Provides offline shell caching, stale-while-revalidate for static assets,
 * and graceful fallback for mobile and desktop PWA installations.
 */

const CACHE_NAME = 'kithra-pwa-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/kithra/favicon.svg',
  '/assets/kithra/android-chrome-192x192.png',
  '/assets/kithra/android-chrome-512x512.png',
];

// Install Event — precache core offline assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Non-blocking in environments where some assets are lazily generated
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — cleanup outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — smart caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Bypass Service Worker for API calls and non-GET requests
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Navigation requests (HTML pages) -> Network first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html').then((cached) => {
          return cached || new Response('Offline — Please check your network connection.', {
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
    );
    return;
  }

  // 3. Static assets (CSS, JS, Fonts, Images) -> Stale-while-revalidate
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});

