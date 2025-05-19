import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface BudgetExpensesSummaryProps {
  totalSpent: number
  budgetCap: number
  itemCount: number
}

export function BudgetExpensesSummary({ totalSpent, budgetCap, itemCount }: BudgetExpensesSummaryProps) {
  const remainingBudget = budgetCap - totalSpent
  const isOverBudget = remainingBudget < 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-xl font-bold mt-1">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="text-xl font-bold mt-1">{itemCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-xl font-bold mt-1 ${isOverBudget ? "text-destructive" : ""}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
