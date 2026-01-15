"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  icon?: React.ReactNode
  sublabel?: string
  trend?: {
    value: number
    direction: "up" | "down"
  }
  highlight?: boolean
  delay?: number
}

export function MetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  icon,
  sublabel,
  trend,
  highlight = false,
  delay = 0,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 800
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out-expo)
      const eased = 1 - Math.pow(2, -10 * progress)
      const current = startValue + (value - startValue) * eased

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate)
    }, delay * 100)

    return () => clearTimeout(timeoutId)
  }, [value, isVisible, delay])

  const formattedValue = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={cn(
        "group relative bg-card rounded-xl p-4 sm:p-5 border border-border",
        "hover:border-foreground/20 transition-all duration-300",
        "hover:shadow-lg hover:shadow-foreground/5",
        highlight && "border-destructive/50 bg-destructive/5",
      )}
    >
      {/* Icon + Label */}
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span className={cn("text-muted-foreground transition-colors", "group-hover:text-foreground")}>{icon}</span>
        )}
        <span className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-2xl sm:text-3xl lg:text-4xl font-semibold tabular-nums tracking-tight",
            highlight && "text-destructive",
          )}
        >
          {prefix}
          {formattedValue}
          {suffix}
        </span>
      </div>

      {/* Trend / Sublabel */}
      <div className="mt-2 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded",
              trend.direction === "up" ? "text-destructive bg-destructive/10" : "text-success bg-success/10",
            )}
          >
            {trend.direction === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
        {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
      </div>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  )
}
