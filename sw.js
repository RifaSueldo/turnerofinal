// =====================
// Service Worker - TurnoX
// =====================

const CACHE_NAME = "turnox-cache-v3"; // Cambiar número de versión cuando actualices archivos
const urlsToCache = [
  "/",
  "/index.html",
  "/clientes.html",
  "/configuracion.html",
  "/creditos.html",
  "/login.html",
  "/perfil.html",
  "/turnos.html",
  "/style.css",
  "/main.js",
  "/favicon.ico",
  "/logo.png",
  // agregá cualquier JS, CSS o imagen que quieras cachear
];

// -------------------
// INSTALL
// -------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activa SW inmediatamente
});

// -------------------
// ACTIVATE
// -------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // toma control inmediato
});

// -------------------
// FETCH
// -------------------
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return; // solo cacheamos GET

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          // clonamos antes de cachear para evitar error "body already used"
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // fallback para páginas
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// -------------------
// FORZAR ACTUALIZACIÓN
// -------------------
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
