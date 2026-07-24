const CACHE_NAME = 'buku-kas-v-simple-login-1';
const STATIC_FILES = ['./icon.svg', './manifest.json'];
const NETWORK_FIRST_FILES = new Set(['/', '/index.html', '/app.js', '/style.css']);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))),
      self.clients.claim()
    ]).then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(client => client.postMessage({ type: 'NEW_VERSION' })))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // API Apps Script dan semua origin eksternal selalu langsung ke network.
  if (url.origin !== self.location.origin) return;

  if (STATIC_FILES.some(file => url.pathname.endsWith(file.replace('./', '/')))) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        return response;
      }))
    );
    return;
  }

  if (NETWORK_FIRST_FILES.has(url.pathname) || url.pathname.endsWith('/index.html') ||
      url.pathname.endsWith('/app.js') || url.pathname.endsWith('/style.css')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
  }
});
