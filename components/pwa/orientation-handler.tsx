"use client"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export function OrientationHandler() {
  const [showRotatePrompt, setShowRotatePrompt] = useState(false)

  useEffect(() => {
    // Only run on mobile devices
    if (typeof window === "undefined" || window.innerWidth >= 768) {
      return
    }

    const checkOrientation = () => {
      // Check if the device is in portrait mode and the screen is narrow
      const isPortrait = window.matchMedia("(orientation: portrait)").matches
      const isNarrow = window.innerWidth < 480

      // Show rotate prompt for complex views in portrait mode on narrow screens
      const path = window.location.pathname
      const hash = window.location.hash

      // Only show for specific views that benefit from landscape
      const isComplexView = path.includes("/insights") || hash === "#charts" || hash === "#reports"

      setShowRotatePrompt(isPortrait && isNarrow && isComplexView)
    }

    // Check on mount and when orientation changes
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  if (!showRotatePrompt) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-background border rounded-lg p-3 shadow-lg",
        "flex items-center gap-3 max-w-[90%] transition-all duration-300",
        "animate-in fade-in slide-in-from-bottom-4",
      )}
    >
      <div className="bg-muted rounded-full p-2">
        <RotateCcw className="h-5 w-5 text-muted-foreground animate-spin-slow" />
      </div>
      <div>
        <p className="text-sm font-medium">Rotate for better view</p>
        <p className="text-xs text-muted-foreground">This screen looks better in landscape mode</p>
      </div>
    </div>
  )
}
