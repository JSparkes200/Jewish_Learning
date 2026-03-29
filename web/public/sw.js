/* Hebrew web — cache hashed Next static assets only (safe with App Router). */
const CACHE = "hebrew-web-static-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k !== CACHE ? caches.delete(k) : Promise.resolve())),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Only immutable build chunks — never cache document navigations or RSC.
  if (!url.pathname.startsWith("/_next/static/")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        try {
          cache.put(request, response.clone());
        } catch {
          /* ignore quota */
        }
      }
      return response;
    })(),
  );
});
