// ------------------ SERVICE WORKER ------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(reg => {
        console.log("SW registrado:", reg);

        // Detectar nueva versión
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              // Nueva versión lista: fuerza recarga
              console.log("Nueva versión disponible");
              newSW.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            }
          });
        });
      })
      .catch(err => console.error("Error SW:", err));
  });
}

