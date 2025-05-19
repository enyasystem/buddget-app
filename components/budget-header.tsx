"use client"

import { MoonIcon, SunIcon, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { DeploymentGuide } from "@/components/pwa/deployment-guide"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useBudgetStore } from "@/lib/store"

export function BudgetHeader() {
  const { theme, setTheme } = useTheme()
  const { preferences } = useBudgetStore()

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monthly Budget</h1>
        <p className="text-muted-foreground">Track your expenses in {preferences.currency}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <DeploymentGuide />
          <InstallPrompt />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="rounded-full">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="py-4 space-y-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <div className="space-y-2">
                <InstallPrompt />
                <DeploymentGuide />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
