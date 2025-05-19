import { BudgetDashboard } from "@/components/budget-dashboard"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <main className="min-h-screen bg-background">
        <BudgetDashboard />
      </main>
    </ThemeProvider>
  )
}
