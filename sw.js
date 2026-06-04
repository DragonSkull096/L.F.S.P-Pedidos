const CACHE_NAME = 'speed-flow-cache-v1';
const urlsToCache = [
  './',
  './Index.html',
  './manifest.json',
  'https://unpkg.com/html5-qrcode'
];

// Instalação: Guarda o esqueleto do sistema no celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Busca os dados (Offline Fallback)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se achou no cache, devolve instantaneamente. Se não, busca na internet.
        return response || fetch(event.request);
      })
  );
});
