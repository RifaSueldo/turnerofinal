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
