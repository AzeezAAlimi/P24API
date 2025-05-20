import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './p24/tests/',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://doktor24.app.staging.platform24.se',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'API',
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
});
