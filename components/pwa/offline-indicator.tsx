"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useOnlineStatus } from "@/hooks/use-online-status"

export function OfflineIndicator() {
  const { isOnline, isV0Environment } = useOnlineStatus()
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)
  const [showOnlineAlert, setShowOnlineAlert] = useState(false)
  const [showV0Alert, setShowV0Alert] = useState(false)

  useEffect(() => {
    // Show appropriate alert when online status changes
    if (isOnline) {
      setShowOnlineAlert(true)
      setTimeout(() => setShowOnlineAlert(false), 3000)
    } else {
      setShowOfflineAlert(true)
    }

    // Show v0 environment alert once
    if (isV0Environment) {
      setShowV0Alert(true)
      setTimeout(() => setShowV0Alert(false), 8000)
    }
  }, [isOnline, isV0Environment])

  return (
    <>
      {/* Persistent offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            <WifiOff className="h-4 w-4" />
            <span>Offline Mode</span>
          </div>
        </div>
      )}

      {/* v0 environment alert */}
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md transition-all duration-300",
          showV0Alert ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none",
        )}
      >
        <Alert
          variant="default"
          className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Limited PWA Features</AlertTitle>
          <AlertDescription>
            Some PWA features like offline mode are limited in this preview environment. Deploy to Vercel for full
            functionality.
          </AlertDescription>
        </Alert>
      </div>

      {/* Temporary offline alert */}
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md transition-all duration-300",
          showOfflineAlert ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none",
        )}
      >
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription>
            {isV0Environment
              ? "Limited offline functionality is available in this preview environment."
              : "You can still use the app, but changes will sync when you're back online."}
          </AlertDescription>
        </Alert>
      </div>

      {/* Temporary online alert */}
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md transition-all duration-300",
          showOnlineAlert ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none",
        )}
      >
        <Alert
          variant="default"
          className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
        >
          <Wifi className="h-4 w-4" />
          <AlertTitle>You're back online</AlertTitle>
          <AlertDescription>Your changes have been synchronized.</AlertDescription>
        </Alert>
      </div>
    </>
  )
}
