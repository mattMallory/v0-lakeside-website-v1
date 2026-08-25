import path from "path"
import { fileURLToPath } from "url"
import type { Config } from "payload"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"
import sharp from "sharp"

import { Media } from "../collections/Media"
import { Categories } from "../collections/Categories"
import { Posts } from "../collections/Posts"
import { Tags } from "../collections/Tags"
import { Users } from "../collections/Users"
import { About } from "../globals/About"
import { Branding } from "../globals/Branding"
import { Calendar } from "../globals/Calendar"
import { Consultation } from "../globals/Consultation"
import { Homepage } from "../globals/Homepage"
import { Legal } from "../globals/Legal"
import { Navigation } from "../globals/Navigation"
import { Services } from "../globals/Services"
import { getSeoPlugin } from "./seo-plugin"
import { seedAboutIfEmpty } from "./seed-about"
import { seedBlogIfEmpty } from "./seed-blog"
import { seedBrandingIfEmpty } from "./seed-branding"
import { seedCalendarIfEmpty } from "./seed-calendar"
import { seedCaseStudyHighlightGlobal } from "./seed-case-study-highlight"
import { seedConsultationIfEmpty } from "./seed-consultation"
import { seedLegalIfEmpty } from "./seed-legal"
import { seedNavigationIfEmpty } from "./seed-navigation"
import { seedHomepageIfEmpty } from "./seed-homepage"
import { seedServicesIfEmpty } from "./seed-services"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export function createPayloadConfig(
  db: Config["db"],
  options: {
    plugins?: Config["plugins"]
    beforeSeed?: () => Promise<void>
  } = {},
) {
  return buildConfig({
    admin: {
      user: Users.slug,
      meta: {
        titleSuffix: "— Lakeside",
        icons: [
          {
            rel: "icon",
            type: "image/svg+xml",
            url: "/lakeside-logo.svg",
          },
        ],
      },
      components: {
        graphics: {
          Logo: "@/components/payload/LakesideAdminLogo#LakesideAdminLogo",
          Icon: "@/components/payload/LakesideAdminIcon#LakesideAdminIcon",
        },
      },
      importMap: {
        baseDir: path.resolve(dirname, ".."),
      },
    },
    collections: [Users, Media, Categories, Tags, Posts],
    globals: [Branding, Homepage, About, Services, Legal, Navigation, Calendar, Consultation],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
      outputFile: path.resolve(dirname, "..", "payload-types.ts"),
    },
    db,
    plugins: [getSeoPlugin(), ...(options.plugins ?? [])],
    sharp,
    onInit: async (payload) => {
      try {
        if (options.beforeSeed) {
          await options.beforeSeed()
        }
        await seedBrandingIfEmpty(payload)
        await seedHomepageIfEmpty(payload)
        await seedAboutIfEmpty(payload)
        await seedServicesIfEmpty(payload)
        await seedLegalIfEmpty(payload)
        await seedNavigationIfEmpty(payload)
        await seedCalendarIfEmpty(payload)
        await seedConsultationIfEmpty(payload)
        await seedBlogIfEmpty(payload)
        await seedCaseStudyHighlightGlobal(payload, "homepage")
        await seedCaseStudyHighlightGlobal(payload, "about")
        await seedCaseStudyHighlightGlobal(payload, "services-page")
      } catch (error) {
        console.error("[payload] onInit seeding failed:", error)
      }
    },
  })
}
