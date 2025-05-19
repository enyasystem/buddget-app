"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useBudgetStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AppCustomization() {
  const { preferences, updatePreferences } = useBudgetStore()

  const colorSchemes = [
    { name: "Default", value: "default", color: "bg-primary" },
    { name: "Rose", value: "rose", color: "bg-rose-500" },
    { name: "Green", value: "green", color: "bg-emerald-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Purple", value: "purple", color: "bg-purple-500" },
    { name: "Orange", value: "orange", color: "bg-orange-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup
            defaultValue={preferences.theme}
            onValueChange={(value) => updatePreferences({ theme: value as "light" | "dark" | "system" })}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem value="light" id="theme-light" className="sr-only" />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-8 rounded-lg bg-slate-400" />
                </div>
                <span className="text-sm font-normal">Light</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-2 rounded-md bg-slate-900 p-2 shadow-sm">
                  <div className="h-2 w-8 rounded-lg bg-slate-600" />
                </div>
                <span className="text-sm font-normal">Dark</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="theme-system" className="sr-only" />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-2 rounded-md bg-gradient-to-r from-white to-slate-900 p-2 shadow-sm">
                  <div className="h-2 w-8 rounded-lg bg-gradient-to-r from-slate-400 to-slate-600" />
                </div>
                <span className="text-sm font-normal">System</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <div className="grid grid-cols-3 gap-2">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.value}
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                  preferences.colorScheme === scheme.value && "border-primary",
                )}
                onClick={() => updatePreferences({ colorScheme: scheme.value })}
              >
                <div className={cn("mb-2 h-5 w-5 rounded-full", scheme.color)} />
                <span className="text-sm font-normal">{scheme.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <RadioGroup
            defaultValue={preferences.fontSize}
            onValueChange={(value) => updatePreferences({ fontSize: value as "small" | "medium" | "large" })}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem value="small" id="font-small" className="sr-only" />
              <Label
                htmlFor="font-small"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-xs">Aa</span>
                <span className="text-sm font-normal">Small</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="medium" id="font-medium" className="sr-only" />
              <Label
                htmlFor="font-medium"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm">Aa</span>
                <span className="text-sm font-normal">Medium</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="large" id="font-large" className="sr-only" />
              <Label
                htmlFor="font-large"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-base">Aa</span>
                <span className="text-sm font-normal">Large</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="biometric-auth">Biometric Authentication</Label>
          <Switch
            id="biometric-auth"
            checked={preferences.biometricAuth}
            onCheckedChange={(checked) => updatePreferences({ biometricAuth: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
