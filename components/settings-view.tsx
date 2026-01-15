"use client"

import { useState } from "react"
import { Bell, Moon, Sun, Shield, HelpCircle, LogOut, ChevronRight, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsViewProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function SettingsView({ isDark, onToggleTheme }: SettingsViewProps) {
  const [notifications, setNotifications] = useState(true)
  const [reminders, setReminders] = useState(true)

  return (
    <div className="px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Preferences</h2>
        <div className="bg-card rounded-2xl border-2 border-border divide-y-2 divide-border overflow-hidden">
          <button onClick={onToggleTheme} className="w-full px-4 py-4 flex items-center gap-4 hover:bg-secondary/50">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Appearance</p>
              <p className="text-sm text-muted-foreground">{isDark ? "Dark" : "Light"}</p>
            </div>
            <div
              className={cn("w-11 h-6 rounded-full p-0.5 transition-colors", isDark ? "bg-success" : "bg-secondary")}
            >
              <div className={cn("w-5 h-5 rounded-full bg-white transition-transform", isDark && "translate-x-5")} />
            </div>
          </button>

          <button
            onClick={() => setNotifications(!notifications)}
            className="w-full px-4 py-4 flex items-center gap-4 hover:bg-secondary/50"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Notifications</p>
              <p className="text-sm text-muted-foreground">{notifications ? "On" : "Off"}</p>
            </div>
            <div
              className={cn(
                "w-11 h-6 rounded-full p-0.5 transition-colors",
                notifications ? "bg-success" : "bg-secondary",
              )}
            >
              <div
                className={cn("w-5 h-5 rounded-full bg-white transition-transform", notifications && "translate-x-5")}
              />
            </div>
          </button>

          <button
            onClick={() => setReminders(!reminders)}
            className="w-full px-4 py-4 flex items-center gap-4 hover:bg-secondary/50"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Due Reminders</p>
              <p className="text-sm text-muted-foreground">3 days before</p>
            </div>
            <div
              className={cn("w-11 h-6 rounded-full p-0.5 transition-colors", reminders ? "bg-success" : "bg-secondary")}
            >
              <div className={cn("w-5 h-5 rounded-full bg-white transition-transform", reminders && "translate-x-5")} />
            </div>
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Account</h2>
        <div className="bg-card rounded-2xl border-2 border-border divide-y-2 divide-border overflow-hidden">
          <button className="w-full px-4 py-4 flex items-center gap-4 hover:bg-secondary/50">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <p className="flex-1 text-left font-semibold">Privacy & Security</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full px-4 py-4 flex items-center gap-4 hover:bg-secondary/50">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <p className="flex-1 text-left font-semibold">Help & Support</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </section>

      <button className="w-full py-4 rounded-xl border-2 border-destructive text-destructive font-semibold hover:bg-destructive/10 flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" /> Sign Out
      </button>

      <p className="text-center text-xs text-muted-foreground mt-8">Recur v1.0.0</p>
    </div>
  )
}
