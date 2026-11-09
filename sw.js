// Bolsillo Chori - service worker (funciona sin internet)
// Cada vez que cambies index.html, cambia este numero de version para que los telefonos se actualicen.
const VERSION = 'bc-c4c73d3a';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(async c => {
    await c.addAll(SHELL);
    // Los scripts del PDF se guardan para poder generar reportes sin internet.
    await Promise.all(CDN.map(u => fetch(u, {mode: 'no-cors'}).then(r => c.put(u, r)).catch(() => {})));
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // WhatsApp, mapas y llamadas siempre salen a internet.
  if (url.hostname === 'wa.me' || url.hostname.endsWith('google.com')) return;
  // La nube (Supabase) nunca se guarda en cache: siempre datos frescos.
  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('supabase.in') || url.pathname.startsWith('/rest/v1/') || url.pathname.startsWith('/auth/v1/')) return;
  // La pagina: primero internet (para recibir actualizaciones); sin internet, la copia guardada.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  // Todo lo demas: primero la copia guardada.
  e.respondWith(caches.match(req).then(m => m || fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })));
});
