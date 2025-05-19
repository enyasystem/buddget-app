"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BudgetItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartPie,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
} from "@/components/ui/chart"

interface BudgetChartsProps {
  items: BudgetItem[]
  budgetCap: number
}

export function BudgetCharts({ items, budgetCap }: BudgetChartsProps) {
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {}

    items.forEach((item) => {
      if (categories[item.category]) {
        categories[item.category] += item.amount
      } else {
        categories[item.category] = item.amount
      }
    })

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }))
  }, [items])

  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
  const remaining = Math.max(0, budgetCap - totalSpent)

  const budgetData = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: remaining },
  ]

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "food":
        return "#10b981"
      case "bills":
        return "#ef4444"
      case "tech":
        return "#3b82f6"
      case "entertainment":
        return "#8b5cf6"
      case "transport":
        return "#f59e0b"
      case "other":
        return "#6b7280"
      case "spent":
        return "#f43f5e"
      case "remaining":
        return "#14b8a6"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {categoryData.length > 0 ? (
            <ChartContainer className="h-[300px]">
              <Chart className="h-full w-full">
                <ChartPie
                  data={categoryData}
                  nameKey="name"
                  dataKey="value"
                  paddingAngle={2}
                  cornerRadius={4}
                  colors={categoryData.map((item) => getCategoryColor(item.name))}
                >
                  <ChartTooltip>
                    {({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent className="bg-background border shadow-md">
                            <ChartTooltipItem label="Category" value={() => payload[0].name || ""} />
                            <ChartTooltipItem label="Amount" value={() => formatCurrency(payload[0].value || 0)} />
                          </ChartTooltipContent>
                        )
                      }
                      return null
                    }}
                  </ChartTooltip>
                </ChartPie>
              </Chart>
              <ChartLegend className="mt-4 flex flex-wrap justify-center gap-4">
                {categoryData.map((category) => (
                  <ChartLegendItem key={category.name} name={category.name} color={getCategoryColor(category.name)} />
                ))}
              </ChartLegend>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data to display</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Usage</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {budgetCap > 0 ? (
            <ChartContainer className="h-[300px]">
              <Chart className="h-full w-full">
                <ChartPie
                  data={budgetData}
                  nameKey="name"
                  dataKey="value"
                  paddingAngle={2}
                  cornerRadius={4}
                  colors={budgetData.map((item) => getCategoryColor(item.name.toLowerCase()))}
                >
                  <ChartTooltip>
                    {({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent className="bg-background border shadow-md">
                            <ChartTooltipItem label="Status" value={() => payload[0].name || ""} />
                            <ChartTooltipItem label="Amount" value={() => formatCurrency(payload[0].value || 0)} />
                          </ChartTooltipContent>
                        )
                      }
                      return null
                    }}
                  </ChartTooltip>
                </ChartPie>
              </Chart>
              <ChartLegend className="mt-4 flex flex-wrap justify-center gap-4">
                {budgetData.map((item) => (
                  <ChartLegendItem key={item.name} name={item.name} color={getCategoryColor(item.name.toLowerCase())} />
                ))}
              </ChartLegend>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Set a budget cap in settings
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
