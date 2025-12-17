const BASE = '/habit-tracker-pwa';
const CACHE = 'habit-tracker-v1';

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE).then(cache =>
//       cache.addAll([
//         `${BASE}/`,
//         `${BASE}/index.html`,
//         `${BASE}/icon-192x192.png`,
//         `${BASE}/icon-512x512.png`,
//         `${BASE}/privacy.html`,
//         `${BASE}/terms.html`,
//       ])
//     )
//   );
// });
// // Install the service worker and cache the app shell
// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         console.log('Opened cache');
//         // Use { cache: 'reload' } to ensure we fetch the latest version from the network.
//         const requests = URLS_TO_CACHE.map(url => new Request(url, { cache: 'reload' }));
//         return cache.addAll(requests);
//       })
//       .catch(err => {
//         console.error('Failed to cache resources:', err);
//       })
//   );
// });

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(res => res || fetch(event.request))
//   );
// });

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', () => {});

// // Clean up old caches
// self.addEventListener('activate', event => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cacheName => {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });