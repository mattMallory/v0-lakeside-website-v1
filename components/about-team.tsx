import Link from "next/link"

import { CmsImage } from "@/components/cms-image"
import type { AboutContent, AboutTeamMember } from "@/lib/about-defaults"

function TeamCard({ member }: { member: AboutTeamMember }) {
  const linkedinUrl = member.socials?.linkedin?.trim()

  return (
    <article className="rounded-2xl border border-border bg-white p-7">
      <div className="relative mb-[18px] aspect-square w-1/2 overflow-hidden rounded-full border border-border bg-lake-pale">
        {member.imageUrl ? (
          <CmsImage
            src={member.imageUrl}
            alt={member.name}
            position={member.imagePosition}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : member.initials ? (
          <div className="flex h-full w-full items-center justify-center font-brand-display text-[clamp(1.5rem,8vw,2.75rem)] font-bold text-primary/70">
            {member.initials}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-muted-foreground-subtle">
            headshot
          </div>
        )}
      </div>

      <h3 className="font-brand-display text-lead font-bold tracking-display text-heading">
        {member.name}
      </h3>
      <p className="mt-1 text-[13.5px] font-semibold text-primary">{member.role}</p>
      <p className="mt-3 text-pretty text-body leading-relaxed text-muted-foreground">{member.bio}</p>
      {linkedinUrl ? (
        <Link
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-block font-brand-display text-[13.5px] font-bold text-primary underline decoration-primary/40 underline-offset-3"
        >
          LinkedIn →
        </Link>
      ) : null}
    </article>
  )
}

type AboutTeamProps = {
  content: AboutContent["team"]
}

export function AboutTeam({ content }: AboutTeamProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium text-muted-foreground">
            {content.eyebrow}
          </span>
          <h2 className="mt-5 text-balance text-3xl font-bold tracking-display text-heading sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{content.description}</p>
        </div>

        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {content.members.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
