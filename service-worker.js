// --- Resilient Service Worker with Fallback Support ---
const CACHE_NAME = 'APNA_STORE_CACHE_V7.0.4';
const OFFLINE_PAGE = '/src/common/pages/offline.html';
const RUNTIME_CACHE = 'runtime-cache';
const MAX_RUNTIME_CACHE_AGE = 24 * 60 * 60; // 24 hours in seconds

// App Shell + Critical Assets (with priority levels)
const APP_SHELL_URLS = [
  // Tier 1 - Absolute Essentials
  { url: '/', priority: 1 },
  { url: '/index.html', priority: 1 },
  { url: '/manifest.json', priority: 1 },
  { url: '/src/common/pages/offline.html', priority: 1 },
  { url:   '/src/utils/pwa-install-handler.js', priority: 2 },
  
  // Tier 2 - Core Functionality
  { url: '/src/common/styles/main-style.css', priority: 2 },
  { url: '/src/common/scripts/main-script.js', priority: 2 },
  { url: '/src/utils/app-config.js', priority: 2 },
  { url: '/src/firebase/firebase-config.js', priority: 2 },
  
  // Tier 3 - Important Features
  { url: '/src/utils/partial-auto-loader.js', priority: 3 },
  { url: '/src/utils/view-manager.js', priority: 3 },
  { url: '/src/components/header.html', priority: 3 },
  { url: '/src/components/footer.html', priority: 3 },
  
  // Tier 4 - Secondary Features
  { url: '/src/common/styles/guest-account.css', priority: 4 },
  { url: '/src/common/styles/guest-account.html', priority: 4 },
  { url: '/src/common/scripts/guest-account.js', priority: 4 },
  { url: '/src/utils/data-manager.js', priority: 4 },
  { url: '/src/utils/theme-switcher.js', priority: 4 },
  
  // Tier 5 - Other Assets
  { url: '/src/assets/logos/app-logo-192.png', priority: 5 },
  { url: '/src/assets/logos/app-logo-512.png', priority: 5 },
  
  // Third-party
  { url: 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js', priority: 3 },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', priority: 3 },
  { url: 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap', priority: 4 }
];

// --- Improved Helper Functions ---
const isCacheable = (request) => {
  const url = new URL(request.url);
  return (
    request.method === 'GET' &&
    url.protocol.startsWith('http') &&
    !url.pathname.startsWith('/localstore/jsons/') &&
    !request.url.includes('firestore.googleapis.com') &&
    !request.url.includes('firebaseinstallations.googleapis.com') &&
    !request.url.includes('chrome-extension:') &&
    !request.url.includes('sockjs-node')
  );
};

const shouldCacheInRuntime = (request) => {
  return (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'script' ||
    request.destination === 'style'
  );
};

const addToCache = async (cacheName, request, response) => {
  if (response && response.ok) {
    try {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
      return true;
    } catch (error) {
      console.error(`Failed to cache ${request.url}:`, error);
      return false;
    }
  }
  return false;
};

const fromCache = async (request) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    const runtimeCache = await caches.open(RUNTIME_CACHE);
    return await runtimeCache.match(request);
  } catch (error) {
    console.error('Cache access error:', error);
    return undefined;
  }
};

const fromNetwork = async (request, cacheName) => {
  try {
    const response = await fetch(request);
    const responseClone = response.clone();
    
    if (cacheName && shouldCacheInRuntime(request)) {
      await addToCache(cacheName, request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.warn(`Network request failed: ${request.url}`, error);
    throw error;
  }
};

// --- Resilient Installation ---
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing with resilience...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Sort URLs by priority (lower number = higher priority)
      const sortedUrls = [...APP_SHELL_URLS].sort((a, b) => a.priority - b.priority);
      
      // Try caching each file individually with fallback
      for (const { url } of sortedUrls) {
        try {
          await cache.add(url).catch(async (err) => {
            console.warn(`Failed to cache ${url}, trying fallback...`, err);
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          });
        } catch (err) {
          console.error(`Final failure caching ${url}`, err);
          // Continue to next file even if this one fails
        }
      }
      
      // Skip waiting even if some files failed to cache
      await self.skipWaiting();
      console.log('Service Worker: Installation completed (some files may have failed)');
    })()
  );
});

// --- Activation ---
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
      
      // Clean up expired runtime cache entries
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      const requests = await runtimeCache.keys();
      
      await Promise.all(
        requests.map(async request => {
          const response = await runtimeCache.match(request);
          if (response) {
            const date = new Date(response.headers.get('date'));
            if (Date.now() - date > MAX_RUNTIME_CACHE_AGE * 1000) {
              await runtimeCache.delete(request);
            }
          }
        })
      );
      
      await self.clients.claim();
      console.log('Service Worker: Activation completed');
    })().catch(err => {
      console.error('Activation failed:', err);
      // Even if cleanup fails, we still want to activate
      return self.clients.claim();
    })
  );
});

// --- Fetch Handling ---
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (!isCacheable(request)) return;

  // Navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fromNetwork(request);
          return networkResponse;
        } catch (error) {
          console.log('Network failed, serving from cache:', request.url);
          const cached = await fromCache(request);
          return cached || caches.match(OFFLINE_PAGE);
        }
      })()
    );
    return;
  }

  // API requests
  if (request.url.includes('/api/')) return;

  // App Shell assets
  if (APP_SHELL_URLS.some(item => request.url.includes(item.url))) {
    event.respondWith(
      (async () => {
        const cached = await fromCache(request);
        if (cached) {
          event.waitUntil(
            fromNetwork(request, CACHE_NAME)
              .catch(err => console.warn('Background update failed:', err))
          );
          return cached;
        }
        return fromNetwork(request, CACHE_NAME);
      })()
    );
    return;
  }

  // All other assets
  event.respondWith(
    (async () => {
      const cached = await fromCache(request);
      if (cached) {
        event.waitUntil(
          fromNetwork(request, RUNTIME_CACHE)
            .catch(err => console.warn('Background update failed:', err))
        );
        return cached;
      }
      return fromNetwork(request, RUNTIME_CACHE);
    })()
  );
});