var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function(event) {
  console.log("install");
  try {
    console.log('typeof System in install', typeof System);
  } catch (e) {}

  console.log('caching');
  event.waitUntil(
    caches.open('first-app').then(function(cache) {
      console.log('caching - getting');
      return cache.addAll([
          '/index.html',
          'http://code.jquery.com/jquery-1.11.1.min.js',
          'http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js',
          'http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css',
          '/src/css/jquery.mobile.icons-1.4.5.min.css',
          '/src/css/jquery.mobile.structure-1.4.5.min.css',
          '/listview-grid.css',
          '/src/js/app.js'

      ]);
    }).catch(function(error) {
      console.log('error', error)
    })
  );
});

    self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {

            });
        }
      })
  );
});





// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(res) {
//         return res;
//       })
//   );
// });


