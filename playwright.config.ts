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
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 30_000,
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
