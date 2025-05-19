"use client"

import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function ServiceWorkerManager() {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    // Check if we're in a v0 environment
    const isV0Environment = window.location.hostname.includes("vusercontent.net")

    // Only attempt to register service worker in production environments
    // and not in v0 environment which doesn't support service workers
    if (isV0Environment) {
      console.log("Service Worker registration skipped in v0 environment")
      return
    }

    // Register the service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker registered with scope:", registration.scope)

        // Detect controller change and reload the page
        let refreshing = false
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return
          refreshing = true
          window.location.reload()
        })

        // Check if there's a waiting service worker
        if (registration.waiting) {
          setWaitingServiceWorker(registration.waiting)
          setIsUpdateAvailable(true)
        }

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingServiceWorker(newWorker)
              setIsUpdateAvailable(true)
              toast({
                title: "Update Available",
                description: "A new version of the app is available. Refresh to update.",
                action: (
                  <button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium"
                    onClick={updateServiceWorker}
                  >
                    Update
                  </button>
                ),
                duration: 10000,
              })
            }
          })
        })
      } catch (error) {
        console.error("Service Worker registration failed:", error)
        setRegistrationError(error instanceof Error ? error.message : String(error))
      }
    }

    registerServiceWorker()

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "SYNC_REQUIRED") {
        // Trigger data synchronization
        console.log("Sync required from service worker")
        // You could dispatch an action to your store here
      }
    })
  }, [])

  // Function to update the service worker
  const updateServiceWorker = () => {
    if (!waitingServiceWorker) return

    // Send skip waiting message to the waiting service worker
    waitingServiceWorker.postMessage({ type: "SKIP_WAITING" })
    setIsUpdateAvailable(false)
    setWaitingServiceWorker(null)
  }

  // This component doesn't render anything visible
  return null
}
