"use client"

import type React from "react"

import { useMemo } from "react"
import { Trophy, Award, Star, TrendingDown, Zap, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBudgetStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ElementType
  progress: number
  unlocked: boolean
  color: string
}

export function BudgetAchievements() {
  const { items, budgetCap } = useBudgetStore()

  const achievements = useMemo(() => {
    const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
    const uniqueCategories = new Set(items.map((item) => item.category)).size

    const achievementsList: Achievement[] = [
      {
        id: "budget_master",
        title: "Budget Master",
        description: "Stay under budget for a full month",
        icon: Trophy,
        progress: budgetCap > 0 ? Math.min(100, 100 - (totalSpent / budgetCap) * 100) : 0,
        unlocked: budgetCap > 0 && totalSpent <= budgetCap,
        color: "text-amber-500",
      },
      {
        id: "category_explorer",
        title: "Category Explorer",
        description: "Track expenses across 5 different categories",
        icon: Star,
        progress: Math.min(100, (uniqueCategories / 5) * 100),
        unlocked: uniqueCategories >= 5,
        color: "text-purple-500",
      },
      {
        id: "expense_tracker",
        title: "Expense Tracker",
        description: "Record 10 expenses in the app",
        icon: Zap,
        progress: Math.min(100, (items.length / 10) * 100),
        unlocked: items.length >= 10,
        color: "text-blue-500",
      },
      {
        id: "saver",
        title: "Super Saver",
        description: "Spend less than 70% of your budget",
        icon: TrendingDown,
        progress: budgetCap > 0 ? Math.min(100, (1 - totalSpent / budgetCap) * 100 * (10 / 3)) : 0,
        unlocked: budgetCap > 0 && totalSpent < budgetCap * 0.7,
        color: "text-emerald-500",
      },
      {
        id: "consistent",
        title: "Consistency King",
        description: "Use the app for 7 consecutive days",
        icon: Calendar,
        progress: 70, // This would be calculated based on actual usage data
        unlocked: false,
        color: "text-orange-500",
      },
    ]

    return achievementsList
  }, [items, budgetCap])

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Achievements
        </CardTitle>
        <CardDescription>
          You've unlocked {unlockedCount} of {achievements.length} achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <achievement.icon className={cn("h-4 w-4", achievement.color)} />
              <span className="text-sm font-medium">{achievement.title}</span>
              {achievement.unlocked && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Unlocked</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={achievement.progress} className="h-1.5" />
              <span className="text-xs text-muted-foreground">{Math.round(achievement.progress)}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
