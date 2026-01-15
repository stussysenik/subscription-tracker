"use client"

import { motion } from "framer-motion"
import { type Subscription, getDaysUntilDue } from "@/lib/subscriptions"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface UpcomingDuesProps {
  subscriptions: Subscription[]
}

export function UpcomingDues({ subscriptions }: UpcomingDuesProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-medium text-sm mb-3">Upcoming (7 days)</h3>
        <p className="text-sm text-muted-foreground">No upcoming dues</p>
      </div>
    )
  }

  const total = subscriptions.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">Upcoming (7 days)</h3>
        <span className="text-xs font-medium px-2 py-1 bg-warning/10 text-warning rounded-md tabular-nums">
          ${total.toFixed(2)}
        </span>
      </div>

      <div className="space-y-2">
        {subscriptions.slice(0, 5).map((subscription, index) => {
          const daysUntil = getDaysUntilDue(subscription.nextDueDate)
          const isUrgent = daysUntil <= 2

          return (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-colors",
                isUrgent ? "bg-destructive/5" : "hover:bg-secondary/50",
              )}
            >
              {/* Color indicator */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: subscription.color + "15" }}
              >
                <span className="text-sm font-semibold" style={{ color: subscription.color }}>
                  {subscription.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{subscription.name}</p>
                <p className={cn("text-xs", isUrgent ? "text-destructive font-medium" : "text-muted-foreground")}>
                  {daysUntil === 0 ? "Due today" : daysUntil === 1 ? "Due tomorrow" : `In ${daysUntil} days`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isUrgent && <AlertCircle className="w-4 h-4 text-destructive animate-pulse-gentle" />}
                <span className="text-sm font-medium tabular-nums">${subscription.amount.toFixed(2)}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {subscriptions.length > 5 && (
        <p className="text-xs text-muted-foreground text-center mt-3">+{subscriptions.length - 5} more this week</p>
      )}
    </div>
  )
}
