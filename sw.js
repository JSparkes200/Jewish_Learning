// Service worker for עִבְרִית — Real Hebrew
const CACHE = 'ivrit-v7';
const base = self.location.pathname.replace(/sw\.js$/, '') || '/';

self.addEventListener('install', e => {
  const urls = ['index.html','hebrew-v8.2.html','manifest.json','icon.svg'].map(f=>base+f);
  e.waitUntil(
    caches.open(CACHE).then(cache => Promise.allSettled(urls.map(u=>cache.add(u))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin || u.pathname.indexOf(base) !== 0) return;
  const isHtml = (e.request.headers.get('accept') || '').includes('text/html');
  if (isHtml) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        if (res.status === 200) caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      if (res.status === 200) caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
