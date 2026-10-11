import { defineConfig, devices } from '@playwright/test'

const frontendUrl = 'http://127.0.0.1:5174'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: frontendUrl, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --host=127.0.0.1 --port=5174 --strictPort',
    url: frontendUrl,
    reuseExistingServer: !process.env.CI,
  },
})
