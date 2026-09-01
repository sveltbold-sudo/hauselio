import { test, expect } from "@playwright/test";

test.describe("Barrierefreiheit Page", () => {
  test("page loads and has correct heading", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await expect(page.locator("h1")).toContainText("Barrierefreiheitserklärung");
  });

  test("has breadcrumb navigation", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await expect(page.getByText("Startseite")).toBeVisible();
    await expect(page.getByText("Barrierefreiheit")).toBeVisible();
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
    await expect(page.getByText("barrierefreiheit@hauselio.de")).toBeVisible();
    await expect(page.getByText("+49 (0)30 555 789 01")).toBeVisible();
  });

  test("displays Stand date", async ({ page }) => {
    await page.goto("/barrierefreiheit");
    await expect(page.getByText("Stand: August 2026")).toBeVisible();
  });
});
