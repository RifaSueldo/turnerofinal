self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("turnox-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/clientes.html",
        "/configuracion.html",
        "/creditos.html",
        "/login.html",
        "/perfil.html",
        "/turnos.html",
        "/icon-192.png",
        "/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
