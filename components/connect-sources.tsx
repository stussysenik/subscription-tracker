"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Mail, CreditCard, Building2, Check, ChevronRight, ShieldCheck, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConnectedSource {
  id: string
  type: "email" | "bank" | "card"
  name: string
  identifier: string
  lastSync: string
  subscriptionsFound: number
  status: "connected" | "syncing"
}

const mockConnected: ConnectedSource[] = [
  {
    id: "1",
    type: "email",
    name: "Gmail",
    identifier: "john@gmail.com",
    lastSync: "2 min ago",
    subscriptionsFound: 8,
    status: "connected",
  },
  {
    id: "2",
    type: "bank",
    name: "Chase",
    identifier: "••••4521",
    lastSync: "Just now",
    subscriptionsFound: 5,
    status: "connected",
  },
]

const availableSources = [
  {
    type: "email" as const,
    providers: [
      { id: "gmail", name: "Gmail", icon: "G", color: "#EA4335" },
      { id: "outlook", name: "Outlook", icon: "O", color: "#0078D4" },
    ],
    description: "Scan receipts & emails",
  },
  {
    type: "bank" as const,
    providers: [{ id: "plaid", name: "Connect Bank", icon: "🏦", color: "#000000" }],
    description: "Via Plaid - secure",
  },
  {
    type: "card" as const,
    providers: [
      { id: "visa", name: "Visa", icon: "V", color: "#1A1F71" },
      { id: "amex", name: "Amex", icon: "A", color: "#006FCF" },
    ],
    description: "Detect recurring charges",
  },
]

export function ConnectSources() {
  const [connected, setConnected] = useState<ConnectedSource[]>(mockConnected)
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (providerId: string) => {
    setConnecting(providerId)
    await new Promise((r) => setTimeout(r, 2000))
    setConnecting(null)
  }

  const handleSync = async (sourceId: string) => {
    setConnected((prev) => prev.map((s) => (s.id === sourceId ? { ...s, status: "syncing" as const } : s)))
    await new Promise((r) => setTimeout(r, 1500))
    setConnected((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, status: "connected" as const, lastSync: "Just now" } : s)),
    )
  }

  return (
    <div className="px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1">Connect Sources</h1>
      <p className="text-muted-foreground text-sm mb-6">Link accounts to auto-detect subscriptions</p>

      <div className="p-4 rounded-xl bg-success/10 border-2 border-success/20 flex items-center gap-3 mb-6">
        <ShieldCheck className="w-8 h-8 text-success flex-shrink-0" />
        <div>
          <p className="font-semibold text-sm">Bank-level Security</p>
          <p className="text-xs text-muted-foreground">256-bit encryption · Read-only · No credentials stored</p>
        </div>
      </div>

      {connected.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Connected ({connected.length})
          </h2>
          <div className="bg-card rounded-2xl border-2 border-border divide-y-2 divide-border overflow-hidden">
            {connected.map((source) => (
              <div key={source.id} className="px-4 py-4 flex items-center gap-4">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    source.type === "email" ? "bg-red-500/10" : "bg-blue-500/10",
                  )}
                >
                  {source.type === "email" ? (
                    <Mail className="w-5 h-5 text-red-500" />
                  ) : (
                    <Building2 className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{source.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{source.identifier}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{source.subscriptionsFound} found</p>
                  <p className="text-xs text-muted-foreground">{source.lastSync}</p>
                </div>
                <button
                  onClick={() => handleSync(source.id)}
                  disabled={source.status === "syncing"}
                  className="p-2 rounded-lg hover:bg-secondary"
                >
                  <RefreshCw className={cn("w-5 h-5", source.status === "syncing" && "animate-spin")} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Add Source</h2>
        {availableSources.map((category) => (
          <div key={category.type} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {category.type === "email" && <Mail className="w-4 h-4" />}
              {category.type === "bank" && <Building2 className="w-4 h-4" />}
              {category.type === "card" && <CreditCard className="w-4 h-4" />}
              <span className="text-sm font-medium capitalize">{category.type}</span>
              <span className="text-xs text-muted-foreground">— {category.description}</span>
            </div>
            <div className="bg-card rounded-2xl border-2 border-border divide-y-2 divide-border overflow-hidden">
              {category.providers.map((provider) => {
                const isConnecting = connecting === provider.id
                const alreadyConnected = connected.some((c) => c.name.toLowerCase() === provider.name.toLowerCase())
                return (
                  <button
                    key={provider.id}
                    onClick={() => !alreadyConnected && handleConnect(provider.id)}
                    disabled={isConnecting || alreadyConnected}
                    className="w-full px-4 py-4 flex items-center gap-4 hover:bg-secondary/50 active:bg-secondary disabled:opacity-50"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: provider.color }}
                    >
                      {provider.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{provider.name}</p>
                      {alreadyConnected && <p className="text-sm text-success">Connected</p>}
                    </div>
                    <AnimatePresence mode="wait">
                      {isConnecting ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : alreadyConnected ? (
                        <Check className="w-5 h-5 text-success" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
