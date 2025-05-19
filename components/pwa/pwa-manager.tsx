"use client"

import { useState, useEffect } from "react"
import { ServiceWorkerManager } from "./service-worker-manager"
import { OfflineIndicator } from "./offline-indicator"
import { OrientationHandler } from "./orientation-handler"

export function PWAManager() {
  const [isV0Environment, setIsV0Environment] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    // Check if we're in a v0 environment
    setIsV0Environment(window.location.hostname.includes("vusercontent.net"))
  }, [])

  return (
    <>
      {!isV0Environment && <ServiceWorkerManager />}
      <OfflineIndicator />
      <OrientationHandler />
    </>
  )
}
