// This file is referred to in the main.js and it exists to handle our service worker

console.log('Service Worker: Registered');

//An array of file path strings that our app uses/requests.
const cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

/*
When our service worker is registered, an installation event is fired. We can use a normal event listener
on the service worker itself, using “self”.
*/
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('v1').then(function (cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

/*
We want to listen for a "fetch" event. 
*/
self.addEventListener('fetch', function (e) {
    e.respondWith( // respondWith method is used to prevent the default fetch event and provide it a promise.
        caches.match(e.request).then(function (response) { 
            // match method determines if the event request url already exists
            if (response) { //checking if we get back a response from the match query.
                console.log('Found ', e.request, ' in cache');
                return response;
            }
            // If true, the request already exist within the cache and return it. 
            // If false, the request doesn’t exist within the cache and we fetch the item like normal.
            else { //Or else, not just fetch the request, but also add it to the cache. 
                console.log('Could not find ', e.request, ' in cache, FETCHING!');
                return fetch(e.request)
                    .then(function (response) { // then method is chained, takes the response from the fetch
                        const clonedResponse = response.clone(); //clone our response since its used twice in order to prevent an error. 
                        caches.open('v1').then(function (cache) { 
                            // open our cache and use the put method to pair the request with a response
                            cache.put(e.request, clonedResponse);
                        })
                        return response;
                    })
                    .catch(function (err) { // this catch method logs for any errors
                        console.error(err);
                    });
            }
        })
    );
});