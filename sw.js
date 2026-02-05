/* =========================================
   Triangle Toolkit — Service Worker
   Author: Muhammad Shourov
   Version: v3.0.0 (GitHub Pages Safe Build)
========================================= */

const CACHE_VERSION = "triangle-cache-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

/* GitHub Pages Subfolder */
const BASE_PATH = "/Triangle";

/* Files to Cache */
const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/about.html`,

  `${BASE_PATH}/assets/css/style.css`,

  `${BASE_PATH}/assets/js/encoding.js`,
  `${BASE_PATH}/assets/js/web-recon.js`,
  `${BASE_PATH}/assets/js/network-recon.js`,
  `${BASE_PATH}/assets/js/payloads.js`,
  `${BASE_PATH}/assets/js/generators.js`,
  `${BASE_PATH}/assets/js/ctf.js`,
  `${BASE_PATH}/assets/js/quiz.js`,

  `${BASE_PATH}/pages/encoding.html`,
  `${BASE_PATH}/pages/web-recon.html`,
  `${BASE_PATH}/pages/network-recon.html`,
  `${BASE_PATH}/pages/payloads.html`,
  `${BASE_PATH}/pages/generators.html`,
  `${BASE_PATH}/pages/ctf.html`,
  `${BASE_PATH}/pages/quiz.html`
];

/* ================= INSTALL ================= */
self.addEventListener("install", event => {
  console.log("▲ Triangle SW Installing");

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

  /* Ignore external APIs */
  if (!event.request.url.startsWith(self.location.origin)) return;

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
              return caches.match(`${BASE_PATH}/index.html`);
            }

          });
      })
  );
});

/* ================= MESSAGE ================= */
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
