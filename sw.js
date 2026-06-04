const CACHE_NAME = 'speed-flow-v2';
const urlsToCache = ['./', './Index.html', './manifest.json'];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting(); // Força a atualização imediata do Service Worker
});

// Ativação: Limpa os caches velhos automaticamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
  self.clients.claim();
});

// Busca os dados (ESTRATÉGIA: NETWORK FIRST)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se tem internet, pega do GitHub, salva no cache e mostra na tela (Atualização Instantânea)
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => {
        // Se estiver sem internet (Offline), puxa do cache
        return caches.match(event.request);
      })
  );
});
