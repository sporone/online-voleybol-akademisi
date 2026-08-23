export function registerPwa() {
  if (!import.meta.env.PROD) {
    if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistrations().then(registrations=>registrations.forEach(registration=>registration.unregister()));
    if ("caches" in window) caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key))));
    return;
  }
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      window.setTimeout(() => sessionStorage.removeItem("pwa-controller-reloaded"), 5000);
      const registration = await navigator.serviceWorker.register("/sw.js", { scope:"/", updateViaCache:"none" });
      registration.update();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update();
      });
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (sessionStorage.getItem("pwa-controller-reloaded")) return;
        sessionStorage.setItem("pwa-controller-reloaded", "1");
        window.location.reload();
      });
    } catch (error) {
      console.warn("Çevrim dışı destek etkinleştirilemedi:", error);
    }
  }, { once:true });
}
