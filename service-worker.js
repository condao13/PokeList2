const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/imagem/OIP.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        // Limitando o tamanho do cache para evitar o crescimento indefinido
        return cache.keys().then(function(keys) {
          if (keys.length > 50) {
            return Promise.all(keys.map(function(key) {
              return cache.delete(key);
            }));
          }
        });
      })
      .then(function() {
        // Adicionando os recursos ao cache
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Verificar e limpar o cache periodicamente para garantir que não cresça indefinidamente
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Adicionar lógica adicional para outras estratégias de cache conforme necessário
