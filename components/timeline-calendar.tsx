"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import type { Subscription } from "@/lib/subscriptions"
import { cn } from "@/lib/utils"

interface TimelineCalendarProps {
  subscriptions: Subscription[]
}

export function TimelineCalendar({ subscriptions }: TimelineCalendarProps) {
  // Generate next 31 days
  const days = useMemo(() => {
    const result = []
    const today = new Date()

    for (let i = 0; i < 31; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const dateStr = date.toISOString().split("T")[0]
      const dueOnDay = subscriptions.filter((s) => s.nextDueDate === dateStr)

      result.push({
        date,
        dateStr,
        dayNum: date.getDate(),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        isToday: i === 0,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        subscriptions: dueOnDay,
        total: dueOnDay.reduce((sum, s) => sum + s.amount, 0),
      })
    }
    return result
  }, [subscriptions])

  const maxDayTotal = Math.max(...days.map((d) => d.total), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-xl border border-border p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">31-Day Timeline</h3>
        <span className="text-xs text-muted-foreground">Jan 15 — Feb 14, 2026</span>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex gap-1 min-w-max pb-2">
          {days.map((day, index) => {
            const hasSubscriptions = day.subscriptions.length > 0
            const barHeight = day.total > 0 ? Math.max((day.total / maxDayTotal) * 60, 8) : 0

            return (
              <motion.div
                key={day.dateStr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                className={cn(
                  "flex flex-col items-center gap-1 p-1 rounded-lg min-w-[40px]",
                  "transition-colors cursor-default",
                  day.isToday && "bg-foreground/5",
                  hasSubscriptions && "hover:bg-secondary",
                )}
              >
                {/* Day name */}
                <span
                  className={cn(
                    "text-[10px] uppercase",
                    day.isWeekend ? "text-muted-foreground/50" : "text-muted-foreground",
                  )}
                >
                  {day.dayName}
                </span>

                {/* Bar */}
                <div className="h-[60px] w-6 flex items-end justify-center">
                  {barHeight > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: barHeight }}
                      transition={{ delay: 0.3 + index * 0.02, duration: 0.3, ease: "easeOut" }}
                      className="w-full rounded-t-sm relative group"
                      style={{
                        backgroundColor: hasSubscriptions
                          ? day.subscriptions.length === 1
                            ? day.subscriptions[0].color
                            : "var(--color-foreground)"
                          : "transparent",
                      }}
                    >
                      {/* Tooltip */}
                      {hasSubscriptions && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-foreground text-background rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                            <p className="font-medium">${day.total.toFixed(2)}</p>
                            <p className="text-background/70">{day.subscriptions.map((s) => s.name).join(", ")}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Day number */}
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums",
                    day.isToday &&
                      "bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center",
                    day.isWeekend && !day.isToday && "text-muted-foreground/50",
                  )}
                >
                  {day.dayNum}
                </span>

                {/* Dot indicator */}
                {hasSubscriptions && (
                  <div className="flex gap-0.5">
                    {day.subscriptions.slice(0, 3).map((sub, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sub.color }} />
                    ))}
                    {day.subscriptions.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-foreground" />
          <span className="text-xs text-muted-foreground">Multiple dues</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-foreground/20" />
          <span className="text-xs text-muted-foreground">No dues</span>
        </div>
        <div className="ml-auto text-xs text-muted-foreground tabular-nums">
          Total this month: ${subscriptions.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
        </div>
      </div>
    </motion.div>
  )
}
