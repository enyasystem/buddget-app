"use client"

import { useState } from "react"
import { Share2, FileJson, FileSpreadsheet, FileSpreadsheetIcon as FileCsv } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBudgetStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function DataExport() {
  const { items, budgetCap } = useBudgetStore()
  const [isExporting, setIsExporting] = useState(false)

  const exportData = (format: "json" | "csv" | "excel") => {
    setIsExporting(true)

    // Prepare the data
    const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
    const data = {
      summary: {
        totalItems: items.length,
        totalSpent,
        budgetCap,
        remainingBudget: budgetCap - totalSpent,
        percentageUsed: budgetCap > 0 ? (totalSpent / budgetCap) * 100 : 0,
        exportDate: new Date().toISOString(),
      },
      items,
    }

    // Create the file content based on format
    let content = ""
    let fileName = `budget-export-${new Date().toISOString().split("T")[0]}`
    let mimeType = ""

    if (format === "json") {
      content = JSON.stringify(data, null, 2)
      fileName += ".json"
      mimeType = "application/json"
    } else if (format === "csv") {
      // Create CSV header
      content = "ID,Title,Description,Category,Amount,Date\n"
      // Add rows
      items.forEach((item) => {
        content += `${item.id},"${item.title}","${item.description || ""}","${item.category}",${item.amount},"${item.date || ""}"\n`
      })
      // Add summary
      content += "\nSummary\n"
      content += `Total Items,${data.summary.totalItems}\n`
      content += `Total Spent,${formatCurrency(data.summary.totalSpent)}\n`
      content += `Budget Cap,${formatCurrency(data.summary.budgetCap)}\n`
      content += `Remaining Budget,${formatCurrency(data.summary.remainingBudget)}\n`
      content += `Percentage Used,${data.summary.percentageUsed.toFixed(2)}%\n`

      fileName += ".csv"
      mimeType = "text/csv"
    } else if (format === "excel") {
      // For demo purposes, we'll just use CSV format
      // In a real app, you would use a library like xlsx to create Excel files
      content = "ID,Title,Description,Category,Amount,Date\n"
      items.forEach((item) => {
        content += `${item.id},"${item.title}","${item.description || ""}","${item.category}",${item.amount},"${item.date || ""}"\n`
      })
      fileName += ".csv"
      mimeType = "text/csv"
    }

    // Create and download the file
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setTimeout(() => {
      setIsExporting(false)
    }, 1000)
  }

  const shareData = async () => {
    if (!navigator.share) {
      alert("Web Share API is not supported in your browser")
      return
    }

    try {
      const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
      const remainingBudget = budgetCap - totalSpent

      await navigator.share({
        title: "My Budget Summary",
        text: `Total Spent: ${formatCurrency(totalSpent)}\nBudget Cap: ${formatCurrency(budgetCap)}\nRemaining: ${formatCurrency(remainingBudget)}\n\nTracked with Budget App`,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Share</CardTitle>
        <CardDescription>Export your budget data or share your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={() => exportData("json")}
            disabled={isExporting}
          >
            <FileJson className="h-8 w-8 text-blue-500" />
            <span className="text-xs">JSON</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={() => exportData("csv")}
            disabled={isExporting}
          >
            <FileCsv className="h-8 w-8 text-green-500" />
            <span className="text-xs">CSV</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={() => exportData("excel")}
            disabled={isExporting}
          >
            <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
            <span className="text-xs">Excel</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={shareData}>
          <Share2 className="h-4 w-4" />
          Share Budget Summary
        </Button>
      </CardFooter>
    </Card>
  )
}
