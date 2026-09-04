import { test, expect } from "@playwright/test";

test.describe("Barrierefreiheit Page", () => {
  test("page loads and has correct heading", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await expect(page.locator("h1")).toContainText("Barrierefreiheitserklärung");
  });

  test("has breadcrumb navigation", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
    await expect(page.locator('nav[aria-label="Breadcrumb"]').getByText("Startseite")).toBeVisible();
    await expect(page.locator('nav[aria-label="Breadcrumb"]').getByText("Barrierefreiheit")).toBeVisible();
  });

  test("contains required sections", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await expect(page.getByText("Erklärung zur Barrierefreiheit")).toBeVisible();
    await expect(page.getByText("Aktueller Stand der Barrierefreiheit")).toBeVisible();
    await expect(page.getByText("Feedback und Kontaktdaten")).toBeVisible();
    await expect(page.getByText("Durchsetzung und Schlichtungsverfahren")).toBeVisible();
  });

  test("displays contact information", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await expect(page.locator("#main-content").getByText("barrierefreiheit@hausaura.de")).toBeVisible();
    await expect(page.locator("#main-content").getByText("+49 (0)30 555 789 01")).toBeVisible();
  });

  test("displays Stand date", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await expect(page.getByText("Stand: August 2026")).toBeVisible();
  });
});
