"use client"

import { useState, useEffect } from "react"
import { BudgetHeader } from "@/components/budget-header"
import { BudgetList } from "@/components/budget-list"
import { BudgetSummary } from "@/components/budget-summary"
import { useBudgetStore } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetCharts } from "@/components/budget-charts"
import { BudgetSettings } from "@/components/budget-settings"
import { BudgetOverviewList } from "@/components/budget-overview-list"
import { BudgetExpensesSummary } from "@/components/budget-expenses-summary"
import { BudgetPredictions } from "@/components/budget-predictions"
import { BudgetAchievements } from "@/components/budget-achievements"
import { CurrencySettings } from "@/components/currency-settings"
import { AppCustomization } from "@/components/app-customization"
import { Notifications } from "@/components/notifications"
import { DataExport } from "@/components/data-export"
import { PDFExport } from "@/components/pdf-export"
import { MobileNav } from "@/components/mobile-nav"
import { QuickActions } from "@/components/quick-actions"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export function BudgetDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { items, budgetCap, preferences } = useBudgetStore()

  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
  const remainingBudget = budgetCap - totalSpent
  const percentageUsed = budgetCap > 0 ? (totalSpent / budgetCap) * 100 : 0

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (["overview", "expenses", "insights", "settings"].includes(hash)) {
        setActiveTab(hash)
      }
    }

    // Check hash on initial load
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Update hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab
  }, [activeTab])

  return (
    <div
      className={`container mx-auto px-4 py-6 max-w-4xl pb-20 md:pb-6 ${
        preferences.fontSize === "small" ? "text-sm" : preferences.fontSize === "large" ? "text-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <BudgetHeader />
        <div className="hidden md:block">
          <PDFExport />
        </div>
      </div>

      <BreadcrumbNav activeTab={activeTab} />

      <QuickActions />

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Insights
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <BudgetSummary
            totalSpent={totalSpent}
            remainingBudget={remainingBudget}
            percentageUsed={percentageUsed}
            budgetCap={budgetCap}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BudgetCharts items={items} budgetCap={budgetCap} />
            <BudgetAchievements />
          </div>
          <BudgetOverviewList items={items} totalSpent={totalSpent} />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 mt-6">
          <BudgetExpensesSummary totalSpent={totalSpent} budgetCap={budgetCap} itemCount={items.length} />
          <BudgetList />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BudgetPredictions />
            <Notifications />
          </div>
          <DataExport />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BudgetSettings />
            <CurrencySettings />
          </div>
          <AppCustomization />
        </TabsContent>
      </Tabs>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
