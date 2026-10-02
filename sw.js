/* =======================================================================
   sw.js — Service Worker Epsilon
   A la racine du site (pas dans assets/js/) : un service worker ne peut
   controler qu un scope egal ou en dessous du dossier ou vit son propre
   script. Les chemins sont construits a partir de self.registration.scope
   pour fonctionner aussi bien en local (racine) qu en prod GitHub Pages
   (sous /epsilon/).
   Precache des assets du site (meme origine) uniquement : amis.js est un
   fichier same-origin donc precache normalement, mais ses imports internes
   (Firebase, depuis www.gstatic.com) sont cross-origin et passent par la
   strategie reseau-puis-cache a la volee, jamais par le precache install
   (un seul echec CDN ne doit jamais bloquer l installation du SW).
   ======================================================================= */
var CACHE_NAME = 'epsilon-v1';
var BASE = self.registration.scope;
var PRECACHE = [
  '', 'index.html',
  'assets/css/style.css', 'assets/css/animations.css', 'assets/manifest.json',
  'assets/js/icones.js', 'assets/js/utils.js', 'assets/js/lessons.js',
  'assets/js/questions.js', 'assets/js/questions-geo.js', 'assets/js/shop.js',
  'assets/js/store.js', 'assets/js/progression.js', 'assets/js/games.js',
  'assets/js/geometrie.js', 'assets/js/ui.js', 'assets/js/app.js', 'assets/js/amis.js'
].map(function (p) { return BASE + p; });

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(PRECACHE.map(function (url) {
        return cache.add(url).catch(function (err) {
          console.warn('[sw] precache echoue pour', url, err);
        });
      }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var sameOrigin = event.request.url.indexOf(self.location.origin) === 0;

  if (sameOrigin) {
    event.respondWith(
      caches.match(event.request).then(function (cached) {
        var reseau = fetch(event.request).then(function (res) {
          if (res && res.status === 200) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
          }
          return res;
        }).catch(function () { return cached; });
        return cached || reseau;
      }).catch(function () {
        return caches.match(BASE + 'index.html');
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).then(function (res) {
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
        }
        return res;
      }).catch(function () {
        return caches.match(event.request);
      })
    );
  }
});
