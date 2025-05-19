"use client"

import { useState } from "react"
import { FileDown, Printer, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { BudgetItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { useBudgetStore } from "@/lib/store"

interface PDFExportProps {
  item?: BudgetItem | null
  onClose?: () => void
}

export function PDFExport({ item, onClose }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { items, budgetCap } = useBudgetStore()

  // Function to generate PDF for a single item
  const exportItemToPDF = async () => {
    if (!item) return

    setIsExporting(true)

    try {
      // Create a hidden div to render the receipt
      const receiptDiv = document.createElement("div")
      receiptDiv.style.position = "absolute"
      receiptDiv.style.left = "-9999px"
      receiptDiv.style.top = "-9999px"
      receiptDiv.style.width = "210mm" // A4 width
      receiptDiv.style.padding = "20mm"
      receiptDiv.style.backgroundColor = "white"
      receiptDiv.style.color = "black"
      receiptDiv.style.fontFamily = "Arial, sans-serif"

      // Format the receipt content
      receiptDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; margin-bottom: 5px;">Expense Receipt</h1>
          <p style="font-size: 14px; color: #666;">Generated on ${format(new Date(), "PPP")}</p>
        </div>
        <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">${item.title}</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Amount:</span>
            <span>${formatCurrency(item.amount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Category:</span>
            <span>${item.category}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Date:</span>
            <span>${format(new Date(item.date), "PPP")}</span>
          </div>
          ${
            item.description
              ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ddd;">
            <span style="font-weight: bold;">Description:</span>
            <p style="margin-top: 5px;">${item.description}</p>
          </div>
          `
              : ""
          }
        </div>
        <div style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
          <p>Monthly Budget App</p>
        </div>
      `

      document.body.appendChild(receiptDiv)

      // Use browser's print functionality to save as PDF
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Expense Receipt - ${item.title}</title>
            </head>
            <body>
              ${receiptDiv.outerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }

      // Clean up
      document.body.removeChild(receiptDiv)

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // Function to export all budget items
  const exportAllToPDF = async () => {
    setIsExporting(true)

    try {
      // Create a hidden div to render the budget report
      const reportDiv = document.createElement("div")
      reportDiv.style.position = "absolute"
      reportDiv.style.left = "-9999px"
      reportDiv.style.top = "-9999px"
      reportDiv.style.width = "210mm" // A4 width
      reportDiv.style.padding = "20mm"
      reportDiv.style.backgroundColor = "white"
      reportDiv.style.color = "black"
      reportDiv.style.fontFamily = "Arial, sans-serif"

      const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
      const remainingBudget = budgetCap - totalSpent

      // Format the report content
      reportDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; margin-bottom: 5px;">Budget Report</h1>
          <p style="font-size: 14px; color: #666;">Generated on ${format(new Date(), "PPP")}</p>
        </div>
        
        <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 15px;">Budget Summary</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Budget Cap:</span>
            <span>${formatCurrency(budgetCap)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Total Spent:</span>
            <span>${formatCurrency(totalSpent)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; ${remainingBudget < 0 ? "color: red;" : ""}">
            <span style="font-weight: bold;">Remaining Budget:</span>
            <span>${formatCurrency(remainingBudget)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Number of Expenses:</span>
            <span>${items.length}</span>
          </div>
        </div>
        
        <h2 style="font-size: 18px; margin: 20px 0 15px;">Expense List</h2>
        ${
          items.length > 0
            ? `
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Title</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Category</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Amount</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Date</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.title}</td>
                  <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.category}</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${formatCurrency(item.amount)}</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${format(new Date(item.date), "PP")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
            : "<p>No expenses recorded yet.</p>"
        }
        
        <div style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
          <p>Monthly Budget App</p>
        </div>
      `

      document.body.appendChild(reportDiv)

      // Use browser's print functionality to save as PDF
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Budget Report - ${format(new Date(), "PP")}</title>
            </head>
            <body>
              ${reportDiv.outerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }

      // Clean up
      document.body.removeChild(reportDiv)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // If we're showing a single item export
  if (item) {
    return (
      <Button variant="outline" size="sm" className="gap-2" onClick={exportItemToPDF} disabled={isExporting}>
        {isExporting ? <Check className="h-4 w-4" /> : <FileDown className="h-4 w-4" />}
        Save Receipt
      </Button>
    )
  }

  // Otherwise show the dropdown for all export options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={isExporting}>
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAllToPDF}>
          <FileDown className="h-4 w-4 mr-2" />
          Export Full Budget Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" />
          Print Current View
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem
            onClick={() => {
              const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
              navigator.share({
                title: "Budget Report",
                text: `Budget Cap: ${formatCurrency(budgetCap)}\nTotal Spent: ${formatCurrency(totalSpent)}\nRemaining: ${formatCurrency(budgetCap - totalSpent)}`,
              })
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Budget Summary
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
