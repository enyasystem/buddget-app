"use client"

import { useState, useEffect } from "react"
import { Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DeploymentGuide() {
  const [isV0Environment, setIsV0Environment] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    // Check if we're in a v0 environment
    setIsV0Environment(window.location.hostname.includes("vusercontent.net"))
  }, [])

  if (!isV0Environment) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          PWA Deployment Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deploying as a Progressive Web App</DialogTitle>
          <DialogDescription>Follow these steps to deploy this app as a fully functional PWA</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Limited PWA Features in Preview</AlertTitle>
            <AlertDescription>
              The v0 preview environment doesn't support service workers with the correct MIME type, limiting PWA
              functionality.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="font-medium">Deployment Steps:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Export this project to your GitHub repository using the "Export to GitHub" option</li>
              <li>Create a new project on Vercel and import your GitHub repository</li>
              <li>Deploy the project without changing any settings</li>
              <li>Access your app at the Vercel-provided URL</li>
              <li>Verify that service worker registration succeeds in the browser console</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Troubleshooting:</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                Ensure the <code>sw.js</code> file is in the public directory
              </li>
              <li>
                Verify that the service worker is registered in <code>service-worker-manager.tsx</code>
              </li>
              <li>Check that the MIME type for .js files is set to 'application/javascript'</li>
              <li>Clear browser cache and reload if needed</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" asChild>
            <a
              href="https://vercel.com/docs/concepts/deployments/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Vercel Deployment Docs
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
