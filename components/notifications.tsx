"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Check, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBudgetStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { NotificationType } from "@/lib/types"

export function Notifications() {
  const { notifications, markNotificationAsRead, clearNotifications } = useBudgetStore()
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return true
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Stay updated on your budget activity</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <NotificationList
              notifications={filteredNotifications}
              getNotificationIcon={getNotificationIcon}
              markAsRead={markNotificationAsRead}
            />
          </TabsContent>
          <TabsContent value="unread" className="mt-4">
            <NotificationList
              notifications={filteredNotifications}
              getNotificationIcon={getNotificationIcon}
              markAsRead={markNotificationAsRead}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      {notifications.length > 0 && (
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" onClick={clearNotifications}>
            Clear All Notifications
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function NotificationList({
  notifications,
  getNotificationIcon,
  markAsRead,
}: {
  notifications: any[]
  getNotificationIcon: (type: NotificationType) => React.ReactNode
  markAsRead: (id: string) => void
}) {
  if (notifications.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No notifications to display</div>
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn("flex items-start gap-3 p-3 rounded-lg border", !notification.read && "bg-muted/50")}
          >
            <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <p className="font-medium text-sm">{notification.title}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => markAsRead(notification.id)}
              >
                <Check className="h-3 w-3" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
