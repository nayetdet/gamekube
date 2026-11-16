import { defineConfig } from '@playwright/test';
import { testEnvironment } from './tests/fixtures/environment';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: testEnvironment.APP_URL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'bun tests/fixtures/backend.ts',
      url: `${testEnvironment.BACKEND_API_URL}/__test/health`,
      reuseExistingServer: false,
    },
    {
      command: 'bunx next start --port 3100',
      url: `${testEnvironment.APP_URL}/login`,
      env: testEnvironment,
      reuseExistingServer: false,
    },
  ],
});
