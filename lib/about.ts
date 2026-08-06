import { defaultAboutContent, type AboutContent } from "@/lib/about-defaults"
import { mapCaseStudyHighlight } from "@/lib/case-study-highlight"
import { toImagePositionValue, type ImagePositionValue } from "@/lib/image-position"

type MediaLike = {
  url?: string | null
  alt?: string | null
}

type TeamMemberDoc = {
  name?: string | null
  role?: string | null
  bio?: string | null
  photo?: number | MediaLike | null
  photoPosition?: string | null
  initials?: string | null
  linkedinUrl?: string | null
  youtubeUrl?: string | null
  instagramUrl?: string | null
  xUrl?: string | null
  facebookUrl?: string | null
}

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

function mergeArray<T>(value: T[] | null | undefined, fallback: T[]): T[] {
  if (!value || value.length === 0) return fallback
  return value
}

function resolveMediaUrl(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  return typeof media.url === "string" && media.url.trim() ? media.url : undefined
}

function resolveSocialUrl(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed || undefined
}

function mapTeamMemberSocials(
  member: TeamMemberDoc,
  fallback?: AboutContent["team"]["members"][number]["socials"],
): AboutContent["team"]["members"][number]["socials"] | undefined {
  const socials = {
    linkedin: resolveSocialUrl(member.linkedinUrl) ?? fallback?.linkedin,
    youtube: resolveSocialUrl(member.youtubeUrl) ?? fallback?.youtube,
    instagram: resolveSocialUrl(member.instagramUrl) ?? fallback?.instagram,
    x: resolveSocialUrl(member.xUrl) ?? fallback?.x,
    facebook: resolveSocialUrl(member.facebookUrl) ?? fallback?.facebook,
  }

  return Object.values(socials).some(Boolean) ? socials : undefined
}

function mapTeamMember(
  member: TeamMemberDoc,
  fallbackImageUrl?: string,
  fallbackInitials?: string,
  fallbackImagePosition?: ImagePositionValue,
  fallbackSocials?: AboutContent["team"]["members"][number]["socials"],
): AboutContent["team"]["members"][number] | null {
  if (!member.name || !member.role || !member.bio) return null

  const imageUrl = resolveMediaUrl(member.photo) ?? fallbackImageUrl
  const initials =
    withFallback(member.initials, "") ||
    fallbackInitials ||
    member.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

  return {
    name: member.name,
    role: member.role,
    bio: member.bio,
    socials: mapTeamMemberSocials(member, fallbackSocials),
    ...(imageUrl
      ? {
          imageUrl,
          imagePosition: toImagePositionValue(member.photoPosition, fallbackImagePosition ?? "top"),
        }
      : { initials }),
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultAboutContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const about = await payload.findGlobal({
      slug: "about",
      depth: 2,
    })

    const fallbackMembers = defaultAboutContent.team.members
    const teamMembers = mergeArray(about.teamMembers, fallbackMembers)
      .map((member, index) =>
        mapTeamMember(
          member as TeamMemberDoc,
          fallbackMembers[index]?.imageUrl,
          fallbackMembers[index]?.initials,
          fallbackMembers[index]?.imagePosition,
          fallbackMembers[index]?.socials,
        ),
      )
      .filter((member): member is AboutContent["team"]["members"][number] => Boolean(member))

    return {
      hero: {
        eyebrow: withFallback(about.heroEyebrow, defaultAboutContent.hero.eyebrow),
        title: withFallback(about.heroTitle, defaultAboutContent.hero.title),
        description: withFallback(about.heroDescription, defaultAboutContent.hero.description),
        imageUrl:
          resolveMediaUrl(about.heroImage as number | MediaLike | null | undefined) ??
          defaultAboutContent.hero.imageUrl,
        imageAlt: withFallback(about.heroImageAlt, defaultAboutContent.hero.imageAlt),
        imagePosition: toImagePositionValue(
          about.heroImagePosition as string | null | undefined,
          defaultAboutContent.hero.imagePosition,
        ),
      },
      visionMission: {
        headline: withFallback(
          about.visionMissionHeadline,
          defaultAboutContent.visionMission.headline,
        ),
        vision: {
          label: withFallback(about.visionLabel, defaultAboutContent.visionMission.vision.label),
          text: withFallback(about.visionText, defaultAboutContent.visionMission.vision.text),
        },
        mission: {
          label: withFallback(about.missionLabel, defaultAboutContent.visionMission.mission.label),
          text: withFallback(about.missionText, defaultAboutContent.visionMission.mission.text),
        },
      },
      process: {
        eyebrow: withFallback(about.processEyebrow, defaultAboutContent.process.eyebrow),
        title: withFallback(about.processTitle, defaultAboutContent.process.title),
        description: withFallback(about.processDescription, defaultAboutContent.process.description),
        centerTitle: withFallback(about.processCenterTitle, defaultAboutContent.process.centerTitle),
        centerSubtitle: withFallback(
          about.processCenterSubtitle,
          defaultAboutContent.process.centerSubtitle,
        ),
        items: mergeArray(about.processItems, defaultAboutContent.process.items),
      },
      team: {
        eyebrow: withFallback(about.teamEyebrow, defaultAboutContent.team.eyebrow),
        title: withFallback(about.teamTitle, defaultAboutContent.team.title),
        description: withFallback(about.teamDescription, defaultAboutContent.team.description),
        members: teamMembers.length > 0 ? teamMembers : defaultAboutContent.team.members,
      },
      caseStudyHighlight: mapCaseStudyHighlight(
        about,
        defaultAboutContent.caseStudyHighlight,
      ),
      cta: {
        headline: withFallback(about.ctaHeadline, defaultAboutContent.cta.headline),
        description: withFallback(about.ctaDescription, defaultAboutContent.cta.description),
        button: withFallback(about.ctaButton, defaultAboutContent.cta.button),
      },
    }
  } catch (error) {
    console.error("[payload] Failed to load about content:", error)
    return defaultAboutContent
  }
}

export type { AboutContent, AboutProcessItem, AboutTeamMember } from "@/lib/about-defaults"
