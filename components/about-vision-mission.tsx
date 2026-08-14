import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import type { AboutContent } from "@/lib/about-defaults"
import { growthSystemBackgrounds } from "@/lib/homepage-growth-system-defaults"
import { getIcon } from "@/lib/icons"

type AboutVisionMissionProps = {
  content: AboutContent["visionMission"]
}

const visionMissionCards = [
  { key: "vision", icon: "compass" },
  { key: "mission", icon: "heart-pulse" },
] as const

export function AboutVisionMission({ content }: AboutVisionMissionProps) {
  const cards = [
    { icon: visionMissionCards[0].icon, label: content.vision.label, text: content.vision.text },
    { icon: visionMissionCards[1].icon, label: content.mission.label, text: content.mission.text },
  ]

  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="flex flex-wrap overflow-hidden rounded-2xl border border-border bg-white">
          <div
            className="flex min-w-[300px] flex-1 flex-col justify-center p-[clamp(28px,4vw,40px)]"
            style={{
              backgroundImage: `linear-gradient(160deg, rgba(14,23,38,.9), rgba(14,23,38,.5)), url('${growthSystemBackgrounds.who}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <SectionEyebrow variant="dark">Our Foundation</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.625rem,3.2vw,2.375rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white">
              {content.headline}
            </h2>
            <p className="mt-3.5 text-pretty text-base leading-relaxed text-muted-foreground-on-dark">
              Two commitments shape how we build lasting growth for the practices we partner with.
            </p>
          </div>

          <div className="min-w-[300px] flex-[1.3] p-[clamp(24px,3vw,32px)]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px overflow-hidden rounded-xl border border-border bg-border">
              {cards.map((card) => {
                const Icon = getIcon(card.icon)

                return (
                  <div key={card.label} className="bg-white p-5">
                    <div className="mb-3 flex h-[46px] w-[46px] items-center justify-center rounded-[11px] bg-lake-pale text-primary">
                      <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
                    </div>
                    <div className="font-brand-display text-body font-bold text-heading">{card.label}</div>
                    <div className="mt-1 text-body leading-snug text-muted-foreground">{card.text}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
