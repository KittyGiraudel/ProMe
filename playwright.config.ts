import { defineConfig } from '@playwright/test'

// If you already have `next dev` running, set `E2E_PORT` to the port it listens on.
// Playwright will then reuse it when `url` is reachable (and only start a server when it's not).
const port = Number(process.env.E2E_PORT ?? 3001)
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  fullyParallel: false,
  workers: 1,

  // Keep all artifacts inside the repo (and ignored by git).
  outputDir: 'output/playwright/test-results',
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'output/playwright/html-report',
        open: 'never',
      },
    ],
  ],

  use: {
    baseURL,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],

  webServer: {
    // Start the Next.js dev server once for the whole test run.
    command: `NEXT_TELEMETRY_DISABLED=1 PORT=${port} npm run dev`,
    url: baseURL,
    // Reuse when already running; start only if `url` isn't reachable.
    reuseExistingServer: true,
  },
})

