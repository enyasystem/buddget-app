"use client"

import { useMemo } from "react"
import { TrendingUp, AlertTriangle, CheckCircle, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useBudgetStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { predictFutureExpenses, generateBudgetSuggestions } from "@/lib/analytics"

export function BudgetPredictions() {
  const { items, budgetCap, setBudgetCap } = useBudgetStore()

  const predictions = useMemo(() => {
    return predictFutureExpenses(items)
  }, [items])

  const suggestions = useMemo(() => {
    return generateBudgetSuggestions(items, budgetCap)
  }, [items, budgetCap])

  const totalPredicted = Object.values(predictions).reduce((sum, amount) => sum + amount, 0)
  const predictedPercentage = budgetCap > 0 ? (totalPredicted / budgetCap) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Predictions & Suggestions
        </CardTitle>
        <CardDescription>AI-powered insights based on your spending patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Predicted Monthly Spending</span>
            <span className="text-sm font-medium">{formatCurrency(totalPredicted)}</span>
          </div>
          <Progress
            value={Math.min(predictedPercentage, 100)}
            className={`h-2 ${
              predictedPercentage > 100
                ? "bg-destructive/20"
                : predictedPercentage > 80
                  ? "bg-amber-100"
                  : "bg-emerald-100"
            }`}
            indicatorClassName={
              predictedPercentage > 100
                ? "bg-destructive"
                : predictedPercentage > 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            {suggestions.type === "reduce" ? (
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            ) : suggestions.type === "save" ? (
              <ArrowUpRight className="h-5 w-5 text-emerald-500 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            )}
            <div>
              <h4 className="font-medium">Budget Suggestion</h4>
              <p className="text-sm text-muted-foreground mt-1">{suggestions.message}</p>

              {suggestions.type === "reduce" && suggestions.categories && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium">Top spending categories:</p>
                  {suggestions.categories.map((cat) => (
                    <div key={cat.category} className="flex justify-between text-sm">
                      <span>{cat.category}</span>
                      <span className="font-medium">{formatCurrency(cat.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {suggestions.type === "reduce" && suggestions.suggestedBudget && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setBudgetCap(suggestions.suggestedBudget)}>
            Adjust Budget to {formatCurrency(suggestions.suggestedBudget)}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
