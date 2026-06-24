import {
  Activity,
  BarChart3,
  Bone,
  Compass,
  FlaskConical,
  Gauge,
  HeartPulse,
  LayoutTemplate,
  Leaf,
  LineChart,
  Megaphone,
  Sparkles,
  TrendingDown,
  Users,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  "line-chart": LineChart,
  "trending-down": TrendingDown,
  compass: Compass,
  "bar-chart-3": BarChart3,
  megaphone: Megaphone,
  "layout-template": LayoutTemplate,
  users: Users,
  gauge: Gauge,
  activity: Activity,
  bone: Bone,
  "flask-conical": FlaskConical,
  leaf: Leaf,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
}

export const iconOptions = Object.keys(iconMap).map((value) => ({
  label: value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
  value,
}))

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? LineChart
}
