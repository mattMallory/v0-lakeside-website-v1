import { Megaphone, LayoutTemplate, Users, Gauge } from "lucide-react"

const services = [
  {
    icon: Megaphone,
    title: "Targeted Paid Advertising",
    description:
      "Generate qualified patient inquiries through targeted Google and Meta advertising campaigns built for healthcare.",
  },
  {
    icon: LayoutTemplate,
    title: "Conversion-Focused Landing Pages",
    description:
      "Turn clicks into consultations with conversion-focused landing pages designed specifically for healthcare practices.",
  },
  {
    icon: Users,
    title: "Complete Lead Management System",
    description: "Never lose a potential patient because of missed follow-up opportunities or slow response times.",
  },
  {
    icon: Gauge,
    title: "Ongoing Campaign Optimization",
    description: "Continuous monitoring and improvement to maximize performance and lower your cost per appointment.",
  },
]

export function ServicesSection() {
  return (
    <section id="system" className="bg-secondary/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Our New Patient System</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything Needed To Fill Your Schedule
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex gap-5 rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <service.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
