"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBudgetStore } from "@/lib/store"
import { currencies, formatAmountInCurrency } from "@/lib/currencies"
import { cn } from "@/lib/utils"

export function CurrencySettings() {
  const { preferences, updatePreferences, getTotalInCurrency, budgetCap } = useBudgetStore()
  const [open, setOpen] = useState(false)

  const selectedCurrency = currencies.find((c) => c.code === preferences.currency) || currencies[0]
  const totalInSelectedCurrency = getTotalInCurrency(selectedCurrency.code)

  // Convert budget cap to selected currency
  const budgetCapInSelectedCurrency = budgetCap * selectedCurrency.rate

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>Manage your preferred currency and view conversions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Currency</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                {selectedCurrency.symbol} {selectedCurrency.code} - {selectedCurrency.name}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search currency..." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((currency) => (
                      <CommandItem
                        key={currency.code}
                        value={currency.code}
                        onSelect={() => {
                          updatePreferences({ currency: currency.code })
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            preferences.currency === currency.code ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {currency.symbol} {currency.code} - {currency.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <h4 className="font-medium">Currency Conversion</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-lg font-semibold mt-1">
                {formatAmountInCurrency(totalInSelectedCurrency, selectedCurrency.code)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget Cap</p>
              <p className="text-lg font-semibold mt-1">
                {formatAmountInCurrency(budgetCapInSelectedCurrency, selectedCurrency.code)}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Exchange rates are updated periodically. Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
