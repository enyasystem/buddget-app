export interface BudgetItem {
  id: string
  title: string
  description?: string
  category: string
  amount: number
  currency?: string
  date?: string
}

export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number // Exchange rate relative to base currency (NGN)
}

export type NotificationType = "info" | "warning" | "success" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  date: string
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  currency: string
  notifications: boolean
  fontSize: "small" | "medium" | "large"
  colorScheme: string
  biometricAuth: boolean
}
