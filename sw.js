/* =========================================
   Triangle Toolkit — ULTRA PRO PWA SW
   Author: Muhammad Shourov
   Version: v5.0.0
========================================= */

const SW_VERSION = "triangle-v5";
const STATIC_CACHE = `${SW_VERSION}-static`;
const HTML_CACHE = `${SW_VERSION}-html`;

/* Static Files (SAFE ONLY) */
const STATIC_FILES = [
  "/Triangle/",
  "/Triangle/index.html",
  "/Triangle/about.html",
  "/Triangle/assets/css/style.css"
];

/* INSTALL */
self.addEventListener("install", event => {
  console.log("▲ SW Installing v5");

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  console.log("▲ SW Activated v5");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!key.includes(SW_VERSION)) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* FETCH */
self.addEventListener("fetch", event => {

  const url = new URL(event.request.url);

  /* Only handle GET */
  if (event.request.method !== "GET") return;

  /* ================= JS → NETWORK ONLY ================= */
  if (url.pathname.endsWith(".js")) {
    event.respondWith(fetch(event.request));
    return;
  }

  /* ================= API → NETWORK ONLY ================= */
  if (url.hostname.includes("api") || url.hostname.includes("dns") || url.hostname.includes("crt")) {
    event.respondWith(fetch(event.request));
    return;
  }

  /* ================= HTML → NETWORK FIRST ================= */
  if (event.request.headers.get("accept").includes("text/html")) {

    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(HTML_CACHE).then(cache => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );

    return;
  }

  /* ================= CSS / STATIC → CACHE FIRST ================= */
  event.respondWith(
    caches.match(event.request)
      .then(cacheRes => {
        return cacheRes || fetch(event.request)
          .then(netRes => {
            const copy = netRes.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(event.request, copy));
            return netRes;
          });
      })
  );

});

/* ================= UPDATE MESSAGE SYSTEM ================= */
self.addEventListener("message", event => {

  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }

});
