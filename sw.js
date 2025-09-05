// sw.js

// Generamos un cache único usando timestamp para que siempre se renueve al subir cambios
const CACHE_NAME = "turnox-cache-" + new Date().getTime();

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
  // agregá cualquier otro recurso que quieras cachear
];

// ------------------ INSTALACIÓN ------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  // activa el SW inmediatamente sin esperar
  self.skipWaiting();
});

// ------------------ ACTIVACIÓN ------------------
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
  // toma control inmediato de todas las pestañas
  self.clients.claim();
});

// ------------------ FETCH ------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          // Clonamos la respuesta solo si es GET
          if (event.request.method === "GET") {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // fallback para documentos si no hay conexión
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// ------------------ MENSAJES ------------------
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
