"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { BudgetItem, Notification, UserPreferences } from "./types"
import { convertCurrency } from "./currencies"

interface SyncState {
  lastSynced: string | null
  pendingChanges: Array<{
    type: "add" | "update" | "remove"
    item: BudgetItem | string
  }>
  isSyncing: boolean
}

interface BudgetState {
  items: BudgetItem[]
  budgetCap: number
  notifications: Notification[]
  preferences: UserPreferences
  sync: SyncState
  addItem: (item: BudgetItem) => void
  updateItem: (item: BudgetItem) => void
  removeItem: (id: string) => void
  setBudgetCap: (amount: number) => void
  clearItems: () => void
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  getItemsInCurrency: (currencyCode: string) => BudgetItem[]
  getTotalInCurrency: (currencyCode: string) => number
  syncData: () => Promise<void>
  markSynced: () => void
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      items: [],
      budgetCap: 100000, // Default budget cap (₦100,000)
      notifications: [],
      preferences: {
        theme: "system",
        currency: "NGN",
        notifications: true,
        fontSize: "medium",
        colorScheme: "default",
        biometricAuth: false,
      },
      sync: {
        lastSynced: null,
        pendingChanges: [],
        isSyncing: false,
      },

      addItem: (item) =>
        set((state) => {
          const newItem = {
            ...item,
            date: item.date || new Date().toISOString(),
            currency: item.currency || state.preferences.currency,
          }

          // Add to pending changes for sync
          const pendingChanges = [
            ...state.sync.pendingChanges,
            {
              type: "add",
              item: newItem,
            },
          ]

          return {
            items: [...state.items, newItem],
            sync: {
              ...state.sync,
              pendingChanges,
            },
          }
        }),

      updateItem: (updatedItem) =>
        set((state) => {
          // Add to pending changes for sync
          const pendingChanges = [
            ...state.sync.pendingChanges,
            {
              type: "update",
              item: updatedItem,
            },
          ]

          return {
            items: state.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
            sync: {
              ...state.sync,
              pendingChanges,
            },
          }
        }),

      removeItem: (id) =>
        set((state) => {
          // Add to pending changes for sync
          const pendingChanges = [
            ...state.sync.pendingChanges,
            {
              type: "remove",
              item: id,
            },
          ]

          return {
            items: state.items.filter((item) => item.id !== id),
            sync: {
              ...state.sync,
              pendingChanges,
            },
          }
        }),

      setBudgetCap: (amount) => set({ budgetCap: amount }),

      clearItems: () => set({ items: [] }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Date.now().toString(),
              date: new Date().toISOString(),
              read: false,
            },
          ],
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        })),

      getItemsInCurrency: (currencyCode) => {
        const { items, preferences } = get()
        return items.map((item) => ({
          ...item,
          amount: convertCurrency(item.amount, item.currency || preferences.currency, currencyCode),
        }))
      },

      getTotalInCurrency: (currencyCode) => {
        const itemsInCurrency = get().getItemsInCurrency(currencyCode)
        return itemsInCurrency.reduce((sum, item) => sum + item.amount, 0)
      },

      syncData: async () => {
        const state = get()

        // If already syncing or no pending changes, do nothing
        if (state.sync.isSyncing || state.sync.pendingChanges.length === 0) {
          return
        }

        // Set syncing state
        set((state) => ({
          sync: {
            ...state.sync,
            isSyncing: true,
          },
        }))

        try {
          // In a real app, this would send data to a server
          // For this demo, we'll simulate a network request
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // If we're online, mark as synced
          if (navigator.onLine) {
            get().markSynced()

            // Add a notification about successful sync
            get().addNotification({
              title: "Sync Complete",
              message: `Successfully synchronized ${state.sync.pendingChanges.length} changes.`,
              type: "success",
            })
          }
        } catch (error) {
          console.error("Sync failed:", error)

          // Add a notification about failed sync
          get().addNotification({
            title: "Sync Failed",
            message: "Could not synchronize your data. Will try again when you're online.",
            type: "error",
          })
        } finally {
          // Reset syncing state
          set((state) => ({
            sync: {
              ...state.sync,
              isSyncing: false,
            },
          }))
        }
      },

      markSynced: () =>
        set((state) => ({
          sync: {
            lastSynced: new Date().toISOString(),
            pendingChanges: [],
            isSyncing: false,
          },
        })),
    }),
    {
      name: "budget-storage", // name of the item in localStorage
    },
  ),
)
