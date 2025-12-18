const BASE = '/habit-tracker-pwa';
const CACHE = 'habit-tracker-v2'; // меняй версию при важных изменениях

const CORE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/icon-192x192.png`,
  `${BASE}/icon-512x512.png`,
  `${BASE}/privacy.html`,
  `${BASE}/terms.html`,
];

// 1) install: кладём в кэш ядро, но НЕ падаем из-за одного файла
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await Promise.allSettled(CORE.map((url) => cache.add(url)));
    })
  );
});

// 2) activate: чистим старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// 3) fetch: cache-first для своего домена, остальное — мимо
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // не трогаем сторонние домены (tailwind cdn и т.п.)
  if (url.origin !== self.location.origin) return;

  // трогаем только свой scope
  if (!url.pathname.startsWith(`${BASE}/`)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener('push', event => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || 'Habit Tracker', {
      body: data.body || 'Новое уведомление',
      icon: '/habit-tracker-pwa/icon-192x192.png',
      badge: '/habit-tracker-pwa/icon-192x192.png',
      data: {
        url: '/habit-tracker-pwa/',
      },
    })
  );
});


self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/habit-tracker-pwa/') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/habit-tracker-pwa/');
    })
  );
});
