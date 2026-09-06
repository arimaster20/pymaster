import { initApp } from "./ui.js";

window.addEventListener("error", (e) => {
  const el = document.getElementById("app");
  if (el) {
    el.innerHTML = `<div style="padding:20px;color:#e74c3c;font-family:monospace;white-space:pre-wrap;">PyMaster hit an error:\n${e.message}\n(${e.filename}:${e.lineno})</div>`;
  }
});

// authSync.js (imported via ui.js) does a top-level await while it fetches
// the Firebase SDK, which delays this whole module's execution. By the time
// we get here, the page may have ALREADY fired "DOMContentLoaded" (and even
// "load") -- so waiting for those events via addEventListener would then
// never fire. Check readyState first and run immediately if we missed it.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

if ("serviceWorker" in navigator) {
  const registerSW = () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => console.warn("Service worker registration failed", err));
  };
  if (document.readyState === "complete") {
    registerSW();
  } else {
    window.addEventListener("load", registerSW);
  }
}
