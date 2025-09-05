const CACHE_NAME = "turnox-cache-v3"; // nueva versión
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
  // Agregá cualquier JS, CSS o imagen que quieras cachear
];

// ------------------ INSTALL ------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activa SW inmediatamente
});

// ------------------ ACTIVATE ------------------
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

// ------------------ FETCH (network-first) ------------------
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Guardar la nueva versión en cache
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
        return networkResponse;
      })
      .catch(() => {
        // Si falla la red, usar cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;

          // Fallback para documentos HTML
          if (event.request.destination === "document") return caches.match("/index.html");
        });
      })
  );
});

// ------------------ ESCUCHAR MENSAJE PARA FORZAR UPDATE ------------------
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
