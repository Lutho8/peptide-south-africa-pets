import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:3000', headless: true },
  webServer: {
    command: 'VITE_ASSET_ORIGIN=http://127.0.0.1:3000 npm run dev -- --host 127.0.0.1 --base /',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
})
