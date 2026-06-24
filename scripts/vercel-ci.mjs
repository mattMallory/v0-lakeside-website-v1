import { execSync } from "node:child_process"

const env = { ...process.env }

// Neon/Vercel: pooled POSTGRES_URL can fail during DDL migrations.
if (env.POSTGRES_URL_NON_POOLING) {
  env.POSTGRES_URL = env.POSTGRES_URL_NON_POOLING
}

const nodeOptions = ["--no-deprecation", ...(env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])]
env.NODE_OPTIONS = [...new Set(nodeOptions)].join(" ")

console.log("[ci] Running payload migrate...")
execSync("payload migrate", { stdio: "inherit", env })

console.log("[ci] Running next build...")
execSync("next build", { stdio: "inherit", env })
