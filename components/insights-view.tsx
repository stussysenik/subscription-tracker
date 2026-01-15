"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell } from "recharts"
import {
  type Subscription,
  type SubscriptionCategory,
  categoryLabels,
  generateSpendingHistory,
} from "@/lib/subscriptions"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react"

interface InsightsViewProps {
  subscriptions: Subscription[]
  monthlyTotal: number
  yearlyTotal: number
  categoryTotals: { category: SubscriptionCategory; total: number; count: number }[]
  selectedCategory: SubscriptionCategory | "all"
  onSelectCategory: (category: SubscriptionCategory | "all") => void
}

type TimeRange = "3m" | "6m" | "1y" | "all"
type ProjectionYears = 1 | 3 | 5 | 10

export function InsightsView({
  subscriptions,
  monthlyTotal,
  yearlyTotal,
  categoryTotals,
  selectedCategory,
  onSelectCategory,
}: InsightsViewProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1y")
  const [projectionYears, setProjectionYears] = useState<ProjectionYears>(5)
  const [hoveredData, setHoveredData] = useState<{ month: string; amount: number } | null>(null)

  const spendingData = generateSpendingHistory()
  const filteredData = (() => {
    switch (timeRange) {
      case "3m":
        return spendingData.slice(-3)
      case "6m":
        return spendingData.slice(-6)
      default:
        return spendingData
    }
  })()

  const currentAmount = filteredData[filteredData.length - 1]?.amount || 0
  const previousAmount = filteredData[filteredData.length - 2]?.amount || currentAmount
  const percentChange = ((currentAmount - previousAmount) / previousAmount) * 100

  const projectedCost = monthlyTotal * 12 * projectionYears
  const totalSpentSoFar = subscriptions.reduce((sum, s) => sum + s.totalPaid, 0)

  // Category data for bar chart
  const categoryChartData = categoryTotals.map((c) => ({
    name: categoryLabels[c.category].slice(0, 8),
    value: c.total,
    category: c.category,
  }))

  return (
    <div className="px-4 py-6 pb-8 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl border-2 border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Spent</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">${totalSpentSoFar.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">all time</p>
        </div>
        <div className="bg-card rounded-2xl border-2 border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Active</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">{subscriptions.filter((s) => s.isActive).length}</p>
          <p className="text-xs text-muted-foreground">subscriptions</p>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-card rounded-2xl border-2 border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Monthly Trend</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">
                ${hoveredData?.amount.toFixed(0) || currentAmount.toFixed(0)}
              </span>
              <span
                className={cn(
                  "text-sm font-medium flex items-center gap-0.5",
                  percentChange >= 0 ? "text-destructive" : "text-success",
                )}
              >
                {percentChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(percentChange).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex bg-secondary rounded-lg p-0.5">
            {(["3m", "6m", "1y", "all"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timeRange === range ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[180px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              onMouseMove={(e) => e.activePayload && setHoveredData(e.activePayload[0].payload)}
              onMouseLeave={() => setHoveredData(null)}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                dy={8}
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
                fill="url(#gradient)"
                className="text-foreground"
                dot={false}
                activeDot={{ r: 4, stroke: "var(--color-background)", strokeWidth: 2, fill: "var(--color-foreground)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Avg</p>
            <p className="text-sm font-semibold tabular-nums">
              ${(filteredData.reduce((s, d) => s + d.amount, 0) / filteredData.length).toFixed(0)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">High</p>
            <p className="text-sm font-semibold tabular-nums">${Math.max(...filteredData.map((d) => d.amount))}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Low</p>
            <p className="text-sm font-semibold tabular-nums">${Math.min(...filteredData.map((d) => d.amount))}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card rounded-2xl border-2 border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">By Category</p>
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

        <div className="h-[120px] -mx-2 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                width={60}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {categoryChartData.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={
                      selectedCategory === entry.category || selectedCategory === "all"
                        ? "var(--color-foreground)"
                        : "var(--color-muted)"
                    }
                    className="cursor-pointer transition-all"
                    onClick={() => onSelectCategory(entry.category)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {categoryTotals.slice(0, 4).map((item, i) => (
            <motion.button
              key={item.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectCategory(item.category)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-lg transition-colors",
                selectedCategory === item.category ? "bg-secondary" : "hover:bg-secondary/50",
              )}
            >
              <span className="text-sm font-medium">{categoryLabels[item.category]}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{item.count} subs</span>
                <span className="text-sm font-semibold tabular-nums">${item.total.toFixed(0)}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cost Projection */}
      <div className="bg-card rounded-2xl border-2 border-border p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Long-term Cost</p>

        <div className="flex gap-2 mb-4">
          {([1, 3, 5, 10] as ProjectionYears[]).map((years) => (
            <button
              key={years}
              onClick={() => setProjectionYears(years)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                projectionYears === years ? "bg-foreground text-background" : "bg-secondary hover:bg-secondary/80",
              )}
            >
              {years}Y
            </button>
          ))}
        </div>

        <div className="text-center py-6 bg-secondary/30 rounded-xl">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {projectionYears} Year{projectionYears > 1 ? "s" : ""} Total
          </p>
          <p className="text-5xl font-bold tabular-nums">${projectedCost.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">at ${monthlyTotal.toFixed(0)}/mo current rate</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-secondary/30 rounded-xl text-center">
            <p className="text-xs text-muted-foreground">Daily</p>
            <p className="text-lg font-bold tabular-nums">${(monthlyTotal / 30).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-xl text-center">
            <p className="text-xs text-muted-foreground">Weekly</p>
            <p className="text-lg font-bold tabular-nums">${(monthlyTotal / 4.33).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* All Subscriptions List */}
      <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
        <div className="p-4 border-b-2 border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">All Subscriptions</p>
        </div>
        <div className="divide-y divide-border">
          {subscriptions
            .filter((s) => selectedCategory === "all" || s.category === selectedCategory)
            .sort((a, b) => b.amount - a.amount)
            .map((sub) => (
              <div key={sub.id} className="px-4 py-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: sub.color + "20" }}
                >
                  <span className="font-bold" style={{ color: sub.color }}>
                    {sub.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{sub.name}</p>
                  <p className="text-xs text-muted-foreground">{sub.billingCycle}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">${sub.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground">${sub.totalPaid.toFixed(0)} total</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
