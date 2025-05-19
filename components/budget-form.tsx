"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useBudgetStore } from "@/lib/store"
import type { BudgetItem } from "@/lib/types"
import { currencies } from "@/lib/currencies"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { PDFExport } from "@/components/pdf-export"

// Updated schema to make category optional
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.string().optional(), // Made category optional
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
})

interface BudgetFormProps {
  editItem?: BudgetItem | null
  onClose?: () => void
}

export function BudgetForm({ editItem, onClose }: BudgetFormProps) {
  const { addItem, updateItem, preferences } = useBudgetStore()
  const [showPdfExport, setShowPdfExport] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<BudgetItem | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Food", // Set default category to Food
      amount: 0,
      currency: preferences.currency,
      date: new Date(),
    },
  })

  useEffect(() => {
    if (editItem) {
      form.reset({
        title: editItem.title,
        description: editItem.description,
        category: editItem.category,
        amount: editItem.amount,
        currency: editItem.currency || preferences.currency,
        date: editItem.date ? new Date(editItem.date) : new Date(),
      })
    }
  }, [editItem, form, preferences.currency])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newItem = {
      id: editItem ? editItem.id : Date.now().toString(),
      ...values,
      category: values.category || "Food", // Default to Food if not provided
      date: values.date.toISOString(),
    }

    if (editItem) {
      updateItem(newItem)
    } else {
      addItem(newItem)
      setLastAddedItem(newItem)
      setShowPdfExport(true)
    }

    form.reset({
      title: "",
      description: "",
      category: "Food", // Reset to Food
      amount: 0,
      currency: preferences.currency,
      date: new Date(),
    })

    if (onClose && editItem) {
      onClose()
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <h2 className="text-lg font-semibold">{editItem ? "Edit Expense" : "Add New Expense"}</h2>

          {/* Simplified layout with title and amount in the same row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Grocery shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Bills">Bills</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Optional description field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Weekly groceries from Shoprite" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            {editItem && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit">{editItem ? "Update" : "Add"} Expense</Button>
          </div>
        </form>
      </Form>

      {/* PDF Export option after adding an item */}
      {showPdfExport && lastAddedItem && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Expense added successfully!</h3>
              <p className="text-sm text-muted-foreground">Would you like to save a receipt as PDF?</p>
            </div>
            <PDFExport item={lastAddedItem} onClose={() => setShowPdfExport(false)} />
          </div>
        </div>
      )}
    </>
  )
}
