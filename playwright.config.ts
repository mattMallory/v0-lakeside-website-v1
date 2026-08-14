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
  // Headroom on CI runners, which have far fewer cores than a development
  // machine. This is not covering for a slow page: measured against the built
  // server, /services returns in 30-230ms and media in ~19ms even under ten
  // concurrent requests. The occasional 30s navigation timeout seen locally is
  // the browser being starved of CPU, not the server being slow, and a slower
  // runner has less CPU to go round.
  timeout: process.env.CI ? 60_000 : 30_000,
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
