// Minimal "app shell" service worker: caches PyMaster's own files so the
// app still opens (and previously-visited pages still work) offline or on
// a flaky connection. It deliberately leaves everything else (Pyodide,
// CodeMirror, Firebase, fonts -- all loaded from CDNs) alone, letting
// those go straight to the network untouched.

const CACHE_NAME = "pymaster-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./js/main.js",
  "./js/ui.js",
  "./js/curriculum.js",
  "./js/progress.js",
  "./js/pyodideRunner.js",
  "./js/authSync.js",
  "./js/cloudSync.js",
  "./js/firebaseConfig.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return; // let CDN requests pass through untouched
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
