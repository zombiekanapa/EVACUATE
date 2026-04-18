
const CACHE_NAME = 'safepoint-v2.0-offline';
const TILE_CACHE = 'map-tiles-cache-v2';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== TILE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * Normalizes tile URLs to ignore subdomains (a, b, c).
 * This ensures that a tile cached from 'a.tile...' is found when 'b.tile...' is requested.
 */
function normalizeTileUrl(url) {
  const urlObj = new URL(url);
  if (urlObj.hostname.includes('tile.openstreetmap.org') || urlObj.hostname.includes('tile-cyclosm.openstreetmap.fr')) {
    // Replace subdomains like a.tile, b.tile, c.tile with a placeholder 'tile'
    urlObj.hostname = urlObj.hostname.replace(/^[abc]\./, 'tile.');
    return urlObj.toString();
  }
  return url;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Tactical Tile Cache Strategy: Cache-First then Network update (Stale-While-Revalidate pattern for tiles)
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('tile-cyclosm.openstreetmap.fr')) {
    const normalizedUrl = normalizeTileUrl(request.url);
    
    event.respondWith(
      caches.open(TILE_CACHE).then((cache) => {
        return cache.match(normalizedUrl).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
              // We cache even opaque responses for no-cors tiles
              cache.put(normalizedUrl, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
             // Silently fail if network is unreachable, we have the cache
          });
          
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // General Assets: Network-First with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Listen for messages to clear the tile cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'CLEAR_TILE_CACHE') {
    caches.delete(TILE_CACHE).then(() => {
      console.log('Tile cache cleared.');
      if (event.source) {
        event.source.postMessage({ action: 'TILE_CACHE_CLEARED' });
      }
    });
  }
});
