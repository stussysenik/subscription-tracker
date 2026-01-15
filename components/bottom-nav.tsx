"use client"

import { motion } from "framer-motion"
import { Home, Search, Link2, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export type AppView = "home" | "search" | "connect" | "statements" | "settings"

interface BottomNavProps {
  currentView: AppView
  onNavigate: (view: AppView) => void
  hasUnreviewed?: number
}

const navItems: { id: AppView; icon: typeof Home; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "search", icon: Search, label: "Search" },
  { id: "connect", icon: Link2, label: "Connect" },
  { id: "statements", icon: FileText, label: "Review" },
  { id: "settings", icon: Settings, label: "Settings" },
]

export function BottomNav({ currentView, onNavigate, hasUnreviewed = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t-2 border-border safe-area-pb">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = currentView === item.id
            const Icon = item.icon
            const showBadge = item.id === "statements" && hasUnreviewed > 0

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200",
                  "active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="relative">
                  <Icon className={cn("w-6 h-6 transition-transform duration-200", isActive && "scale-110")} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {hasUnreviewed > 9 ? "9+" : hasUnreviewed}
                    </span>
                  )}
                </div>
                <span className={cn("text-[10px] mt-1 font-medium", isActive && "font-bold")}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-0.5 w-8 h-1 bg-foreground rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
