const CACHE_NAME = 'machine-manager-v2';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names => {
            return Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                // Fallback for offline
                return new Response('Offline', { status: 503 });
            });
        })
    );
});