import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

/**
 * Proves the server the suite is about to measure is this repository, at this build.
 *
 * Why this exists: `playwright.config.ts` reuses an already-running server outside
 * CI, because rebuilding for every local run is slow. That reuse is only safe if
 * something checks *what* is running on the port. Nothing did, and during a token
 * migration a different application — WildRoot Health, next-server v16.2.10 —
 * held port 3100. The suite measured it and reported a confident "0 elements
 * changed". That is the answer the migration was hoping for, which is exactly why
 * it went unnoticed; it was caught only because the markup contained a header
 * that exists nowhere in this repository.
 *
 * The everyday case is worse than the dramatic one: a *stale* server, running this
 * repository at an older commit, is far more likely and produces the same
 * confident, wrong answer.
 *
 * The signal is `rootMainFiles` from `.next/build-manifest.json` — content-hashed
 * chunks that every app-router page loads. A different application does not have
 * them. Neither does an older build of this one, because the hash covers content.
 */

export type BuildIdentity = {
  buildId: string
  /** Root chunk paths, relative to `.next/` — e.g. `static/chunks/main-app-<hash>.js`. */
  rootMainFiles: string[]
  /** The `main-app-<hash>.js` entry, the most distinctive of them. */
  mainAppChunk: string
}

export class ServedAppMismatchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ServedAppMismatchError"
  }
}

const NEXT_DIR = resolve(process.cwd(), ".next")

/** Reads this checkout's build fingerprint. Throws if the app has not been built. */
export function readBuildIdentity(nextDir: string = NEXT_DIR): BuildIdentity {
  const manifestPath = resolve(nextDir, "build-manifest.json")
  const buildIdPath = resolve(nextDir, "BUILD_ID")

  if (!existsSync(manifestPath) || !existsSync(buildIdPath)) {
    throw new ServedAppMismatchError(
      `Cannot verify the server: this checkout has no build at ${nextDir}.\n` +
        `Run \`pnpm build\` first, or let Playwright's webServer build it.`,
    )
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    rootMainFiles?: string[]
  }
  const rootMainFiles = manifest.rootMainFiles ?? []
  const mainAppChunk = rootMainFiles.find((file) => file.includes("main-app-")) ?? ""

  if (!mainAppChunk) {
    throw new ServedAppMismatchError(
      `Cannot verify the server: ${manifestPath} has no main-app entry in rootMainFiles.\n` +
        `The build layout may have changed; update e2e/support/served-app-identity.ts.`,
    )
  }

  return {
    buildId: readFileSync(buildIdPath, "utf8").trim(),
    rootMainFiles,
    mainAppChunk,
  }
}

async function describeServedApp(baseURL: string): Promise<string> {
  try {
    const response = await fetch(baseURL, { redirect: "follow" })
    const html = await response.text()
    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim()
    const poweredBy = response.headers.get("x-powered-by")
    const parts = [
      `HTTP ${response.status}`,
      title ? `title "${title}"` : null,
      poweredBy ? `x-powered-by ${poweredBy}` : null,
    ].filter(Boolean)
    return parts.join(", ")
  } catch (error) {
    return `unreachable (${String(error)})`
  }
}

/**
 * Throws unless the server at `baseURL` is serving this checkout's build.
 *
 * Two checks, because they fail differently: the chunk request catches a server
 * built from different source, and the HTML reference catches a server that can
 * serve this build's static assets but renders pages from somewhere else.
 */
export async function assertServedAppIsThisBuild(
  baseURL: string,
  identity: BuildIdentity = readBuildIdentity(),
): Promise<void> {
  const chunkUrl = new URL(`/_next/${identity.mainAppChunk}`, baseURL).toString()

  let chunkStatus: number
  try {
    const response = await fetch(chunkUrl, { redirect: "manual" })
    chunkStatus = response.status
  } catch (error) {
    throw new ServedAppMismatchError(
      `Cannot reach the server at ${baseURL}.\n` +
        `Expected this repository's build (id ${identity.buildId}).\n` +
        `Underlying error: ${String(error)}`,
    )
  }

  if (chunkStatus !== 200) {
    throw new ServedAppMismatchError(
      `Served application is not this repository.\n\n` +
        `  Port:     ${baseURL}\n` +
        `  Expected: this build's root chunk /_next/${identity.mainAppChunk} (build id ${identity.buildId})\n` +
        `  Got:      HTTP ${chunkStatus} for that chunk\n` +
        `  Serving:  ${await describeServedApp(baseURL)}\n\n` +
        `Something else is on this port, or the server is a stale build of this\n` +
        `repository. Either way the measurements would be meaningless. Stop that\n` +
        `server, or run with a different E2E_PORT.`,
    )
  }

  const response = await fetch(baseURL, { redirect: "follow" })
  const html = await response.text()

  if (!html.includes(identity.mainAppChunk)) {
    throw new ServedAppMismatchError(
      `Served application serves this build's assets but renders different pages.\n\n` +
        `  Port:     ${baseURL}\n` +
        `  Expected: the homepage to reference /_next/${identity.mainAppChunk}\n` +
        `  Serving:  ${await describeServedApp(baseURL)}\n\n` +
        `This usually means a proxy, or a server started from a different checkout\n` +
        `that shares a static directory.`,
    )
  }
}
