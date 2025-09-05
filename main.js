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

// ------------------ LOADING ------------------
function hideLoading() {
  const loading = document.getElementById("loadingScreen");
  if (loading) {
    loading.style.opacity = 0;
    setTimeout(() => loading.remove(), 500);
  }
}

// ------------------ INIT ------------------
async function init() {
  const loading = document.getElementById("loadingScreen");
  if (loading) loading.style.display = "block";

  // Inicializamos fecha
  selectedDate = new Date();
  if (typeof renderCalendario === "function") {
    renderCalendario(selectedDate.getFullYear(), selectedDate.getMonth());
  }

  // Disparamos logo y turnos en paralelo
  const tasks = [];
  if (typeof cargarLogo === "function") {
    tasks.push(cargarLogo(username));
  }
  if (typeof cargarTurnos === "function") {
    const today = selectedDate.toISOString().split("T")[0];
    tasks.push(cargarTurnos(today));
  }

  // Ocultar loading cuando ambas tareas terminan (o fallan)
  Promise.allSettled(tasks).then(() => hideLoading());
}

document.addEventListener("DOMContentLoaded", init);
