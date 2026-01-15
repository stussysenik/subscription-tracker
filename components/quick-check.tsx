"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Subscription, getDaysUntilDue } from "@/lib/subscriptions"
import { cn } from "@/lib/utils"
import { Check, AlertTriangle, Sparkles, ChevronDown } from "lucide-react"

interface QuickCheckProps {
  subscriptions: Subscription[]
}

interface CheckedState {
  [id: string]: { checked: boolean; checkedAt: string }
}

function groupByDueDate(subs: Subscription[]): Map<number, Subscription[]> {
  const groups = new Map<number, Subscription[]>()
  subs
    .filter((s) => s.isActive)
    .sort((a, b) => getDaysUntilDue(a.nextDueDate) - getDaysUntilDue(b.nextDueDate))
    .forEach((sub) => {
      const days = getDaysUntilDue(sub.nextDueDate)
      if (days >= 0 && days <= 30) {
        const existing = groups.get(days) || []
        groups.set(days, [...existing, sub])
      }
    })
  return groups
}

function getDayLabel(days: number): string {
  if (days === 0) return "TODAY"
  if (days === 1) return "TOMORROW"
  if (days <= 7) return `IN ${days} DAYS`
  return `${days} DAYS`
}

export function QuickCheck({ subscriptions }: QuickCheckProps) {
  const [checked, setChecked] = useState<CheckedState>({})
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("recur-checked")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const cleaned: CheckedState = {}
        Object.entries(parsed).forEach(([id, data]: [string, any]) => {
          const sub = subscriptions.find((s) => s.id === id)
          if (sub && -getDaysUntilDue(sub.nextDueDate) < 1) {
            cleaned[id] = data
          }
        })
        setChecked(cleaned)
      } catch {
        /* ignore */
      }
    }
  }, [subscriptions])

  useEffect(() => {
    if (mounted) localStorage.setItem("recur-checked", JSON.stringify(checked))
  }, [checked, mounted])

  const toggleChecked = (id: string) => {
    setChecked((prev) => {
      if (prev[id]) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: { checked: true, checkedAt: new Date().toISOString() } }
    })
  }

  const toggleCollapse = (days: number) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(days) ? next.delete(days) : next.add(days)
      return next
    })
  }

  const checkAllInDay = (subs: Subscription[]) => {
    const updates: CheckedState = {}
    subs.forEach((sub) => {
      if (!checked[sub.id]) {
        updates[sub.id] = { checked: true, checkedAt: new Date().toISOString() }
      }
    })
    setChecked((prev) => ({ ...prev, ...updates }))
  }

  const grouped = groupByDueDate(subscriptions)
  const urgentCount = subscriptions.filter(
    (s) => s.isActive && getDaysUntilDue(s.nextDueDate) <= 3 && getDaysUntilDue(s.nextDueDate) >= 0 && !checked[s.id],
  ).length
  const weekCount = subscriptions.filter(
    (s) => s.isActive && getDaysUntilDue(s.nextDueDate) <= 7 && getDaysUntilDue(s.nextDueDate) >= 0 && !checked[s.id],
  ).length

  if (!mounted) {
    return <div className="bg-card rounded-2xl border-2 border-border p-6 animate-pulse h-64" />
  }

  return (
    <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          "p-4 border-b-2 transition-colors",
          urgentCount > 0
            ? "bg-destructive/10 border-destructive/20"
            : weekCount === 0
              ? "bg-success/10 border-success/20"
              : "border-border",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                urgentCount > 0 ? "bg-destructive/20" : weekCount === 0 ? "bg-success/20" : "bg-secondary",
              )}
            >
              {urgentCount > 0 ? (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              ) : weekCount === 0 ? (
                <Sparkles className="w-5 h-5 text-success" />
              ) : (
                <Check className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {urgentCount > 0 ? `${urgentCount} Urgent` : weekCount === 0 ? "All Clear" : `${weekCount} Due`}
              </h2>
              <p className="text-xs text-muted-foreground">
                {urgentCount > 0 ? "needs attention" : weekCount === 0 ? "you're all set" : "this week"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">
              $
              {subscriptions
                .filter((s) => s.isActive && getDaysUntilDue(s.nextDueDate) <= 7 && getDaysUntilDue(s.nextDueDate) >= 0)
                .reduce((sum, s) => sum + s.amount, 0)
                .toFixed(0)}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase">this week</p>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="divide-y-2 divide-border">
        <AnimatePresence mode="popLayout">
          {Array.from(grouped.entries()).map(([days, subs]) => {
            const isUrgent = days <= 3
            const dayTotal = subs.reduce((sum, s) => sum + s.amount, 0)
            const allChecked = subs.every((s) => checked[s.id])
            const checkedCount = subs.filter((s) => checked[s.id]).length
            const isCollapsed = collapsed.has(days)

            return (
              <motion.div key={days} layout className={cn("transition-colors", allChecked && "bg-secondary/30")}>
                {/* Day Header */}
                <button
                  onClick={() => toggleCollapse(days)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors",
                    isUrgent && !allChecked && "bg-destructive/5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-[10px] font-bold tracking-wider px-2 py-1 rounded",
                        isUrgent && !allChecked ? "bg-destructive text-destructive-foreground" : "bg-secondary",
                      )}
                    >
                      {getDayLabel(days)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {checkedCount}/{subs.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums">${dayTotal.toFixed(0)}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", !isCollapsed && "rotate-180")} />
                  </div>
                </button>

                {/* Mark all */}
                {!isCollapsed && subs.length > 1 && !allChecked && (
                  <div className="px-4 pb-2">
                    <button
                      onClick={() => checkAllInDay(subs)}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Mark all {subs.length} as reviewed
                    </button>
                  </div>
                )}

                {/* Items */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="divide-y divide-border/50 overflow-hidden"
                    >
                      {subs.map((sub) => {
                        const isChecked = !!checked[sub.id]
                        return (
                          <motion.button
                            key={sub.id}
                            layout
                            onClick={() => toggleChecked(sub.id)}
                            className={cn(
                              "w-full px-4 py-3 flex items-center gap-3 text-left",
                              "hover:bg-secondary/50 active:bg-secondary transition-all",
                              isChecked && "opacity-50",
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                isChecked
                                  ? "bg-success border-success"
                                  : isUrgent
                                    ? "border-destructive"
                                    : "border-border",
                              )}
                            >
                              {isChecked && <Check className="w-4 h-4 text-success-foreground" />}
                            </div>
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: sub.color + "20" }}
                            >
                              <span className="text-sm font-bold" style={{ color: sub.color }}>
                                {sub.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("font-medium truncate", isChecked && "line-through")}>{sub.name}</p>
                              <p className="text-[10px] text-muted-foreground">{sub.billingCycle}</p>
                            </div>
                            <p className={cn("text-lg font-bold tabular-nums", isChecked && "line-through")}>
                              ${sub.amount.toFixed(2)}
                            </p>
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {grouped.size === 0 && (
        <div className="p-12 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-success" />
          <p className="font-medium">Nothing due soon</p>
          <p className="text-sm text-muted-foreground">Enjoy your peace of mind</p>
        </div>
      )}
    </div>
  )
}
