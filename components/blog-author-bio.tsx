import Image from "next/image"
import Link from "next/link"

import { resolveMediaUrl, type MediaLike } from "@/lib/cms-mappers"

type BlogAuthorBioProps = {
  photo?: number | MediaLike | null
  name: string
  role?: string | null
  bio: string
  linkedinUrl?: string | null
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function BlogAuthorBio({ photo, name, role, bio, linkedinUrl }: BlogAuthorBioProps) {
  const photoUrl = resolveMediaUrl(photo)
  const photoAlt = typeof photo === "object" && photo?.alt ? photo.alt : name

  return (
    <div className="my-8 flex items-start gap-5 rounded-2xl border border-border bg-white p-6 sm:gap-[22px] sm:p-7">
      <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-lake-pale">
        {photoUrl ? (
          <Image src={photoUrl} alt={photoAlt} fill className="object-cover object-top" sizes="76px" />
        ) : (
          <span className="font-brand-display text-lg font-bold text-primary">{getInitials(name)}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2.5">
          <span className="font-brand-display text-lg font-bold tracking-[-0.01em] text-heading">
            {name}
          </span>
          {linkedinUrl ? (
            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on LinkedIn`}
              className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-lake-pale text-primary transition-colors hover:bg-lake-light"
            >
              <LinkedInIcon />
            </Link>
          ) : null}
        </div>
        {role ? (
          <p className="mb-2.5 text-body font-semibold text-primary">{role}</p>
        ) : null}
        <p className="text-body leading-relaxed text-muted-foreground">{bio}</p>
      </div>
    </div>
  )
}
