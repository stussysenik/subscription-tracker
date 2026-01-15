"use client"

import { motion } from "framer-motion"
import { type SubscriptionCategory, categoryLabels } from "@/lib/subscriptions"
import { cn } from "@/lib/utils"

interface CategoryBreakdownProps {
  data: { category: SubscriptionCategory; total: number; count: number }[]
  onSelectCategory: (category: SubscriptionCategory | "all") => void
  selectedCategory: SubscriptionCategory | "all"
}

export function CategoryBreakdown({ data, onSelectCategory, selectedCategory }: CategoryBreakdownProps) {
  const maxTotal = Math.max(...data.map((d) => d.total))

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">By Category</h3>
        <button
          onClick={() => onSelectCategory("all")}
          className={cn(
            "text-xs px-2 py-1 rounded-md transition-colors",
            selectedCategory === "all"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </button>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.total / maxTotal) * 100
          const isSelected = selectedCategory === item.category

          return (
            <motion.button
              key={item.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectCategory(item.category)}
              className={cn("w-full text-left group", "focus:outline-none")}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {categoryLabels[item.category]}
                </span>
                <span className="text-xs tabular-nums font-medium">${item.total.toFixed(2)}</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full transition-colors duration-200",
                    isSelected ? "bg-foreground" : "bg-foreground/40 group-hover:bg-foreground/60",
                  )}
                />
              </div>

              {/* Count indicator */}
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">
                  {item.count} subscription{item.count !== 1 ? "s" : ""}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {((item.total / data.reduce((sum, d) => sum + d.total, 0)) * 100).toFixed(0)}%
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
