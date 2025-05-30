//playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright_tests',
  // projects: [
  //   { name: 'Chromium', use: { browserName: 'chromium' } },
  //   { name: 'Firefox', use: { browserName: 'firefox' } },
  //   { name: 'WebKit', use: { browserName: 'webkit' } },
  // ],
  use: {
    //browserName: 'chromium', //or firefox or webkit!
    headless: true,
    screenshot: 'only-on-failure',
    baseURL: 'http://localhost:5173' //base URL for React vite projects
  },
});
