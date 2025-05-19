import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface BudgetSummaryProps {
  totalSpent: number
  remainingBudget: number
  percentageUsed: number
  budgetCap: number
}

export function BudgetSummary({ totalSpent, remainingBudget, percentageUsed, budgetCap }: BudgetSummaryProps) {
  const getBudgetStatus = () => {
    if (percentageUsed >= 100) return "exceeded"
    if (percentageUsed >= 80) return "warning"
    return "good"
  }

  const status = getBudgetStatus()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Budget Summary</CardTitle>
        <CardDescription>Your monthly spending overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Remaining</p>
            <p className={`text-2xl font-bold ${status === "exceeded" ? "text-destructive" : ""}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget Usage</span>
            <span
              className={`font-medium ${
                status === "exceeded"
                  ? "text-destructive"
                  : status === "warning"
                    ? "text-amber-500"
                    : "text-emerald-500"
              }`}
            >
              {percentageUsed.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={Math.min(percentageUsed, 100)}
            className={`h-2 ${
              status === "exceeded" ? "bg-destructive/20" : status === "warning" ? "bg-amber-100" : "bg-emerald-100"
            }`}
            indicatorClassName={
              status === "exceeded" ? "bg-destructive" : status === "warning" ? "bg-amber-500" : "bg-emerald-500"
            }
          />
        </div>

        <div className="pt-2 text-center text-sm text-muted-foreground">Budget Cap: {formatCurrency(budgetCap)}</div>
      </CardContent>
    </Card>
  )
}
