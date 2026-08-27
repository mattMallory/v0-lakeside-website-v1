import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import { ServicesTechLogos } from "@/components/services-tech-logos"
import { layeredSectionBackground } from "@/lib/growth-system-backgrounds"
import { getIcon } from "@/lib/icons"
import type { ServicesContent } from "@/lib/services-defaults"

type ServicesTechStackProps = {
  content: ServicesContent["technology"]
  backgroundImageUrl?: string
}

export function ServicesTechStack({ content, backgroundImageUrl }: ServicesTechStackProps) {
  return (
    <section
      className="bg-[#0E1726] py-[88px]"
      style={layeredSectionBackground(
        "linear-gradient(180deg, rgba(14,23,38,.9) 0%, rgba(14,23,38,.62) 45%, rgba(14,23,38,.9) 100%)",
        backgroundImageUrl,
      )}
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
          <div data-tech-logos-section>
            <SectionEyebrow variant="dark">{content.eyebrow}</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
              {content.headline}
            </h2>
            <p className="mt-3.5 max-w-[34rem] text-pretty text-lg leading-relaxed text-[#94A3B8]">
              {content.description}
            </p>
            <div className="mt-8">
              <ServicesTechLogos logos={content.logos} variant="dark" align="start" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {content.categories.map((category) => {
              const Icon = getIcon(category.icon)
              return (
                <div
                  key={category.title}
                  className="flex flex-col gap-3 rounded-2xl border border-[#1F2E45] bg-[#111B2E] p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(37,99,168,.18)] text-[#7CB0E8]">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-brand-display text-balance text-[19px] font-bold tracking-[-0.01em] text-white">
                    {category.title}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {category.items.map((item) => (
                      <li key={item} className="text-[14.5px] leading-relaxed text-[#94A3B8]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
