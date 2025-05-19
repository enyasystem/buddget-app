import type { Currency } from "./types"

// Exchange rates are relative to Nigerian Naira (NGN)
export const currencies: Currency[] = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    rate: 1,
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    rate: 0.00065, // 1 NGN = 0.00065 USD
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 0.0006, // 1 NGN = 0.00060 EUR
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    rate: 0.00051, // 1 NGN = 0.00051 GBP
  },
  {
    code: "GHS",
    name: "Ghanaian Cedi",
    symbol: "₵",
    rate: 0.0083, // 1 NGN = 0.0083 GHS
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    rate: 0.084, // 1 NGN = 0.084 KES
  },
  {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    rate: 0.012, // 1 NGN = 0.012 ZAR
  },
]

// Convert amount from one currency to another
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const from = currencies.find((c) => c.code === fromCurrency)
  const to = currencies.find((c) => c.code === toCurrency)

  if (!from || !to) {
    return amount
  }

  // Convert to base currency (NGN) first, then to target currency
  const amountInNGN = amount / from.rate
  return amountInNGN * to.rate
}

// Format amount in specified currency
export function formatAmountInCurrency(amount: number, currencyCode: string): string {
  const currency = currencies.find((c) => c.code === currencyCode)

  if (!currency) {
    return amount.toString()
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}
