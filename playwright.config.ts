import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 1,
  workers: 3,
  use: {
    baseURL: "https://www.hausaura.de",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
});
