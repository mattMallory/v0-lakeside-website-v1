import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import { Button } from "@/components/ui/button"
import { layeredSectionBackground } from "@/lib/growth-system-backgrounds"
import { cn } from "@/lib/utils"

type HomeAboutContent = {
  eyebrow: string
  headline: string
  description: string
  cta: string
  imageUrl: string
  imageAlt: string
}

export function HomeAboutSection({
  content,
  variant = "light",
  backgroundImageUrl,
  className,
}: {
  content: HomeAboutContent
  variant?: "light" | "dark"
  backgroundImageUrl?: string
  className?: string
}) {
  const isDark = variant === "dark"

  return (
    <section
      id="about"
      className={cn("py-20", isDark ? "bg-[#0E1726]" : undefined, className)}
      style={
        isDark
          ? layeredSectionBackground(
              "linear-gradient(180deg, rgba(14,23,38,.9) 0%, rgba(14,23,38,.62) 45%, rgba(14,23,38,.9) 100%)",
              backgroundImageUrl,
            )
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-lake-pale lg:aspect-[5/4]">
            <Image
              src={content.imageUrl}
              alt={content.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            {isDark ? (
              <SectionEyebrow variant="dark">{content.eyebrow}</SectionEyebrow>
            ) : (
              <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
                {content.eyebrow}
              </p>
            )}
            <h2
              className={cn(
                "mt-3 text-balance text-3xl font-bold tracking-[-0.026em] sm:text-4xl",
                isDark ? "text-white" : "text-heading",
              )}
            >
              {content.headline}
            </h2>
            <p
              className={cn(
                "mt-5 text-pretty text-lg leading-relaxed",
                isDark ? "text-[#B9C2CF]" : "text-muted-foreground",
              )}
            >
              {content.description}
            </p>
            <Button
              render={<Link href="/about" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className={cn(
                "mt-8 gap-2",
                isDark && "border-white/25 bg-white text-[#0E1726] hover:bg-white/90 hover:text-[#0E1726]",
              )}
            >
              {content.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
