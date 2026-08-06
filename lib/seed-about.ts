import type { Payload } from "payload"

import { defaultAboutContent } from "@/lib/about-defaults"

async function ensureMediaFromPublicFile(
  payload: Payload,
  filePath: string,
  alt: string,
): Promise<number | null> {
  const path = await import("path")
  const fs = await import("fs")
  const absolutePath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""))

  if (!fs.existsSync(absolutePath)) {
    return null
  }

  const filename = path.basename(absolutePath)
  const existing = await payload.find({
    collection: "media",
    where: {
      filename: {
        equals: filename,
      },
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]?.id) {
    return existing.docs[0].id as number
  }

  const created = await payload.create({
    collection: "media",
    data: { alt },
    filePath: absolutePath,
  })

  return created.id as number
}

export async function seedAboutIfEmpty(payload: Payload) {
  try {
    const about = await payload.findGlobal({
      slug: "about",
      depth: 0,
    })

    if (about.teamMembers && about.teamMembers.length > 0) {
      return
    }

    const heroImageId = await ensureMediaFromPublicFile(
      payload,
      defaultAboutContent.hero.imageUrl,
      defaultAboutContent.hero.imageAlt,
    )

    const petePhotoId = await ensureMediaFromPublicFile(
      payload,
      "/about/pete-wisniewski.jpg",
      "Pete Wisniewski",
    )
    const mattPhotoId = await ensureMediaFromPublicFile(
      payload,
      "/about/matt-mallory.jpg",
      "Matt Mallory",
    )

    const teamMembers = defaultAboutContent.team.members.map((member) => {
      const photoId =
        member.name === "Pete Wisniewski"
          ? petePhotoId
          : member.name === "Matt Mallory"
            ? mattPhotoId
            : null

      return {
        name: member.name,
        role: member.role,
        bio: member.bio,
        initials: member.initials ?? "",
        ...(photoId ? { photo: photoId } : {}),
      }
    })

    await payload.updateGlobal({
      slug: "about",
      data: {
        heroEyebrow: defaultAboutContent.hero.eyebrow,
        heroTitle: defaultAboutContent.hero.title,
        heroDescription: defaultAboutContent.hero.description,
        heroImageAlt: defaultAboutContent.hero.imageAlt,
        ...(heroImageId ? { heroImage: heroImageId } : {}),
        visionMissionHeadline: defaultAboutContent.visionMission.headline,
        visionLabel: defaultAboutContent.visionMission.vision.label,
        visionText: defaultAboutContent.visionMission.vision.text,
        missionLabel: defaultAboutContent.visionMission.mission.label,
        missionText: defaultAboutContent.visionMission.mission.text,
        processEyebrow: defaultAboutContent.process.eyebrow,
        processTitle: defaultAboutContent.process.title,
        processDescription: defaultAboutContent.process.description,
        processCenterTitle: defaultAboutContent.process.centerTitle,
        processCenterSubtitle: defaultAboutContent.process.centerSubtitle,
        processItems: defaultAboutContent.process.items,
        teamEyebrow: defaultAboutContent.team.eyebrow,
        teamTitle: defaultAboutContent.team.title,
        teamDescription: defaultAboutContent.team.description,
        teamMembers,
        ctaHeadline: defaultAboutContent.cta.headline,
        ctaDescription: defaultAboutContent.cta.description,
        ctaButton: defaultAboutContent.cta.button,
      },
    })
  } catch (error) {
    console.error("[seed] Failed to seed about global:", error)
  }
}
