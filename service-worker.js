// 1. [ ] Cache każdej strony na której jest użytkownik.
// 2. [ ] Po deploy-u zmieniamy wersję w nazwie Cache Storage-a.
// 3. [ ] Po deploy-u usuwamy wszystkie Cache Storage-e.??
// ---
// Bonus 1.
// Kiedy pojawi się nowy artykuł, użytkownicy dostaną powiadomienie Web Push.

let cacheSystemLog = console.log;
console.log = function (...args) {
    cacheSystemLog('[SW]', ...args);
};
console.red = function (...args) {
    cacheSystemLog('[SW] %c' + args[0], 'color: red', ...args.slice(1));
};
console.green = function (...args) {
    cacheSystemLog('[SW] %c' + args[0], 'color: green', ...args.slice(1));
};
console.blue = function (...args) {
    cacheSystemLog('[SW] %c' + args[0], 'color: blue', ...args.slice(1));
};
console.yellow = function (...args) {
    cacheSystemLog('[SW] %c' + args[0], 'color: yellow', ...args.slice(1));
};

const CACHE_NAME = 'piecioshka-v14';

// List of files which are store in cache.
let filesToCache = [
    '/test-pwa/',
    '/test-pwa/register-worker.js'
];

console.blue('[INIT] Name of cache container', CACHE_NAME, filesToCache, self);

self.addEventListener('activate', function (evt) {
    console.blue('[EVENT] activate', evt);
});

self.addEventListener('error', function (evt) {
    console.blue('[EVENT] error', evt);
});

self.addEventListener('push', function (evt) {
    console.blue('[EVENT] push', evt);
});

self.addEventListener('sync', function (evt) {
    console.blue('[EVENT] sync', evt);
});

self.addEventListener('message', function (evt) {
    console.blue('[EVENT] message', evt);
});

self.addEventListener('notificationclick', function (evt) {
    console.blue('[EVENT] notificationclick', evt);
});

self.addEventListener('notificationclose', function (evt) {
    console.blue('[EVENT] notificationclose', evt);
});

self.addEventListener('rejectionhandled', function (evt) {
    console.blue('[EVENT] rejectionhandled', evt);
});

self.addEventListener('unhandledrejection', function (evt) {
    console.blue('[EVENT] unhandledrejection', evt);
});

// Usuwamy wszystkie zapamiętane kontenery
function removeAllCacheContainers() {
    // console.log('removeAllCacheContainers');
    caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (container) {
            if (!caches.has(container)) {
                console.red('Cache "%s" is not found', container);
                return;
            }
            return caches.delete(container);
        }));
    });
}

self.addEventListener('install', function (evt) {
    console.blue('[EVENT] install', evt);

    // removeAllCacheContainers();

    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(filesToCache);
            })
            .catch(function (err) {
                console.red(err);
            })
    );
});

self.addEventListener('fetch', function (evt) {
    console.blue('[EVENT] fetch', evt.request.url);

    evt.respondWith(
        caches.match(evt.request)
            .catch(function (err) {
                console.red('fetch: failed', evt.request.url);
                console.red(err);
                return fetch(evt.request);
            })
            .then(function (response) {
                console.green('fetch (from cache): success', evt.request.url);
                // Zapisz do Cache Storage-a.
                caches.open(CACHE_NAME)
                    .then(function (cache) {
                        cache.put(evt.request, response);
                    });
                return response;
            })
    );
});
//
// self.addEventListener('fetch', function (evt) {
//     console.blue('fetch', evt.request.url);
//     evt.respondWith(
//         // Firstly, send request..
//         fetch(evt.request)
//             .then(function (response) {
//                 console.green('fetch: success', evt.request.url, response.statusText);
//                 return response;
//             })
//             .catch(function () {
//                 console.red('fetch: failed', evt.request.url);
//                 return caches.match(evt.request);
//             })
//     );
// });
