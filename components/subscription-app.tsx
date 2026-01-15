"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  mockSubscriptions,
  calculateMonthlyTotal,
  calculateYearlyTotal,
  getUpcomingDues,
  getCategoryTotals,
  type Subscription,
  type SubscriptionCategory,
} from "@/lib/subscriptions"
import { QuickCheck } from "./quick-check"
import { InsightsView } from "./insights-view"
import { QuickSearch } from "./quick-search"
import { ConnectSources } from "./connect-sources"
import { StatementReview } from "./statement-review"
import { SettingsView } from "./settings-view"
import { Search, Sun, Moon, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export type AppView = "home" | "insights" | "connect" | "review" | "settings"

const navItems: { id: AppView; label: string }[] = [
  { id: "home", label: "Due" },
  { id: "insights", label: "Insights" },
  { id: "connect", label: "Connect" },
  { id: "review", label: "Review" },
  { id: "settings", label: "Settings" },
]

export function SubscriptionApp() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [currentView, setCurrentView] = useState<AppView>("home")
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory | "all">("all")
  const [isDark, setIsDark] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const monthlyTotal = calculateMonthlyTotal(subscriptions)
  const yearlyTotal = calculateYearlyTotal(subscriptions)
  const categoryTotals = getCategoryTotals(subscriptions)
  const upcomingDues = getUpcomingDues(subscriptions, 7)

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-300", !isLoaded && "opacity-0")}>
      {/* Quick Search Overlay */}
      <QuickSearch
        subscriptions={subscriptions}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={() => {
          setCurrentView("home")
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b-2 border-border">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-xs">R</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Recur</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 pb-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  "active:scale-95",
                  currentView === item.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {item.label}
                {item.id === "review" && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
                    5
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="px-4 py-6 pb-8"
            >
              {/* Big Numbers */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-card rounded-2xl border-2 border-border p-5 text-center">
                  <p className="text-4xl font-bold tabular-nums">${monthlyTotal.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">per month</p>
                </div>
                <div className="bg-card rounded-2xl border-2 border-border p-5 text-center">
                  <p className="text-4xl font-bold tabular-nums">${yearlyTotal.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">per year</p>
                </div>
              </div>

              {/* Link to Insights */}
              <button
                onClick={() => setCurrentView("insights")}
                className="w-full mb-6 p-4 rounded-2xl bg-secondary/50 border-2 border-border hover:border-foreground/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">View Detailed Insights</p>
                    <p className="text-xs text-muted-foreground">Charts, projections & breakdown</p>
                  </div>
                </div>
                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Quick Check */}
              <QuickCheck subscriptions={subscriptions} />
            </motion.div>
          )}

          {currentView === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              <InsightsView
                subscriptions={subscriptions}
                monthlyTotal={monthlyTotal}
                yearlyTotal={yearlyTotal}
                categoryTotals={categoryTotals}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </motion.div>
          )}

          {currentView === "connect" && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              <ConnectSources />
            </motion.div>
          )}

          {currentView === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              <StatementReview />
            </motion.div>
          )}

          {currentView === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              <SettingsView isDark={isDark} onToggleTheme={toggleTheme} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
