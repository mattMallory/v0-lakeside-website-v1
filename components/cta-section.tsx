import Link from "next/link"

import { cn } from "@/lib/utils"

type CtaSectionProps = {
  content: {
    ctaHeadline: string
    ctaSubheadline: string
    ctaButton: string
    ctaButtonUrl?: string
  }
  className?: string
}

export function CtaSection({ content, className }: CtaSectionProps) {
  return (
    <section id="contact" className={cn("mx-auto max-w-page px-6 pt-5 pb-24", className)}>
      <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-[#3761a2] p-[clamp(36px,6vw,64px)]">
        <div className="max-w-[520px]">
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-white">
            {content.ctaHeadline}
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-[#DCE8F6]">{content.ctaSubheadline}</p>
        </div>
        <Link
          href={content.ctaButtonUrl ?? "/consultation"}
          className="rounded-full bg-white px-[30px] py-4 font-brand-display text-base font-bold whitespace-nowrap text-[#3761a2] no-underline"
        >
          {content.ctaButton}
        </Link>
      </div>
    </section>
  )
}
