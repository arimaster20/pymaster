import { initApp } from "./ui.js";

window.addEventListener("error", (e) => {
  const el = document.getElementById("app");
  if (el) {
    el.innerHTML = `<div style="padding:20px;color:#e74c3c;font-family:monospace;white-space:pre-wrap;">PyMaster hit an error:\n${e.message}\n(${e.filename}:${e.lineno})</div>`;
  }
});

document.addEventListener("DOMContentLoaded", initApp);
