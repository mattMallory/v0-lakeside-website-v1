import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const configUrl = pathToFileURL(path.join(root, "payload.config.sqlite.ts")).href

const { getPayload } = await import("payload")
const { default: config } = await tsImport(configUrl, import.meta.url)
const { seedBlogIfEmpty } = await tsImport(pathToFileURL(path.join(root, "lib/seed-blog.ts")).href, import.meta.url)

const payload = await getPayload({ config })
await seedBlogIfEmpty(payload)

const posts = await payload.count({ collection: "posts" })
const categories = await payload.count({ collection: "categories" })
const tags = await payload.count({ collection: "tags" })

console.log(`Seeded blog content: ${posts.totalDocs} posts, ${categories.totalDocs} categories, ${tags.totalDocs} tags`)
process.exit(0)
