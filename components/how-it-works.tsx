import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HowItWorksStepCard } from "@/components/how-it-works-step-card"

const steps = [
  {
    number: "01",
    title: "We Learn Your Clinic",
    description: "We dig into your services, ideal patients, and goals so every campaign reflects your practice.",
  },
  {
    number: "02",
    title: "We Launch Your Lead Generation System",
    description: "Ads, landing pages, and follow-up go live as one connected engine built to book appointments.",
  },
  {
    number: "03",
    title: "We Optimize For More Appointments",
    description: "We monitor performance and refine continuously to drive down cost and drive up qualified inquiries.",
  },
  {
    number: "04",
    title: "You Focus On Patient Care",
    description: "With a reliable flow of new patients, you get back to doing what you do best, helping people heal.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          A simple, proven path from first conversation to a fuller appointment book.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <HowItWorksStepCard key={step.number} step={step} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          render={<Link href="#system" />}
          nativeButton={false}
          size="lg"
          variant="outline"
          className="rounded-full px-8 bg-transparent"
        >
          Learn More
        </Button>
      </div>
    </section>
  )
}
