"use client"

import { useState } from "react"
import { PlusCircle, FileDown, TrendingUp, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BudgetForm } from "@/components/budget-form"
import { PDFExport } from "@/components/pdf-export"
import { useBudgetStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function QuickActions() {
  const [showTip, setShowTip] = useState(false)
  const { items, budgetCap } = useBudgetStore()

  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
  const remainingBudget = budgetCap - totalSpent

  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="text-sm font-medium">
          Remaining:{" "}
          <span className={remainingBudget < 0 ? "text-destructive" : "text-primary"}>
            {formatCurrency(remainingBudget)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 w-full">
              <PlusCircle className="h-5 w-5" />
              <span>Add Expense</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="sm:max-w-md sm:rounded-t-xl mx-auto">
            <BudgetForm />
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 w-full"
          onClick={() => setShowTip(!showTip)}
        >
          <TrendingUp className="h-5 w-5" />
          <span>Budget Tips</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 w-full"
          onClick={() => (window.location.hash = "settings")}
        >
          <Sliders className="h-5 w-5" />
          <span>Adjust Budget</span>
        </Button>

        <div className="relative">
          <PDFExport>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 w-full">
              <FileDown className="h-5 w-5" />
              <span>Export PDF</span>
            </Button>
          </PDFExport>
        </div>
      </div>

      {showTip && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm">
          <p className="font-medium">Budget Tip:</p>
          <p className="text-muted-foreground">
            {remainingBudget < 0
              ? "You've exceeded your budget. Consider reviewing your expenses or adjusting your budget cap."
              : remainingBudget < budgetCap * 0.2
                ? "You're close to your budget limit. Try to prioritize essential expenses."
                : "You're managing your budget well. Keep tracking your expenses regularly."}
          </p>
        </div>
      )}
    </div>
  )
}
