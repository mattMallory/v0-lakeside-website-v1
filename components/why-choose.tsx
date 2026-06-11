import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchOverlayGraphic } from "@/components/search-overlay-graphic"

const cards = [
  {
    // EDIT PER TILE: base photo + overlay graphic
    baseImage: "/why/woman-full-photo.jpg",
    baseAlt: "Patient researching wellness clinics",
    overlayImage: "/why/places-overlay.png",
    overlayAlt: "Wellness-specific patient acquisition strategy",
    // EDIT PER TILE: overlay size (Tailwind width) + position
    overlayWidthClass: "w-[60%]",
    overlayPositionClass: "left-3 top-49 sm:left-4",
    heading: "Wellness-Specific Patient Strategies",
    body: "Unlike generalist agencies, we build patient acquisition plans designed around how natural health practices actually grow, speaking directly to the people already searching for your care.",
  },
  {
    baseImage: "/why/Fram-12-2.jpg",
    baseAlt: "Patient searching for a local wellness clinic on her phone",
    overlayImage: "/why/Frame 11.png",
    overlayAlt: "Google search results showing local wellness clinics with ratings and directions",
    overlayWidthClass: "w-[40%]",
    overlayPositionClass: "left-40 top-25 sm:left-40",
    heading: "The Right Patients in Your Area",
    body: "We carefully target the people most likely to book and stay, so your calendar fills with quality local patients who value your approach, not low-intent clicks that never convert.",
  },
  {
    baseImage: "/why/woman-full-photo.jpg",
    baseAlt: "Clinic owner reviewing growth reports",
    overlayImage: "/why/places-overlay.png",
    overlayAlt: "Predictable measurable growth reporting",
    overlayWidthClass: "w-[60%]",
    overlayPositionClass: "left-3 top-45 sm:left-4",
    heading: "Predictable, measurable growth",
    body: "No more guessing or relying on referrals alone. You get transparent reporting you can actually understand and a steady, repeatable flow of new patients month after month.",
  },
]

export function WhyChoose() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Sticky left column */}
        <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start lg:py-12">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Clinics Choose Lakeside
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Since day one, Lakeside has focused on one thing: helping natural wellness clinics attract more of the right
            patients. We know your industry, and we build patient acquisition systems around the way real practices
            grow. Here&apos;s why clinics trust us.
          </p>
          <Button
            render={<Link href="/consultation" />}
            nativeButton={false}
            size="lg"
            className="mt-8 rounded-full px-8"
          >
            Schedule a Consultation
          </Button>
        </div>

        {/* Scrolling cards */}
        <div className="flex flex-col gap-8">
          {cards.map((card) => (
            <article key={card.heading} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <SearchOverlayGraphic
                baseImage={card.baseImage}
                baseAlt={card.baseAlt}
                overlayImage={card.overlayImage}
                overlayAlt={card.overlayAlt}
                overlayWidthClass={card.overlayWidthClass}
                overlayPositionClass={card.overlayPositionClass}
              />
              <div className="pt-5">
                <h3 className="text-xl font-bold text-card-foreground">{card.heading}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
