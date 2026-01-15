"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Subscription, getDaysUntilDue, categoryLabels } from "@/lib/subscriptions"
import { cn } from "@/lib/utils"
import { ChevronRight, ExternalLink, MoreHorizontal, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SubscriptionListProps {
  subscriptions: Subscription[]
  viewMode: "grid" | "list"
}

export function SubscriptionList({ subscriptions, viewMode }: SubscriptionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-medium text-sm">All Subscriptions</h3>
        <span className="text-xs text-muted-foreground tabular-nums">{subscriptions.length} active</span>
      </div>

      {/* List */}
      <div
        className={cn(
          "divide-y divide-border max-h-[600px] overflow-y-auto",
          viewMode === "grid" && "grid grid-cols-1 divide-y-0 gap-px bg-border p-px",
        )}
      >
        <AnimatePresence mode="popLayout">
          {subscriptions.map((subscription, index) => (
            <SubscriptionItem
              key={subscription.id}
              subscription={subscription}
              index={index}
              viewMode={viewMode}
              isExpanded={expandedId === subscription.id}
              onToggle={() => setExpandedId(expandedId === subscription.id ? null : subscription.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface SubscriptionItemProps {
  subscription: Subscription
  index: number
  viewMode: "grid" | "list"
  isExpanded: boolean
  onToggle: () => void
}

function SubscriptionItem({ subscription, index, viewMode, isExpanded, onToggle }: SubscriptionItemProps) {
  const daysUntil = getDaysUntilDue(subscription.nextDueDate)
  const isUrgent = daysUntil <= 3
  const isDueSoon = daysUntil <= 7

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn("bg-card group", viewMode === "grid" && "rounded-lg")}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-full text-left px-4 py-3 flex items-center gap-3",
          "hover:bg-secondary/50 transition-colors duration-150",
          "focus:outline-none focus:bg-secondary/50",
        )}
      >
        {/* Logo/Color Indicator */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
          style={{ backgroundColor: subscription.color + "15" }}
        >
          <span className="text-base font-semibold" style={{ color: subscription.color }}>
            {subscription.name.charAt(0)}
          </span>
        </div>

        {/* Name + Category */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{subscription.name}</p>
          <p className="text-xs text-muted-foreground truncate">{categoryLabels[subscription.category]}</p>
        </div>

        {/* Amount + Due */}
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-sm tabular-nums">${subscription.amount.toFixed(2)}</p>
          <p
            className={cn(
              "text-xs tabular-nums flex items-center gap-1 justify-end",
              isUrgent ? "text-destructive font-medium" : isDueSoon ? "text-warning" : "text-muted-foreground",
            )}
          >
            {isDueSoon && <Clock className="w-3 h-3" />}
            {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil}d`}
          </p>
        </div>

        {/* Expand Arrow */}
        <ChevronRight
          className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-90")}
        />
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/50 ml-[52px]">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Billing Cycle</p>
                  <p className="font-medium capitalize">{subscription.billingCycle}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Due</p>
                  <p className="font-medium tabular-nums">
                    {new Date(subscription.nextDueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Paid</p>
                  <p className="font-medium tabular-nums">${subscription.totalPaid.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Since</p>
                  <p className="font-medium">
                    {new Date(subscription.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex-1">{subscription.platform}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1.5 rounded hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Manage
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs text-destructive">Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
