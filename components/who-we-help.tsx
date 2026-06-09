"use client"

import { useState } from "react"
import { Activity, Bone, FlaskConical, Leaf, HeartPulse, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const practices = [
  {
    name: "Acupuncturists",
    icon: Activity,
    detail:
      "We help acupuncture practices fill their schedules with patients actively seeking natural pain relief, fertility support, and stress management.",
  },
  {
    name: "Chiropractors",
    icon: Bone,
    detail:
      "Attract new patients looking for spinal health, mobility, and drug-free pain solutions with campaigns built for chiropractic care.",
  },
  {
    name: "Functional Medicine Clinics",
    icon: FlaskConical,
    detail:
      "Reach patients ready to invest in root-cause care, advanced testing, and personalized treatment plans for chronic conditions.",
  },
  {
    name: "Naturopathic Doctors",
    icon: Leaf,
    detail:
      "Connect with health-conscious patients who value holistic, evidence-informed naturopathic medicine and long-term wellness.",
  },
  {
    name: "Wellness Clinics",
    icon: HeartPulse,
    detail:
      "Grow your membership and service bookings with a steady stream of qualified inquiries for your wellness offerings.",
  },
  {
    name: "Integrative Health Practices",
    icon: Sparkles,
    detail:
      "Position your practice as the go-to destination for patients seeking the best of conventional and complementary care.",
  },
]

export function WhoWeHelp() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="who-we-help" className="bg-secondary/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Who We Help</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            We partner with natural healthcare practices across the wellness spectrum.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice, index) => {
            const Icon = practice.icon
            const isOpen = openIndex === index
            return (
              <button
                key={practice.name}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "flex flex-col items-center rounded-2xl border bg-card px-6 py-8 text-center transition-colors",
                  isOpen ? "border-primary" : "border-border hover:border-primary/50",
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-4 flex items-center gap-1.5 font-semibold text-card-foreground">
                  {practice.name}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180 text-primary",
                    )}
                  />
                </span>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <p className="overflow-hidden text-pretty text-sm leading-relaxed text-muted-foreground">
                    {practice.detail}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
