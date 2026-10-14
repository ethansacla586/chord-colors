// Chord Colors offline cache. Change VERSION whenever you upload new files so phones pick up the update.
const VERSION = 'chord-colors-v5';
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "core.js",
  "app.js",
  "favicon-32.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "bricolage-grotesque-latin-600-normal.woff2",
  "bricolage-grotesque-latin-800-normal.woff2",
  "figtree-latin-400-normal.woff2",
  "figtree-latin-500-normal.woff2",
  "figtree-latin-600-normal.woff2",
  "figtree-latin-700-normal.woff2",
  "jetbrains-mono-latin-500-normal.woff2",
  "jetbrains-mono-latin-700-normal.woff2"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // The page: network first so updates show up, cached copy when offline.
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put('index.html', copy)); return res; })
        .catch(() => caches.match('index.html'))
    );
    return;
  }
  // Instrument samples never change: cache first, no refresh.
  if (new URL(req.url).pathname.includes('/samples/')) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return res; })));
    return;
  }
  // Scripts, fonts and icons: cache first, refresh in the background.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return res; }).catch(() => hit);
      return hit || net;
    })
  );
});
