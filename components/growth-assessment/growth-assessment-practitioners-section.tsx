import { CmsImage } from "@/components/cms-image"
import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import type { GrowthAssessmentPractitioner } from "@/lib/growth-assessment-defaults"

type GrowthAssessmentPractitionersSectionProps = {
  eyebrow: string
  headline: string
  description: string
  practitioners: GrowthAssessmentPractitioner[]
}

function PractitionerCard({ practitioner }: { practitioner: GrowthAssessmentPractitioner }) {
  return (
    <article className="flex w-[min(100%,280px)] shrink-0 snap-start flex-col rounded-xl border border-border bg-white p-5 sm:w-auto sm:shrink">
      <div className="relative mb-4 aspect-[4/5] w-full max-w-[120px] overflow-hidden rounded-xl border border-[#EDEEF0] bg-[#F4F8FC]">
        {practitioner.photoUrl ? (
          <CmsImage
            src={practitioner.photoUrl}
            alt={practitioner.name}
            fill
            sizes="120px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-brand-display text-2xl font-bold text-primary/50">
            {practitioner.initials || "DR"}
          </div>
        )}
      </div>
      <h3 className="font-brand-display text-[16.5px] font-bold tracking-[-0.01em] text-heading">
        {practitioner.name}
      </h3>
      <p className="mt-0.5 text-[13px] font-semibold text-primary">{practitioner.specialty}</p>
      <blockquote className="mt-3 border-l-2 border-[#E8E5DF] pl-3 text-[14px] leading-relaxed text-[#4B5563]">
        {practitioner.quote}
      </blockquote>
    </article>
  )
}

export function GrowthAssessmentPractitionersSection({
  eyebrow,
  headline,
  description,
  practitioners,
}: GrowthAssessmentPractitionersSectionProps) {
  return (
    <section className="mt-[88px] bg-[#0E1726]">
      <div className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="mb-10 max-w-[680px]">
          <SectionEyebrow variant="dark">{eyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            {headline}
          </h2>
          <div className="mt-4 space-y-4 text-pretty text-[16.5px] leading-relaxed text-[#B9C2CF]">
            {description.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {practitioners.map((practitioner) => (
            <PractitionerCard key={`${practitioner.name}-${practitioner.specialty}`} practitioner={practitioner} />
          ))}
        </div>
      </div>
    </section>
  )
}
