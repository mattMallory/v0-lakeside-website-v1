import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.E2E_PORT ?? 3100)
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`

/**
 * Viewport regression suite.
 *
 * One Chromium project only. The suite varies viewport width rather than browser,
 * because the defects it guards against are layout-breakpoint defects — running
 * the same width across three engines would multiply cost without adding signal.
 * That keeps it inside a per-pull-request budget.
 */
export default defineConfig({
  testDir: "./e2e",

  // Refuses to measure a server that is not this build. Runs after webServer is
  // up and before any test, because reusing an already-running server is only
  // safe if something checks what is actually on the port — see
  // e2e/support/served-app-identity.ts.
  globalSetup: "./e2e/global-setup.ts",

  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // The HTML reporter only runs in CI, where the workflow uploads
  // playwright-report/ as an artifact on failure so a red run is diagnosable
  // without reproducing it locally.
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"]],
  // Headroom for CPU starvation, which is what a navigation timeout here
  // actually means. This is not covering for a slow page: measured against the
  // built server, /services returns in 30-230ms and media in ~19ms even under
  // ten concurrent requests, and the whole /services spec passes 42/42 when run
  // alone. A timeout is the browser being starved, not the server being slow.
  //
  // Originally 30s locally on the assumption that a development machine has
  // cores to spare. It does not when it is also running builds, or a second
  // project — which is the normal condition here. Local runs were failing 4-9
  // navigation timeouts on /services, the heaviest route, with the failing set
  // varying between runs; the same commits passed on CI at 60s. A suite that is
  // red every run stops being read, which is a worse failure than a slow one.
  timeout: 60_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    // E2E_FIXTURES=1 is required at build time (it switches on the `e2e.tsx`
    // page extension) as well as at serve time, so it wraps both commands.
    command: "pnpm build && pnpm start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      E2E_FIXTURES: "1",
      PORT: String(PORT),
    },
  },
})
