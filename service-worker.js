/* service-worker.js */
const CACHE_VERSION = "v3"; // <-- aumente para v4, v5... sempre que mudar o site
const CACHE_NAME = `kiosque-do-acai-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker.js",
  "/quiosque.jpg" // <-- importante: cache da foto
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("kiosque-do-acai-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // cache básico para arquivos do mesmo domínio
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        const CACHE_VERSION = "v4";
    
        return response;
      }).catch(() => cached);
    })
  );
});
