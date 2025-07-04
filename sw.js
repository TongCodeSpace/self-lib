const CACHE_NAME = 'reading-records-v202507042341';
const urlsToCache = [
  '/',
  '/index.html',
  '/manage.html',
  '/app.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // 对于HTML文件，使用Network First策略
  if (event.request.destination === 'document' || 
      event.request.url.includes('.html') || 
      event.request.url.includes('.js') ||
      event.request.url === location.origin + '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 如果网络请求成功，更新缓存并返回响应
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // 网络请求失败时，返回缓存的版本
          return caches.match(event.request);
        })
    );
  } else {
    // 对于其他资源（图片、字体等），使用Cache First策略
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 