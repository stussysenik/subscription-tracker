"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { generateSpendingHistory } from "@/lib/subscriptions"
import { cn } from "@/lib/utils"

type TimeRange = "3m" | "6m" | "1y" | "all"

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "All" },
]

export function SpendingChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1y")
  const [hoveredData, setHoveredData] = useState<{ month: string; amount: number } | null>(null)

  const data = generateSpendingHistory()

  // Filter data based on time range
  const filteredData = (() => {
    switch (timeRange) {
      case "3m":
        return data.slice(-3)
      case "6m":
        return data.slice(-6)
      case "1y":
        return data
      case "all":
        return data
    }
  })()

  const currentAmount = filteredData[filteredData.length - 1]?.amount || 0
  const previousAmount = filteredData[filteredData.length - 2]?.amount || currentAmount
  const percentChange = ((currentAmount - previousAmount) / previousAmount) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card rounded-xl border border-border p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Spending</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-semibold tabular-nums">
              ${hoveredData?.amount.toFixed(2) || currentAmount.toFixed(2)}
            </span>
            <span
              className={cn(
                "text-sm tabular-nums font-medium",
                percentChange >= 0 ? "text-destructive" : "text-success",
              )}
            >
              {percentChange >= 0 ? "+" : ""}
              {percentChange.toFixed(1)}%
            </span>
          </div>
          {hoveredData && <span className="text-xs text-muted-foreground">{hoveredData.month} 2025</span>}
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center bg-secondary rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                timeRange === range.value
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px] sm:h-[240px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            onMouseMove={(e) => {
              if (e.activePayload) {
                setHoveredData(e.activePayload[0].payload)
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.15} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              dy={10}
            />
            <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
            <Tooltip
              content={() => null}
              cursor={{ stroke: "var(--color-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="currentColor"
              strokeWidth={2}
              fill="url(#spendingGradient)"
              className="text-foreground"
              dot={false}
              activeDot={{
                r: 4,
                stroke: "var(--color-background)",
                strokeWidth: 2,
                fill: "var(--color-foreground)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sparkline Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-sm font-medium tabular-nums">
            ${(filteredData.reduce((sum, d) => sum + d.amount, 0) / filteredData.length).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Highest</p>
          <p className="text-sm font-medium tabular-nums">
            ${Math.max(...filteredData.map((d) => d.amount)).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Lowest</p>
          <p className="text-sm font-medium tabular-nums">
            ${Math.min(...filteredData.map((d) => d.amount)).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
