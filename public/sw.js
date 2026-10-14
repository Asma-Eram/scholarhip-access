// ScholarBridge Service Worker — PWA & Offline Support
const CACHE_NAME = 'scholarbridge-cache-v1'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.png',
  '/logo.png',
  '/icon.png'
]

// Install: Precache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ScholarBridge SW] Precaching app shell')
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ScholarBridge SW] Precache warning:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ScholarBridge SW] Removing old cache', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch: Stale-while-revalidate for assets, Network-first for navigations
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Handle cross-origin requests (e.g. Google Fonts)
  if (url.origin !== self.location.origin) {
    if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.match(event.request).then((cached) => {
            const fetched = fetch(event.request).then((res) => {
              if (res.status === 200) cache.put(event.request, res.clone())
              return res
            }).catch(() => cached)
            return cached || fetched
          })
        })
      )
    }
    return
  }

  // Handle SPA navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const resClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('/index.html', resClone)
          })
          return response
        })
        .catch(() => {
          return caches.match('/index.html') || caches.match('/')
        })
    )
    return
  }

  // Handle static assets (CSS, JS, images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => {
          return cachedResponse
        })

      return cachedResponse || fetchPromise
    })
  )
})
