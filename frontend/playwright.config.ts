import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const frontendUrl = 'http://127.0.0.1:5174'
const backendUrl = 'http://127.0.0.1:8001'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: frontendUrl, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'php artisan serve --host=127.0.0.1 --port=8001',
      cwd: fileURLToPath(new URL('../backend', import.meta.url)),
      url: `${backendUrl}/api/health`,
      reuseExistingServer: !process.env.CI,
      env: {
        APP_URL: backendUrl,
        FRONTEND_URL: frontendUrl,
        SANCTUM_STATEFUL_DOMAINS: '127.0.0.1:5174',
      },
    },
    {
      command: 'npm run dev -- --host=127.0.0.1 --port=5174 --strictPort',
      url: frontendUrl,
      reuseExistingServer: !process.env.CI,
      env: { VITE_API_BASE_URL: `${backendUrl}/api/` },
    },
  ],
})
