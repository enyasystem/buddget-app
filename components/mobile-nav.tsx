"use client"

import type React from "react"

import { Home, BarChart2, Settings, PlusCircle, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BudgetForm } from "@/components/budget-form"

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background border-t px-4 py-2 flex items-center justify-around">
        <NavButton
          icon={Home}
          label="Overview"
          isActive={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        />
        <NavButton
          icon={List}
          label="Expenses"
          isActive={activeTab === "expenses"}
          onClick={() => setActiveTab("expenses")}
        />
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center px-2 py-1 rounded-lg -mt-6 bg-primary text-primary-foreground shadow-lg">
              <PlusCircle className="h-8 w-8" />
              <span className="text-xs mt-1">Add</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="sm:max-w-md sm:rounded-t-xl mx-auto">
            <BudgetForm />
          </SheetContent>
        </Sheet>
        <NavButton
          icon={BarChart2}
          label="Insights"
          isActive={activeTab === "insights"}
          onClick={() => setActiveTab("insights")}
        />
        <NavButton
          icon={Settings}
          label="Settings"
          isActive={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />
      </div>
    </div>
  )
}

interface NavButtonProps {
  icon: React.ElementType
  label: string
  isActive: boolean
  onClick: () => void
}

function NavButton({ icon: Icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs mt-1">{label}</span>
    </button>
  )
}
