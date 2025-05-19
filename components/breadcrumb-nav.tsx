"use client"

import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbNavProps {
  activeTab: string
}

export function BreadcrumbNav({ activeTab }: BreadcrumbNavProps) {
  const getTabName = (tab: string) => {
    switch (tab) {
      case "overview":
        return "Overview"
      case "expenses":
        return "Expenses"
      case "insights":
        return "Insights"
      case "settings":
        return "Settings"
      default:
        return tab
    }
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      <div className="flex items-center">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className={cn("font-medium", activeTab && "text-foreground")}>{getTabName(activeTab)}</span>
      </div>
    </nav>
  )
}
