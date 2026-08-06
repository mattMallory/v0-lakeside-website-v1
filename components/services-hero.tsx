import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import { ServicesHeroBackground } from "@/components/services-hero-background"
import type { ServicesContent } from "@/lib/services-defaults"
import { growthSystemBackgrounds } from "@/lib/homepage-growth-system-defaults"

type ServicesHeroProps = {
  content: ServicesContent["hero"]
}

export function ServicesHero({ content }: ServicesHeroProps) {
  return (
    <section
      className="relative min-h-[30rem] overflow-hidden border-b border-[#1F2E45] bg-[#0B1220] md:min-h-[26rem]"
      style={{
        backgroundImage: `linear-gradient(100deg, rgba(11,18,32,.88) 0%, rgba(11,18,32,.55) 55%, rgba(11,18,32,.15) 100%), url('${growthSystemBackgrounds.hero}')`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
      }}
    >
      <ServicesHeroBackground variant="dark" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow variant="dark">{content.eyebrow}</SectionEyebrow>
          <h1 className="font-brand-display mt-4 text-balance text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#B9C2CF]">
            {content.description}
          </p>
        </div>
      </div>
    </section>
  )
}
