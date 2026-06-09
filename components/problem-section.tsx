import { TrendingDown, LineChart, Compass, BarChart3 } from "lucide-react"

const problems = [
  {
    icon: LineChart,
    title: "Inconsistent patient flow",
    description: "Your schedule swings from fully booked to worryingly quiet with no reliable way to predict it.",
  },
  {
    icon: TrendingDown,
    title: "Unpredictable revenue",
    description: "When new patients dry up, so does cash flow, making it hard to plan or grow with confidence.",
  },
  {
    icon: Compass,
    title: "Marketing that feels like guesswork",
    description: "You're left wondering what's actually working and where your budget is quietly disappearing.",
  },
  {
    icon: BarChart3,
    title: "Agencies focused on vanity metrics",
    description: "Impressions and clicks look nice on a report, but they don't fill your appointment book.",
  },
]

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Most Clinics Depend On Referrals Alone
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          If referrals slow down, does your schedule slow down too? Many clinic owners struggle with the same
          challenges.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((problem) => (
          <div
            key={problem.title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <problem.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-semibold text-card-foreground">{problem.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
