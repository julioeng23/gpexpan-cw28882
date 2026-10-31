/* GPEXPAN CW28882 — service worker: deixa o programa abrir sem internet depois da 1ª visita.
   Publique este arquivo na MESMA pasta do GPEXPAN_CW28882_DigitalTwin.html (servidor https). */
const CACHE = 'gpx-cw28882-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET') return;
  if(/dados\.json/.test(u.pathname)) return;   // dados: sempre da rede (o programa já trata a falta de internet)
  // o programa (HTML) e as bibliotecas: rede primeiro (pega a versão nova), cache se estiver sem sinal
  if(u.origin === location.origin || /jsdelivr|cdnjs|googleapis|gstatic/.test(u.host)){
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
  }
});
