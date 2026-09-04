import { defineConfig } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  retries: 1,
  workers: 1,
  use: {
    baseURL: process.env.BASE_URL || "https://www.hausaura.de",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
    // storageState: path.join(__dirname, "e2e/storage-state.json"),
    extraHTTPHeaders: {
      "Accept-Language": "de-DE,de;q=0.9",
    },
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
