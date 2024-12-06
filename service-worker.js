const CACHE_NAME = 'bridge-scorer-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.webmanifest'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
