import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("header contains site logo/name", async ({ page }) => {
    const logo = page.locator('a[href="/"]').filter({ hasText: "HAUSELIO" });
    await expect(logo.first()).toBeVisible();
  });

  test("header contains shop link", async ({ page }) => {
    const shopLink = page.locator('a[href="/shop"]').first();
    await expect(shopLink).toBeVisible();
  });

  test("header contains cart icon/link", async ({ page }) => {
    const cartLink = page.locator('a[href="/warenkorb"]').first();
    await expect(cartLink).toBeVisible();
  });

  test("navigation to impressum works", async ({ page }) => {
    await page.click('a[href="/impressum"]');
    await expect(page).toHaveURL(/\/impressum/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("navigation to datenschutz works", async ({ page }) => {
    await page.click('a[href="/datenschutz"]');
    await expect(page).toHaveURL(/\/datenschutz/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("navigation to agb works", async ({ page }) => {
    await page.click('a[href="/agb"]');
    await expect(page).toHaveURL(/\/agb/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("navigation to kontakt works", async ({ page }) => {
    await page.click('a[href="/kontakt"]');
    await expect(page).toHaveURL(/\/kontakt/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const menuBtn = page.locator('button[aria-label="Menü öffnen"], button:has-text("Menü")').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      const closeBtn = page.locator('button[aria-label="Menü schließen"]').first();
      await expect(closeBtn).toBeVisible({ timeout: 3000 });
      await closeBtn.click();
    }
  });
});
