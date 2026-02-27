const CACHE_VERSION = "v10"; // aumente sempre que mexer (v11, v12...)
const CACHE_NAME = `kiosque-acai-${CACHE_VERSION}`;

const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker.js",
  "/logo.png",
  "/quiosque.jpg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k.startsWith("kiosque-acai-") && k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
