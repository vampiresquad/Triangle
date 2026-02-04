/* =========================================
   Triangle Toolkit — Service Worker
   Author: Muhammad Shourov
   Version: v2.0.0 (Secure Production Build)
========================================= */

const CACHE_VERSION = "triangle-cache-v2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

/* Files to Cache (Core Assets) */
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/about.html",

  "/assets/css/style.css",

  "/assets/js/encoding.js",
  "/assets/js/web-recon.js",
  "/assets/js/network-recon.js",
  "/assets/js/payloads.js",
  "/assets/js/generators.js",
  "/assets/js/ctf.js",
  "/assets/js/quiz.js",

  "/pages/encoding.html",
  "/pages/web-recon.html",
  "/pages/network-recon.html",
  "/pages/payloads.html",
  "/pages/generators.html",
  "/pages/ctf.html",
  "/pages/quiz.html"
];

/* ================= INSTALL ================= */
self.addEventListener("install", event => {
  console.log("▲ Triangle SW Installing...");

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ================= ACTIVATE ================= */
self.addEventListener("activate", event => {
  console.log("▲ Triangle SW Activated");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

/* ================= FETCH ================= */
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {

        if (cached) return cached;

        return fetch(event.request)
          .then(response => {

            if (!response || response.status !== 200) return response;

            const clone = response.clone();

            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(event.request, clone));

            return response;
          })
          .catch(() => {

            if (event.request.destination === "document") {
              return caches.match("/index.html");
            }

          });
      })
  );
});

/* ================= MESSAGE (Future Upgrade Ready) ================= */
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
