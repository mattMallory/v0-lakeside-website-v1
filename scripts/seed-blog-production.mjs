import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function isPostgresUrl(url) {
  return Boolean(url?.trim().startsWith("postgres://") || url?.trim().startsWith("postgresql://"))
}

const postgresUrl = [
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.POSTGRES_URL,
  process.env.DATABASE_URL,
].find(isPostgresUrl)

if (!process.env.PAYLOAD_SECRET?.trim()) {
  console.error("Missing PAYLOAD_SECRET. Copy it from Vercel → Settings → Environment Variables → Production.")
  process.exit(1)
}

if (!postgresUrl) {
  console.error(
    "Missing Postgres URL. Set POSTGRES_URL (or POSTGRES_URL_NON_POOLING) from Vercel before running this script.",
  )
  process.exit(1)
}

process.env.POSTGRES_URL = postgresUrl
process.env.PAYLOAD_DB_PUSH = "false"

const configUrl = pathToFileURL(path.join(root, "payload.config.postgres.ts")).href

const { getPayload } = await import("payload")
const { default: config } = await tsImport(configUrl, import.meta.url)
const { seedBlogIfEmpty } = await tsImport(pathToFileURL(path.join(root, "lib/seed-blog.ts")).href, import.meta.url)
const { seedCaseStudyHighlightGlobal } = await tsImport(
  pathToFileURL(path.join(root, "lib/seed-case-study-highlight.ts")).href,
  import.meta.url,
)

console.log("Seeding blog posts to production Postgres...")

const payload = await getPayload({ config })
await seedBlogIfEmpty(payload)

for (const location of ["homepage", "about", "services-page"]) {
  await seedCaseStudyHighlightGlobal(payload, location)
}

const posts = await payload.find({
  collection: "posts",
  where: {
    slug: {
      in: [
        "google-ads-budget-planner",
        "best-chiropractic-advertising-offers",
        "tuscola-pain-wellness-center-case-study",
      ],
    },
  },
  limit: 10,
  depth: 0,
})

console.log("\nSpecial posts on production:")
for (const post of posts.docs) {
  const postType = post.postType === "case-study" ? "case-study" : "article"
  console.log(`  - /blog/${post.slug} (${postType})`)
}

const totals = await Promise.all([
  payload.count({ collection: "posts" }),
  payload.count({ collection: "categories" }),
  payload.count({ collection: "tags" }),
])

console.log(
  `\nDone: ${totals[0].totalDocs} posts, ${totals[1].totalDocs} categories, ${totals[2].totalDocs} tags.`,
)
process.exit(0)
