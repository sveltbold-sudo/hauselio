import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  retries: 1,
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  webServer: {
    command: "npm run dev",
    port: 3000,
    timeout: 180000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
