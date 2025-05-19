import type { BudgetItem } from "./types"

// Analyze spending patterns by category
export function analyzeSpendingPatterns(items: BudgetItem[]) {
  const categoryTotals: Record<string, number> = {}
  const categoryCount: Record<string, number> = {}

  // Calculate totals and counts by category
  items.forEach((item) => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = 0
      categoryCount[item.category] = 0
    }
    categoryTotals[item.category] += item.amount
    categoryCount[item.category]++
  })

  // Calculate average spending by category
  const categoryAverages: Record<string, number> = {}
  Object.keys(categoryTotals).forEach((category) => {
    categoryAverages[category] = categoryTotals[category] / categoryCount[category]
  })

  return {
    categoryTotals,
    categoryAverages,
  }
}

// Predict future expenses based on historical data
export function predictFutureExpenses(items: BudgetItem[], daysToPredict = 30) {
  const now = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

  // Group items by category
  const categoryItems: Record<string, BudgetItem[]> = {}
  items.forEach((item) => {
    if (!categoryItems[item.category]) {
      categoryItems[item.category] = []
    }
    categoryItems[item.category].push(item)
  })

  // Calculate monthly rate for each category
  const predictions: Record<string, number> = {}
  Object.keys(categoryItems).forEach((category) => {
    const categoryTotal = categoryItems[category].reduce((sum, item) => sum + item.amount, 0)
    // Simple linear prediction based on current spending rate
    predictions[category] = (categoryTotal / 30) * daysToPredict
  })

  return predictions
}

// Generate budget suggestions based on spending patterns
export function generateBudgetSuggestions(items: BudgetItem[], currentBudgetCap: number) {
  const { categoryTotals } = analyzeSpendingPatterns(items)
  const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

  // If spending more than 90% of budget, suggest increasing budget or reducing expenses
  if (totalSpent > currentBudgetCap * 0.9) {
    const highestCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)

    return {
      type: "reduce",
      message: `You're close to exceeding your budget. Consider reducing spending in ${highestCategories[0][0]} and ${highestCategories[1][0]}.`,
      suggestedBudget: Math.ceil((totalSpent * 1.1) / 1000) * 1000, // Round up to nearest 1000
      categories: highestCategories.map(([category, amount]) => ({
        category,
        amount,
        suggestion: Math.ceil((amount * 0.8) / 100) * 100, // Suggest 20% reduction, rounded
      })),
    }
  }

  // If spending less than 70% of budget, suggest saving or reallocating
  if (totalSpent < currentBudgetCap * 0.7) {
    return {
      type: "save",
      message: `You're well under budget. Consider saving ₦${formatNumber(currentBudgetCap - totalSpent)} or reallocating to other categories.`,
      savingsAmount: currentBudgetCap - totalSpent,
    }
  }

  // Default suggestion for balanced budget
  return {
    type: "balanced",
    message: "Your budget is well balanced.",
    currentUtilization: (totalSpent / currentBudgetCap) * 100,
  }
}

// Helper function to format numbers
function formatNumber(num: number): string {
  return num.toLocaleString("en-NG")
}
