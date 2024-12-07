const CACHE_NAME = 'bridge-scorer-v1';
const ASSETS = [
  '/bridge-scorer/',
  '/bridge-scorer/index.html',
  '/bridge-scorer/app.js',
  '/bridge-scorer/manifest.json',
  '/bridge-scorer/icons/icon-72x72.png',
  '/bridge-scorer/icons/icon-96x96.png',
  '/bridge-scorer/icons/icon-128x128.png',
  '/bridge-scorer/icons/icon-144x144.png',
  '/bridge-scorer/icons/icon-152x152.png',
  '/bridge-scorer/icons/icon-192x192.png',
  '/bridge-scorer/icons/icon-384x384.png',
  '/bridge-scorer/icons/icon-512x512.png'
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
