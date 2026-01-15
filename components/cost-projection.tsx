"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CostProjectionProps {
  monthlyTotal: number
}

type ProjectionPeriod = "1y" | "3y" | "5y" | "10y"

const periods: { value: ProjectionPeriod; label: string; months: number }[] = [
  { value: "1y", label: "1 Year", months: 12 },
  { value: "3y", label: "3 Years", months: 36 },
  { value: "5y", label: "5 Years", months: 60 },
  { value: "10y", label: "10 Years", months: 120 },
]

export function CostProjection({ monthlyTotal }: CostProjectionProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ProjectionPeriod>("5y")

  const currentPeriod = periods.find((p) => p.value === selectedPeriod)!
  const projectedTotal = monthlyTotal * currentPeriod.months

  // What you could buy instead (fun comparison)
  const comparisons = [
    { threshold: 1000, label: "iPhone 16 Pro", value: 999 },
    { threshold: 3000, label: "MacBook Air", value: 1299 },
    { threshold: 5000, label: "Used Car Down Payment", value: 5000 },
    { threshold: 15000, label: "European Vacation", value: 8000 },
    { threshold: 30000, label: "Home Down Payment", value: 30000 },
  ]

  const relevantComparison = comparisons.find((c) => projectedTotal >= c.threshold) || comparisons[0]
  const howMany = Math.floor(projectedTotal / relevantComparison.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Long-term Cost Projection</h3>
          <p className="text-xs text-muted-foreground">If current spending remains unchanged</p>
        </div>

        {/* Period Toggle */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                selectedPeriod === period.value
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Projection */}
      <div className="text-center py-6">
        <motion.div
          key={selectedPeriod}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <span className="text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums tracking-tight">
            ${projectedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <p className="text-sm text-muted-foreground">over {currentPeriod.months} months</p>
        </motion.div>
      </div>

      {/* Comparison */}
      <div className="bg-secondary/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">That&apos;s equivalent to</p>
        <p className="text-lg font-semibold">
          {howMany}× {relevantComparison.label}
          {howMany > 1 ? "s" : ""}
        </p>
      </div>

      {/* Monthly Breakdown */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-semibold tabular-nums">${monthlyTotal.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">per month</p>
        </div>
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-semibold tabular-nums">${(monthlyTotal / 30).toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">per day</p>
        </div>
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-semibold tabular-nums">${(monthlyTotal * 12).toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">per year</p>
        </div>
      </div>

      {/* Mental Note */}
      <div className="mt-4 p-3 bg-accent/30 rounded-lg border border-accent/50">
        <p className="text-xs text-center text-foreground/80">
          💡 Canceling just one $15/month subscription saves you{" "}
          <strong>${(15 * currentPeriod.months).toLocaleString()}</strong> over {currentPeriod.label.toLowerCase()}
        </p>
      </div>
    </motion.div>
  )
}
