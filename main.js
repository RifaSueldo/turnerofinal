// ------------------ CARGANDO ------------------
function hideLoading() {
  const loading = document.getElementById("loadingScreen");
  if (loading) {
    loading.style.opacity = 0;
    setTimeout(() => loading.remove(), 500);
  }
}

// ------------------ INICIALIZACIÓN ------------------
async function init() {
  // Mostrar cargando (ya debería estar en HTML)
  const loading = document.getElementById("loadingScreen");
  if (loading) loading.style.display = "block";

  // Cargar logo si tenés esa función
  if (typeof cargarLogo === "function") {
    await cargarLogo(username);
  }

  // Inicializar fecha
  selectedDate = new Date();

  // Renderizar calendario si existe la función
  if (typeof renderCalendario === "function") {
    renderCalendario(selectedDate.getFullYear(), selectedDate.getMonth());
  }

  // Cargar turnos del día actual si existe la función
  if (typeof cargarTurnos === "function") {
    const todayStr = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    await cargarTurnos(todayStr);
  }

  // Ocultar loading
  hideLoading();
}

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
              // Nueva versión lista
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

// ------------------ START ------------------
document.addEventListener("DOMContentLoaded", init);
