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



function hideLoading() {
  const loading = document.getElementById("loadingScreen");
  if (loading) {
    loading.style.opacity = 0;
    setTimeout(() => loading.remove(), 500);
  }
}

async function init() {
  const loading = document.getElementById("loadingScreen");
  if (loading) loading.style.display = "block";

  if (typeof cargarLogo === "function") await cargarLogo(username);
  selectedDate = new Date();
  if (typeof renderCalendario === "function") renderCalendario(selectedDate.getFullYear(), selectedDate.getMonth());
  if (typeof cargarTurnos === "function") await cargarTurnos(selectedDate.toISOString().split("T")[0]);

  hideLoading();
}

document.addEventListener("DOMContentLoaded", init);
