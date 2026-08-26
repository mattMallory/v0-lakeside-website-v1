import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { GrowthSystemFunnel } from "@/components/homepage-growth-system/growth-system-funnel"
import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import { CaseStudyHighlight } from "@/components/case-study-highlight"
import { Button } from "@/components/ui/button"
import type { BlogPostSummary, CaseStudyPost } from "@/lib/blog-types"
import { growthSystemBackgrounds } from "@/lib/homepage-growth-system-defaults"
import type { GrowthSystemContent } from "@/lib/homepage-template"
import { getIcon } from "@/lib/icons"

type HomepageGrowthSystemProps = {
  content: GrowthSystemContent
  posts: BlogPostSummary[]
  caseStudy: CaseStudyPost | null
}

export function HomepageGrowthSystem({ content, posts, caseStudy }: HomepageGrowthSystemProps) {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-background">
      <header
        className="relative overflow-hidden bg-surface-dark"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(11,18,32,.88) 0%, rgba(11,18,32,.55) 55%, rgba(11,18,32,.15) 100%), url('${growthSystemBackgrounds.hero}')`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      >
        <div className="relative z-10 mx-auto max-w-page px-6 py-24 pb-[84px]">
          <SectionEyebrow variant="dark">{content.heroEyebrow}</SectionEyebrow>
          <h1 className="font-brand-display max-w-[780px] text-balance text-[clamp(2rem,5.2vw,3.625rem)] font-bold leading-[1.28] tracking-display text-white">
            {content.heroHeadline}{" "}
            <span className="text-accent-on-dark">{content.heroHeadlineAccent}</span>
          </h1>
          <p className="mt-9 max-w-[600px] text-pretty text-lead leading-relaxed text-foreground-on-dark">
            {content.heroSubheadline}
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <Link
              href="#audit"
              className="rounded-full bg-white px-[26px] py-[15px] font-brand-display text-body font-bold text-ink no-underline"
            >
              {content.heroPrimaryCta}
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-white/25 px-[26px] py-[15px] font-brand-display text-body font-bold text-white no-underline"
            >
              {content.heroSecondaryCta}
            </Link>
          </div>
          <div className="mt-14 grid max-w-[760px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5 border-t border-white/15 pt-7">
            {content.heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="font-brand-display text-[28px] font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-caption text-muted-foreground-on-dark">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-page px-6 pt-20">
        <div className="flex flex-wrap overflow-hidden rounded-2xl border border-border bg-white">
          <div
            className="flex min-w-[300px] flex-1 flex-col justify-center p-[clamp(28px,4vw,40px)]"
            style={{
              backgroundImage: `linear-gradient(160deg, rgba(14,23,38,.9), rgba(14,23,38,.5)), url('${growthSystemBackgrounds.who}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <SectionEyebrow variant="dark">{content.whoEyebrow}</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.625rem,3.2vw,2.375rem)] font-bold leading-display tracking-display text-white">
              {content.whoHeadline}
            </h2>
            <p className="mt-3.5 text-pretty text-base leading-relaxed text-muted-foreground-on-dark">
              {content.whoDescription}
            </p>
          </div>
          <div className="min-w-[300px] flex-[1.3] p-[clamp(24px,3vw,32px)]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px overflow-hidden rounded-xl border border-border bg-border">
              {content.whoCriteria.map((item) => {
                const Icon = getIcon(item.icon)
                return (
                  <div key={item.title} className="bg-white p-5">
                    <div className="mb-3 flex h-[46px] w-[46px] items-center justify-center rounded-lg bg-lake-pale text-primary">
                      <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
                    </div>
                    <div className="font-brand-display text-body font-bold text-heading">
                      {item.title}
                    </div>
                    <div className="mt-1 text-body leading-snug text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <GrowthSystemFunnel content={content} />

      <section
        className="bg-ink py-[88px]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(14,23,38,.9) 0%, rgba(14,23,38,.62) 45%, rgba(14,23,38,.9) 100%), url('${growthSystemBackgrounds.pillars}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-page px-6">
          <div className="mb-12 max-w-[640px]">
            <SectionEyebrow variant="dark">{content.pillarsEyebrow}</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-white">
              {content.pillarsHeadline}
            </h2>
            <p className="mt-3.5 text-pretty text-lg leading-relaxed text-muted-foreground-on-dark">
              {content.pillarsDescription}
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {content.pillars.map((pillar) => {
              const Icon = getIcon(pillar.icon)
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border-on-dark bg-surface-dark-raised p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(37,99,168,.18)] text-accent-on-dark">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-brand-display text-balance text-lead font-bold tracking-[-0.01em] text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-pretty text-body leading-relaxed text-muted-foreground-on-dark">
                    {pillar.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 pt-[88px]">
        <div className="overflow-hidden rounded-2xl border border-border">
          <div
            className="p-[clamp(30px,4vw,44px)]"
            style={{
              backgroundImage: `linear-gradient(105deg, rgba(14,23,38,.9) 0%, rgba(14,23,38,.55) 55%, rgba(14,23,38,.2) 100%), url('${growthSystemBackgrounds.included}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <SectionEyebrow variant="dark">{content.includedEyebrow}</SectionEyebrow>
            <h2 className="max-w-[600px] font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-white">
              {content.includedHeadline}
            </h2>
            <p className="mt-3.5 max-w-[620px] text-pretty text-lg leading-relaxed text-foreground-on-dark">
              {content.includedDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px border-t border-border bg-border md:grid-cols-3">
            {content.includedItems.map((item) => (
              <div key={item.title} className="bg-white p-[26px]">
                <div className="font-brand-display text-base font-bold text-heading">
                  {item.title}
                </div>
                <p className="mt-2 text-pretty text-body leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {caseStudy ? (
        <CaseStudyHighlight
          eyebrow={content.caseStudyHighlight.eyebrow}
          headline={content.caseStudyHighlight.headline}
          caseStudy={caseStudy}
          className="bg-background py-0 pt-[88px] pb-0"
        />
      ) : null}

      <section
        className="mt-[80px] bg-surface-dark py-[88px]"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(11,18,32,.88) 0%, rgba(11,18,32,.55) 55%, rgba(11,18,32,.15) 100%), url('${growthSystemBackgrounds.hero}')`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      >
        <div className="mx-auto max-w-page px-6">
          <div className="mb-9 max-w-[640px]">
            <SectionEyebrow variant="dark">{content.resultsEyebrow}</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-white">
              {content.resultsHeadline}
            </h2>
          </div>
          {content.testimonials[0] ? (
            <div className="grid overflow-hidden rounded-2xl border border-border-on-dark bg-white md:grid-cols-[clamp(220px,32%,340px)_1fr]">
              {content.testimonials[0].photoUrl ? (
                <Image
                  src={content.testimonials[0].photoUrl}
                  alt={content.testimonials[0].photoAlt}
                  width={340}
                  height={400}
                  className="aspect-[4/3] w-full object-cover object-center md:aspect-auto md:h-full md:rounded-l-2xl"
                />
              ) : (
                <div
                  className="flex aspect-[4/3] w-full items-center justify-center bg-lake-pale font-mono text-micro text-muted-foreground-subtle md:aspect-auto md:h-full md:rounded-l-2xl"
                >
                  testimonial photo
                </div>
              )}
              <div className="min-w-[280px] flex-1 p-[clamp(32px,5vw,52px)]">
                <p className="text-pretty text-[clamp(1.25rem,2.5vw,1.65rem)] font-medium leading-body text-heading">
                  &ldquo;{content.testimonials[0].quote}&rdquo;
                </p>
                <div className="mt-5 font-brand-display text-body font-bold text-heading">
                  {content.testimonials[0].name}
                </div>
                <div className="text-[13.5px] text-muted-foreground">
                  {content.testimonials[0].practice}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 pt-[88px]">
        <div className="mb-9 max-w-[640px]">
          <SectionEyebrow>{content.teamEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-heading">
            {content.teamHeadline}
          </h2>
          <p className="mt-3.5 text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.teamDescription}
          </p>
        </div>
        {content.teamImageUrl ? (
          <Image
            src={content.teamImageUrl}
            alt={content.teamImageAlt}
            width={1120}
            height={360}
            className="mb-5 h-[clamp(240px,32vw,360px)] w-full rounded-2xl border border-border object-cover object-center"
          />
        ) : null}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {content.teamMembers.map((member) => (
            <div key={member.name} className="rounded-2xl border border-border bg-white p-7">
              <div className="relative mb-[18px] aspect-square w-1/2 overflow-hidden rounded-full border border-border bg-lake-pale">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.photoAlt}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-muted-foreground-subtle">
                    headshot
                  </div>
                )}
              </div>
              <div className="font-brand-display text-lead font-bold tracking-display text-heading">
                {member.name}
              </div>
              <div className="mt-1 text-[13.5px] font-semibold text-primary">{member.role}</div>
              <p className="mt-3 text-pretty text-body leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
              {member.linkedinUrl ? (
                <Link
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-block font-brand-display text-[13.5px] font-bold text-primary underline decoration-primary/40 underline-offset-3"
                >
                  LinkedIn →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            render={<Link href="/about" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            About us
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section
        className="mt-[50px] bg-ink py-[88px]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(14,23,38,.9) 0%, rgba(14,23,38,.62) 45%, rgba(14,23,38,.9) 100%), url('${growthSystemBackgrounds.pillars}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-page px-6">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[600px]">
              <SectionEyebrow variant="dark">{content.articlesEyebrow}</SectionEyebrow>
              <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-white">
                {content.articlesHeadline}
              </h2>
            </div>
            <Link
              href="/blog"
              className="font-brand-display text-body font-bold whitespace-nowrap text-accent-on-dark underline decoration-accent-on-dark/40 underline-offset-3"
            >
              {content.articlesLinkLabel}
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
            {posts.slice(0, 4).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl bg-white no-underline"
              >
                <div className="relative aspect-video bg-lake-pale">
                  {post.featuredImageUrl ? (
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-micro text-accent-on-dark">
                      article image · 16:9
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <span className="self-start rounded-full bg-lake-pale px-[11px] py-[5px] text-micro font-semibold uppercase tracking-eyebrow text-primary">
                    {post.isCaseStudy ? "Case Study" : (post.category?.name ?? "Article")}
                  </span>
                  <h3 className="font-brand-display text-base font-bold leading-snug tracking-display text-heading">
                    {post.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-body font-semibold text-primary">
                    Read more
                    <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 pt-[50px]">
        <div className="mb-7 max-w-[640px]">
          <SectionEyebrow>{content.nextEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-heading">
            {content.nextHeadline}
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {content.nextSteps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-border bg-white p-[26px]">
              <div className="mb-3.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary font-brand-display text-caption font-bold text-white">
                {index + 1}
              </div>
              <div className="font-brand-display text-base font-bold text-heading">{step.title}</div>
              <p className="mt-2 text-pretty text-body leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="audit" className="mx-auto max-w-page px-6 py-5 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-[#3761a2] p-[clamp(36px,6vw,64px)]">
          <div className="max-w-[520px]">
            <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-white">
              {content.auditHeadline}
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-[#DCE8F6]">
              {content.auditDescription}
            </p>
          </div>
          <Link
            href={content.auditButtonUrl}
            className="rounded-full bg-white px-[30px] py-4 font-brand-display text-base font-bold whitespace-nowrap text-[#3761a2] no-underline"
          >
            {content.auditButtonLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
