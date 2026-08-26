import { CmsImage } from "@/components/cms-image"
import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import type { AboutContent } from "@/lib/about-defaults"
import { growthSystemBackgrounds } from "@/lib/homepage-growth-system-defaults"

type AboutHeroProps = {
  content: AboutContent["hero"]
}

export function AboutHero({ content }: AboutHeroProps) {
  return (
    <section
      className="relative min-h-[30rem] overflow-hidden border-b border-border-on-dark bg-surface-dark md:min-h-[32rem]"
      style={{
        backgroundImage: `linear-gradient(100deg, rgba(11,18,32,.88) 0%, rgba(11,18,32,.55) 55%, rgba(11,18,32,.15) 100%), url('${growthSystemBackgrounds.hero}')`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
      }}
    >
      <div className="relative z-10 mx-auto max-w-page px-6 py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-left">
            <SectionEyebrow variant="dark">{content.eyebrow}</SectionEyebrow>
            <h1 className="font-brand-display mt-5 max-w-xl text-balance text-4xl font-bold leading-display text-white sm:text-5xl md:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-body text-foreground-on-dark md:text-lead">
              {content.description}
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-surface-dark-raised lg:aspect-[5/4]">
            <CmsImage
              src={content.imageUrl}
              alt={content.imageAlt}
              position={content.imagePosition}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
