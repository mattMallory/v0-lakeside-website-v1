import type { FullConfig } from "@playwright/test"

import { assertServedAppIsThisBuild } from "./support/served-app-identity"

/**
 * Runs once, after Playwright's webServer is up and before any test.
 *
 * Its only job is to refuse to measure the wrong application. Every assertion in
 * this suite is a measurement, and a measurement of the wrong server is not a
 * weaker result — it is a confident wrong one. See served-app-identity.ts.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL =
    config.projects[0]?.use?.baseURL ??
    process.env.E2E_BASE_URL ??
    `http://127.0.0.1:${process.env.E2E_PORT ?? 3100}`

  await assertServedAppIsThisBuild(baseURL)

  console.log(`[e2e] verified the server at ${baseURL} is this build`)
}
