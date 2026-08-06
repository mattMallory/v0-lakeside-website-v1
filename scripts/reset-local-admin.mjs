import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const configUrl = pathToFileURL(path.join(root, "payload.config.sqlite.ts")).href
const email = process.env.LOCAL_ADMIN_EMAIL || "matt@madebylakeside.com"
const password = process.env.LOCAL_ADMIN_PASSWORD || "LakesideLocal1!"

const { getPayload } = await import("payload")
const { default: config } = await tsImport(configUrl, import.meta.url)

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
})

if (existing.docs.length === 0) {
  await payload.create({
    collection: "users",
    data: { email, password },
  })
  console.log(`Created local admin user: ${email}`)
} else {
  await payload.update({
    collection: "users",
    id: existing.docs[0].id,
    data: { password },
  })
  console.log(`Reset password for local admin user: ${email}`)
}

console.log(`\nLogin at http://localhost:3000/admin`)
console.log(`Email:    ${email}`)
console.log(`Password: ${password}`)
console.log("\nOverride with LOCAL_ADMIN_EMAIL / LOCAL_ADMIN_PASSWORD in .env if needed.")

process.exit(0)
