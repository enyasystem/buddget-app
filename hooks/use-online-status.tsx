"use client"

import { useState, useEffect } from "react"
import { useBudgetStore } from "@/lib/store"

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const syncData = useBudgetStore((state) => state.syncData)
  const [isV0Environment, setIsV0Environment] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    // Check if we're in a v0 environment
    setIsV0Environment(window.location.hostname.includes("vusercontent.net"))

    // Set initial online status
    setIsOnline(navigator.onLine)

    // Handle online status changes
    const handleOnline = () => {
      setIsOnline(true)
      // Try to sync data when we come back online
      syncData()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Register for sync events if available and not in v0 environment
    if (!isV0Environment && "serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready
        .then((registration) => {
          // When back online, trigger a sync
          window.addEventListener("online", () => {
            registration.sync.register("sync-budget-data").catch((err) => {
              console.warn("Background sync registration failed:", err)
            })
          })
        })
        .catch((err) => {
          console.warn("Service worker not ready:", err)
        })
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [syncData, isV0Environment])

  return { isOnline, isV0Environment }
}
