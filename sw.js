// Diyagram service worker: makes the site installable and quick to reopen.
// - Pages: network first, so updates show at once; the saved copy is used only when offline.
// - Pictures and icons: served from the saved copy, refreshed in the background.
// - Videos and /api are left to the browser (video uses range requests, which this cache can't hold).
const CACHE = 'diyagram-v2';
const CORE = ['/', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/ganesha.jpg', '/saraswati-v2.jpg', '/lakshmi-v2.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.endsWith('.mp4')) return;
  if (req.mode === 'navigate') {
    // only the plain home page is kept for offline use; card pages (/c/<code>, ?to=…) are always fetched fresh
    e.respondWith(fetch(req).then(res => {
      if (res.ok && url.pathname === '/' && !url.search) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('/', copy)); }
      return res;
    }).catch(() => caches.match('/')));
    return;
  }
  if (/\.(jpg|png|svg|webmanifest)$/.test(url.pathname)) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
