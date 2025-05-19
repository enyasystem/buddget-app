"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function InstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isV0Environment, setIsV0Environment] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    // Check if we're in a v0 environment
    setIsV0Environment(window.location.hostname.includes("vusercontent.net"))

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Check if it's iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setInstallPromptEvent(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if the app was installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setInstallPromptEvent(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isV0Environment) {
      setIsDialogOpen(true)
      return
    }

    if (!installPromptEvent) {
      setIsDialogOpen(true)
      return
    }

    // Hide the dialog
    setIsDialogOpen(false)

    // Show the native install prompt
    installPromptEvent.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await installPromptEvent.userChoice

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
      setIsInstalled(true)
    } else {
      console.log("User dismissed the install prompt")
    }

    // Clear the saved prompt since it can't be used again
    setInstallPromptEvent(null)
  }

  if (isInstalled) {
    return null
  }

  return (
    <>
      {/* Install button that's always visible */}
      <Button variant="outline" size="sm" className="gap-2" onClick={handleInstallClick}>
        <Download className="h-4 w-4" />
        Install App
      </Button>

      {/* Install dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install Budget App</DialogTitle>
            <DialogDescription>
              {isV0Environment
                ? "Installation is not available in this preview environment. Deploy to Vercel for full PWA functionality."
                : isIOS
                  ? "Add this app to your home screen for a better experience. Tap the share button and then 'Add to Home Screen'."
                  : "Install this app on your device for offline access and a better experience."}
            </DialogDescription>
          </DialogHeader>

          {isV0Environment ? (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This is a preview environment with limited PWA functionality. To experience the full PWA features:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm mt-2">
                <li>Deploy this app to Vercel or another hosting provider</li>
                <li>Ensure the service worker is served with the correct MIME type</li>
                <li>Access the app from its deployed URL</li>
              </ul>
            </div>
          ) : isIOS ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <img
                  src="/pwa/ios-install.png"
                  alt="iOS installation instructions"
                  className="max-w-full h-auto rounded-md border"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                1. Tap the share button in Safari
                <br />
                2. Scroll down and tap "Add to Home Screen"
                <br />
                3. Tap "Add" in the top right corner
              </p>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">Installing the app will allow you to:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Use the app offline</li>
                <li>Get faster access from your home screen</li>
                <li>Receive budget notifications</li>
                <li>Enjoy a full-screen experience</li>
              </ul>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {!isV0Environment && !isIOS && installPromptEvent && (
              <Button onClick={handleInstallClick}>Install Now</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
