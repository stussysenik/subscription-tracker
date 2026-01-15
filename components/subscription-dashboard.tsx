"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  mockSubscriptions,
  calculateMonthlyTotal,
  calculateYearlyTotal,
  getUpcomingDues,
  getCategoryTotals,
  getDaysUntilDue,
  type Subscription,
  type SubscriptionCategory,
} from "@/lib/subscriptions"
import { CategoryBreakdown } from "./category-breakdown"
import { SpendingChart } from "./spending-chart"
import { QuickCheck } from "./quick-check"
import { BottomNav, type AppView } from "./bottom-nav"
import { QuickSearch } from "./quick-search"
import { ConnectSources } from "./connect-sources"
import { StatementReview } from "./statement-review"
import { SettingsView } from "./settings-view"
import { Search, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function SubscriptionDashboard() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [currentView, setCurrentView] = useState<AppView>("home")
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory | "all">("all")
  const [isDark, setIsDark] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)

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
  const upcomingDues = getUpcomingDues(subscriptions, 7)
  const categoryTotals = getCategoryTotals(subscriptions)

  const filteredSubscriptions =
    selectedCategory === "all" ? subscriptions : subscriptions.filter((s) => s.category === selectedCategory)

  const nextDue = upcomingDues[0]
  const daysUntilNext = nextDue ? getDaysUntilDue(nextDue.nextDueDate) : 0

  const handleNavigate = (view: AppView) => {
    if (view === "search") {
      setSearchOpen(true)
    } else {
      setCurrentView(view)
    }
  }

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-300", !isLoaded && "opacity-0")}>
      {/* Quick Search Overlay */}
      <QuickSearch
        subscriptions={subscriptions}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(sub) => {
          setSelectedSub(sub)
          setCurrentView("home")
        }}
      />

      {/* Header - only show on home */}
      {currentView === "home" && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                  <span className="text-background font-bold text-sm">R</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">Recur</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Search Button */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Search subscriptions"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24"
            >
              {/* Big Numbers - Crystal Clear */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-6 text-center">
                  <p className="text-3xl sm:text-5xl font-bold tabular-nums tracking-tight">
                    ${monthlyTotal.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">per month</p>
                </div>
                <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-6 text-center">
                  <p className="text-3xl sm:text-5xl font-bold tabular-nums tracking-tight">
                    ${yearlyTotal.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">per year</p>
                </div>
              </div>

              {/* Quick Check List */}
              <QuickCheck subscriptions={subscriptions} />

              {/* Spending Overview - only on larger screens */}
              <div className="hidden lg:block mt-8">
                <div className="grid grid-cols-2 gap-6">
                  <SpendingChart />
                  <CategoryBreakdown
                    data={categoryTotals}
                    onSelectCategory={setSelectedCategory}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "connect" && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ConnectSources />
            </motion.div>
          )}

          {currentView === "statements" && (
            <motion.div
              key="statements"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
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
              transition={{ duration: 0.2 }}
            >
              <SettingsView isDark={isDark} onToggleTheme={toggleTheme} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} hasUnreviewed={5} />
    </div>
  )
}
