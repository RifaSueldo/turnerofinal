const CACHE_NAME = "turnox-cache-v2";
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
  // Agregá aquí cualquier JS, CSS o imagen que quieras cachear
];

// INSTALACIÓN
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activa SW inmediatamente
});

// ACTIVACIÓN: eliminar caches viejos
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

// FETCH: primero cache, luego red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.method === "GET") {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // fallback para páginas
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      });
    })
  );
});

// ESCUCHAR mensaje para forzar actualización
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
