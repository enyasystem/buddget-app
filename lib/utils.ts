import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { currencies } from "./currencies"
import { useBudgetStore } from "./store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  // Get the current preferred currency from the store
  let currencyCode = "NGN"
  try {
    const state = useBudgetStore.getState()
    currencyCode = state.preferences.currency
  } catch (e) {
    // Fallback to NGN if store is not available
  }

  const currency = currencies.find((c) => c.code === currencyCode) || currencies[0]

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
