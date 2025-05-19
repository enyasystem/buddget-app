// Service Worker version for cache management
const CACHE_VERSION = "v1"
const CACHE_NAME = `budget-app-cache-${CACHE_VERSION}`

// Resources to cache immediately on install
const PRECACHE_RESOURCES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon-maskable-192x192.png",
  "/icon-maskable-512x512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/offline.html",
]

// Install event - precache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(PRECACHE_RESOURCES)
      })
      .then(() => self.skipWaiting()), // Activate immediately
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()), // Take control of all clients
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // For API requests, use network first, then cache
  if (event.request.url.includes("/api/")) {
    event.respondWith(networkFirstStrategy(event.request))
    return
  }

  // For navigation requests, use cache first, then network
  if (event.request.mode === "navigate") {
    event.respondWith(cacheFirstStrategy(event.request))
    return
  }

  // For other requests (assets, etc.), use stale-while-revalidate
  event.respondWith(staleWhileRevalidateStrategy(event.request))
})

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    // Cache the new response
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    // If offline and not in cache, show offline page
    return caches.match("/offline.html")
  }
}

// Network-first strategy for API requests
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    // Cache the response for offline use
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // If no cached response, return a custom offline response
    return new Response(
      JSON.stringify({
        error: "You are offline and this data is not cached.",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Stale-while-revalidate strategy for other assets
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request)

  // Clone the request because it's a one-time use stream
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      // Cache the new response
      caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse.clone()))
      return networkResponse
    })
    .catch((error) => {
      console.error("Fetch failed:", error)
    })

  // Return cached response immediately or wait for network
  return cachedResponse || fetchPromise
}

// Handle sync events for offline data synchronization
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-budget-data") {
    event.waitUntil(syncBudgetData())
  }
})

// Function to sync data when back online
async function syncBudgetData() {
  // Get all clients
  const clients = await self.clients.matchAll()

  // Send message to clients to sync data
  clients.forEach((client) => {
    client.postMessage({
      type: "SYNC_REQUIRED",
    })
  })
}

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
