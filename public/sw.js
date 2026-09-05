// Minimal service worker. This site is server-rendered per-request (see
// `export const dynamic = "force-dynamic"` in app/page.tsx), so it
// deliberately does NOT cache pages or API responses - caching would risk
// serving stale profile data. Its only job is to register a `fetch` handler,
// which is one of the installability requirements browsers (notably Chrome
// on Android) check before offering the "Install app" prompt.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request));
});
