import { TrendingDown, LineChart, Compass, BarChart3 } from "lucide-react"

const problems = [
  {
    icon: LineChart,
    image: "/problems/low-patients.jpg",
    title: "Inconsistent Patient Flow",
    description: "Your schedule swings from fully booked to worryingly quiet with no reliable way to predict it.",
  },
  {
    icon: TrendingDown,
    image: "/why/patient-room.jpg",
    title: "Unpredictable Revenue",
    description: "When new patients dry up, so does cash flow, making it hard to plan or grow with confidence.",
  },
  {
    icon: Compass,
    image: "/problems/unpredictable-revenue.jpg",
    title: "Marketing Guesswork",
    description: "You're left wondering what's actually working and where your budget is quietly disappearing.",
  },
  {
    icon: BarChart3,
    image: "/problems/marketing-guesswork-v2.jpg",
    title: "Confusing Metrics",
    description: "Impressions and clicks look nice on a report, but they don't fill your appointment book.",
  },
]

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Problems We Can Help You Solve
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          If referrals slow down, does your schedule slow down too? Many clinic owners struggle with the same
          challenges.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((problem) => (
          <div
            key={problem.title}
            className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="relative">
              <img
                src={problem.image || "/placeholder.svg"}
                alt={problem.title}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute -bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-card text-primary shadow-md ring-1 ring-border">
                <problem.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="px-5 pb-6 pt-8">
              <h3 className="font-semibold text-card-foreground">{problem.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
