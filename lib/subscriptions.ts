export interface Subscription {
  id: string
  name: string
  category: SubscriptionCategory
  amount: number
  currency: string
  billingCycle: "weekly" | "monthly" | "quarterly" | "yearly"
  nextDueDate: string
  logo?: string
  color: string
  platform: string
  isActive: boolean
  startDate: string
  totalPaid: number
}

export type SubscriptionCategory =
  | "streaming"
  | "productivity"
  | "cloud"
  | "gaming"
  | "news"
  | "fitness"
  | "finance"
  | "utilities"
  | "education"
  | "other"

export const categoryLabels: Record<SubscriptionCategory, string> = {
  streaming: "Streaming",
  productivity: "Productivity",
  cloud: "Cloud & Storage",
  gaming: "Gaming",
  news: "News & Media",
  fitness: "Health & Fitness",
  finance: "Finance",
  utilities: "Utilities",
  education: "Education",
  other: "Other",
}

export const categoryColors: Record<SubscriptionCategory, string> = {
  streaming: "#1a1a1a",
  productivity: "#2d5a4a",
  cloud: "#4a4a6a",
  gaming: "#6a3a4a",
  news: "#5a4a3a",
  fitness: "#3a5a5a",
  finance: "#4a5a3a",
  utilities: "#5a5a5a",
  education: "#3a4a6a",
  other: "#4a4a4a",
}

// Simulated Plaid-style recurring transactions data
export const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    category: "streaming",
    amount: 15.99,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-18", // Same day as Spotify
    color: "#E50914",
    platform: "Netflix Inc.",
    isActive: true,
    startDate: "2022-03-15",
    totalPaid: 687.57,
  },
  {
    id: "2",
    name: "Spotify Premium",
    category: "streaming",
    amount: 10.99,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-18", // Same day as Netflix
    color: "#1DB954",
    platform: "Spotify AB",
    isActive: true,
    startDate: "2021-08-01",
    totalPaid: 582.47,
  },
  {
    id: "3",
    name: "iCloud+",
    category: "cloud",
    amount: 2.99,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-20", // Same day as GitHub Copilot
    color: "#3693F3",
    platform: "Apple Inc.",
    isActive: true,
    startDate: "2020-11-10",
    totalPaid: 152.49,
  },
  {
    id: "4",
    name: "Notion",
    category: "productivity",
    amount: 10.0,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-16", // Today (for demo)
    color: "#000000",
    platform: "Notion Labs",
    isActive: true,
    startDate: "2023-02-01",
    totalPaid: 240.0,
  },
  {
    id: "5",
    name: "GitHub Copilot",
    category: "productivity",
    amount: 19.0,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-20", // Same day as iCloud+
    color: "#238636",
    platform: "GitHub Inc.",
    isActive: true,
    startDate: "2023-06-15",
    totalPaid: 361.0,
  },
  {
    id: "6",
    name: "Adobe Creative Cloud",
    category: "productivity",
    amount: 54.99,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-02-01",
    color: "#FF0000",
    platform: "Adobe Inc.",
    isActive: true,
    startDate: "2022-01-01",
    totalPaid: 2639.52,
  },
  {
    id: "7",
    name: "New York Times",
    category: "news",
    amount: 17.0,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-16", // Today - same as Notion
    color: "#121212",
    platform: "NYT Co.",
    isActive: true,
    startDate: "2024-01-01",
    totalPaid: 408.0,
  },
  {
    id: "8",
    name: "Disney+",
    category: "streaming",
    amount: 13.99,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-17", // Tomorrow
    color: "#0063E5",
    platform: "Disney Streaming",
    isActive: true,
    startDate: "2023-11-01",
    totalPaid: 195.86,
  },
  {
    id: "9",
    name: "Claude Pro",
    category: "productivity",
    amount: 20.0,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-16", // Today - 3 things due today!
    color: "#D97757",
    platform: "Anthropic",
    isActive: true,
    startDate: "2024-06-01",
    totalPaid: 160.0,
  },
  {
    id: "10",
    name: "Figma",
    category: "productivity",
    amount: 15.0,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-02-03",
    color: "#F24E1E",
    platform: "Figma Inc.",
    isActive: true,
    startDate: "2023-03-01",
    totalPaid: 510.0,
  },
  {
    id: "11",
    name: "Peloton",
    category: "fitness",
    amount: 44.0,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-02-08",
    color: "#181A1D",
    platform: "Peloton Interactive",
    isActive: true,
    startDate: "2024-03-01",
    totalPaid: 484.0,
  },
  {
    id: "12",
    name: "LinkedIn Premium",
    category: "productivity",
    amount: 29.99,
    currency: "USD",
    billingCycle: "monthly",
    nextDueDate: "2026-01-17", // Tomorrow - 2 things tomorrow
    color: "#0A66C2",
    platform: "LinkedIn Corp.",
    isActive: true,
    startDate: "2025-06-01",
    totalPaid: 239.92,
  },
]

export function calculateMonthlyTotal(subs: Subscription[]): number {
  return subs
    .filter((s) => s.isActive)
    .reduce((acc, sub) => {
      switch (sub.billingCycle) {
        case "weekly":
          return acc + sub.amount * 4.33
        case "monthly":
          return acc + sub.amount
        case "quarterly":
          return acc + sub.amount / 3
        case "yearly":
          return acc + sub.amount / 12
        default:
          return acc + sub.amount
      }
    }, 0)
}

export function calculateYearlyTotal(subs: Subscription[]): number {
  return calculateMonthlyTotal(subs) * 12
}

export function getDaysUntilDue(dueDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diffTime = due.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getSubscriptionsByCategory(subs: Subscription[]): Record<SubscriptionCategory, Subscription[]> {
  return subs.reduce(
    (acc, sub) => {
      if (!acc[sub.category]) acc[sub.category] = []
      acc[sub.category].push(sub)
      return acc
    },
    {} as Record<SubscriptionCategory, Subscription[]>,
  )
}

export function getCategoryTotals(
  subs: Subscription[],
): { category: SubscriptionCategory; total: number; count: number }[] {
  const grouped = getSubscriptionsByCategory(subs)
  return Object.entries(grouped)
    .map(([category, items]) => ({
      category: category as SubscriptionCategory,
      total: items.reduce((sum, s) => sum + s.amount, 0),
      count: items.length,
    }))
    .sort((a, b) => b.total - a.total)
}

export function getUpcomingDues(subs: Subscription[], daysAhead = 7): Subscription[] {
  return subs
    .filter((s) => s.isActive && getDaysUntilDue(s.nextDueDate) <= daysAhead && getDaysUntilDue(s.nextDueDate) >= 0)
    .sort((a, b) => getDaysUntilDue(a.nextDueDate) - getDaysUntilDue(b.nextDueDate))
}

// Generate 12-month spending history for charts
export function generateSpendingHistory(): { month: string; amount: number }[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const baseAmount = 210
  return months.map((month, i) => ({
    month,
    amount: baseAmount + Math.floor(Math.random() * 40) - 20 + i * 2, // Slight upward trend
  }))
}
