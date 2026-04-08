const CACHE_NAME = "formulario-v" + Date.now();
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/sync.html",
  "/js/app.js",
  "/js/scripts.js",
  "/css/style.css",
  "/data/cities.json",
  "/data/states.json",
  "/img/expoagro/expo-agro-guanajuato.png",
  "/img/expoagro/expo-2025.png",
  "/img/expoagro/expo-2025-375x988.png",
  "/img/expoagro/expo.png",
  "/img/expoagro/expo-2025.png",
  "/img/expoagro/expo-2025-375x988.png",
  "/img/john-deere-logo.svg",
  "/fonts/icomoon.eot",
  "/fonts/icomoon.svg",
  "/fonts/icomoon.ttf",
  "/fonts/icomoon.woff",
  "/fonts/JDSansPro/JDSansPro-Bold.eot",
  "/fonts/JDSansPro/JDSansPro-Bold.svg",
  "/fonts/JDSansPro/JDSansPro-Bold.ttf",
  "/fonts/JDSansPro/JDSansPro-Bold.woff",
  "/fonts/JDSansPro/JDSansPro-Bold.woff2",
  "/fonts/JDSansPro/JDSansPro-BoldItalic.ttf",
  "/fonts/JDSansPro/JDSansPro-Book.ttf",
  "/fonts/JDSansPro/JDSansPro-BookItalic.ttf",
  "/fonts/JDSansPro/JDSansPro-CondBold.ttf",
  "/fonts/JDSansPro/JDSansPro-CondBoldItalic.ttf",
  "/fonts/JDSansPro/JDSansPro-CondBook.ttf",
  "/fonts/JDSansPro/JDSansPro-CondBookItalic.ttf",
  "/fonts/JDSansPro/JDSansPro-CondSemibold.ttf",
  "/fonts/JDSansPro/JDSansPro-CondSemiboldItalic.ttf",
  "/fonts/JDSansPro/JDSansPro-Light.ttf",
  "/fonts/JDSansPro/JDSansPro-LightItalic.ttf",
  "/fonts/JDSansPro/JDSansPro-Medium.ttf",
  "/fonts/JDSansPro/JDSansPro-MediumItalic.ttf",
  "/fonts/JDSansPro/JDSansPro-Semibold.eot",
  "/fonts/JDSansPro/JDSansPro-Semibold.svg",
  "/fonts/JDSansPro/JDSansPro-Semibold.ttf",
  "/fonts/JDSansPro/JDSansPro-Semibold.woff",
  "/fonts/JDSansPro/JDSansPro-Semibold.woff2",
  "/fonts/JDSansPro/JDSansPro-SemiboldItalic.ttf",
  'img/example/5076E.jpg',
  'img/example/titulo.png',
  'img/john-deere-logo.svg',
  'img/playstore.png',
  'img/expoagro/jdlink-boost-banner-text.png',
  'img/expoagro/banner-text.png',
  'img/expoagro/expo.png',
  'img/expoagro/jdlink-boost-expo-375x988.png',
  'img/expoagro/expo-375x988.png',
  'img/expoagro/jd-boost-expo.png',
  'img/expoagro/jdlink-boost-expo.png',
  'img/expoagro/jdlink-boost/banner-text.png',
  'img/expoagro/jdlink-boost/expo.png',
  'img/expoagro/jdlink-boost/expo-375x988.png',
  'img/expoagro/jdlink-boost/Copia de banner-text.png'
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
