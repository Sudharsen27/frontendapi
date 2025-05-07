// public/service-worker.js
const CACHE_NAME = 'my-pwa-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo192.png',  // Make sure you have these icons in the public folder
  '/logo512.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential files');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
