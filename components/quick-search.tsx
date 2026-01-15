"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ArrowRight } from "lucide-react"
import type { Subscription } from "@/lib/subscriptions"

interface QuickSearchProps {
  subscriptions: Subscription[]
  isOpen: boolean
  onClose: () => void
  onSelect: (sub: Subscription) => void
}

export function QuickSearch({ subscriptions, isOpen, onClose, onSelect }: QuickSearchProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else setQuery("")
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && isOpen && onClose()
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const filtered = subscriptions.filter((sub) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return sub.name.toLowerCase().includes(q) || sub.category.includes(q) || sub.platform.toLowerCase().includes(q)
  })

  const grouped = filtered.reduce(
    (acc, sub) => {
      const letter = sub.name.charAt(0).toUpperCase()
      if (!acc[letter]) acc[letter] = []
      acc[letter].push(sub)
      return acc
    },
    {} as Record<string, Subscription[]>,
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background"
        >
          <div className="sticky top-0 bg-background border-b-2 border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subscriptions..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border-2 border-transparent text-lg placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary hover:bg-secondary/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-100px)] pb-20">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="font-medium">No matches</p>
                <p className="text-sm text-muted-foreground">Try a different term</p>
              </div>
            ) : (
              <div className="divide-y-2 divide-border">
                {Object.entries(grouped)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([letter, subs]) => (
                    <div key={letter}>
                      <div className="px-4 py-2 bg-secondary/50 sticky top-0">
                        <span className="text-xs font-bold text-muted-foreground">{letter}</span>
                      </div>
                      {subs.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            onSelect(sub)
                            onClose()
                          }}
                          className="w-full px-4 py-4 flex items-center gap-4 hover:bg-secondary/50 active:bg-secondary"
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: sub.color + "20" }}
                          >
                            <span className="text-lg font-bold" style={{ color: sub.color }}>
                              {sub.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold truncate">{sub.name}</p>
                            <p className="text-sm text-muted-foreground">{sub.platform}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold tabular-nums">${sub.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{sub.billingCycle}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-background/95 backdrop-blur-xl border-t-2 border-border">
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filtered.length}</span> subscriptions ·{" "}
              <span className="font-bold text-foreground">
                ${filtered.reduce((s, sub) => s + sub.amount, 0).toFixed(0)}
              </span>
              /mo
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
