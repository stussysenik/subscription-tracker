"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PendingTransaction {
  id: string
  merchant: string
  amount: number
  date: string
  source: string
  confidence: number
  isRecurring: boolean | null
}

const mockPending: PendingTransaction[] = [
  {
    id: "p1",
    merchant: "AMZN PRIME*2K4M9",
    amount: 14.99,
    date: "2026-01-14",
    source: "Chase ••4521",
    confidence: 98,
    isRecurring: null,
  },
  {
    id: "p2",
    merchant: "GOOGLE *YOUTUBE",
    amount: 22.99,
    date: "2026-01-13",
    source: "Chase ••4521",
    confidence: 95,
    isRecurring: null,
  },
  {
    id: "p3",
    merchant: "DIGITALOCEAN.COM",
    amount: 48.0,
    date: "2026-01-12",
    source: "Chase ••4521",
    confidence: 88,
    isRecurring: null,
  },
  {
    id: "p4",
    merchant: "CANVA PTY LTD",
    amount: 12.99,
    date: "2026-01-10",
    source: "Gmail",
    confidence: 92,
    isRecurring: null,
  },
  {
    id: "p5",
    merchant: "MEDIUM.COM",
    amount: 5.0,
    date: "2026-01-09",
    source: "Gmail",
    confidence: 85,
    isRecurring: null,
  },
]

export function StatementReview() {
  const [transactions, setTransactions] = useState<PendingTransaction[]>(mockPending)
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("pending")

  const handleReview = (id: string, isSubscription: boolean) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, isRecurring: isSubscription } : t)))
  }

  const pendingCount = transactions.filter((t) => t.isRecurring === null).length
  const confirmedCount = transactions.filter((t) => t.isRecurring === true).length
  const rejectedCount = transactions.filter((t) => t.isRecurring === false).length

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true
    if (filter === "pending") return t.isRecurring === null
    if (filter === "confirmed") return t.isRecurring === true
    if (filter === "rejected") return t.isRecurring === false
    return true
  })

  return (
    <div className="px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1">Review Statements</h1>
      <p className="text-muted-foreground text-sm mb-6">Confirm or dismiss detected subscriptions</p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { key: "pending", count: pendingCount, label: "Pending" },
          { key: "confirmed", count: confirmedCount, label: "Confirmed", color: "text-success" },
          { key: "rejected", count: rejectedCount, label: "Dismissed", color: "text-destructive" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as any)}
            className={cn(
              "p-3 rounded-xl border-2 transition-all text-center",
              filter === item.key ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30",
            )}
          >
            <p className={cn("text-xl font-bold tabular-nums", item.color)}>{item.count}</p>
            <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
          </button>
        ))}
      </div>

      {pendingCount > 0 && filter === "pending" && (
        <button
          onClick={() =>
            transactions.forEach((t) => t.isRecurring === null && t.confidence >= 90 && handleReview(t.id, true))
          }
          className="w-full py-3 mb-6 rounded-xl bg-success text-success-foreground font-semibold hover:bg-success/90"
        >
          Auto-confirm High Confidence (
          {transactions.filter((t) => t.isRecurring === null && t.confidence >= 90).length})
        </button>
      )}

      <div className="bg-card rounded-2xl border-2 border-border overflow-hidden divide-y-2 divide-border">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Check className="w-10 h-10 mx-auto mb-3 text-success" />
              <p className="font-medium">All caught up!</p>
            </div>
          ) : (
            filtered.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "px-4 py-4",
                  tx.isRecurring === true && "bg-success/5",
                  tx.isRecurring === false && "opacity-50",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-11 h-11 flex-shrink-0">
                    <svg className="w-11 h-11 -rotate-90">
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-secondary"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${(tx.confidence / 100) * 113} 113`}
                        className={
                          tx.confidence >= 90
                            ? "text-success"
                            : tx.confidence >= 70
                              ? "text-warning"
                              : "text-muted-foreground"
                        }
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                      {tx.confidence}%
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{tx.merchant}</p>
                    <p className="text-xs text-muted-foreground">{tx.source}</p>
                  </div>
                  <p className="text-xl font-bold tabular-nums">${tx.amount.toFixed(2)}</p>
                </div>

                {tx.isRecurring === null ? (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleReview(tx.id, true)}
                      className="flex-1 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 bg-success text-success-foreground active:scale-[0.98]"
                    >
                      <Check className="w-4 h-4" /> Yes
                    </button>
                    <button
                      onClick={() => handleReview(tx.id, false)}
                      className="flex-1 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 bg-secondary active:scale-[0.98]"
                    >
                      <X className="w-4 h-4" /> No
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    {tx.isRecurring ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4" />}
                    <span className="text-sm text-muted-foreground">{tx.isRecurring ? "Added" : "Dismissed"}</span>
                    <button onClick={() => handleReview(tx.id, !tx.isRecurring)} className="ml-auto text-xs underline">
                      Undo
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
