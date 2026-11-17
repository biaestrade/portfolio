// Escola de Magia: guarda a página para abrir sem internet. Sempre tenta a versão nova primeiro.
const CACHE = "escola-magia-v3";
const FILES = ["./", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./vd-elenco.jpg", "./vd-temporadas.jpg", "./vd-t1.jpg", "./vd-t2.jpg", "./vd-t3.jpg", "./vd-t4.jpg", "./vd-t5.jpg", "./vd-t6.jpg", "./vd-t7.jpg", "./vd-t8.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // planilha e fontes passam direto
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./")))
  );
});
