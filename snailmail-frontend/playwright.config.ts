//playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    browserName: 'chromium', //or firefox or webkit!
    headless: true,
    screenshot: 'only-on-failure',
    baseURL: 'http://localhost:5173', //only for vite
  },
});
