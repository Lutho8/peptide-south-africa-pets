import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:3000', headless: true },
  webServer: {
    command: process.env.ENQUIRY_PRERENDER
      ? 'npm run prebuild && npx tsc -b && npx vite build --base / && node scripts/prerender.mjs && node scripts/serve-prerender-test.mjs'
      : 'npm run dev -- --host 127.0.0.1 --base /',
    env: { VITE_ASSET_ORIGIN: 'http://127.0.0.1:3000' },
    timeout: 120_000,
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI && !process.env.ENQUIRY_PRERENDER,
  },
})
