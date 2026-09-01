import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title and meta description", async ({ page }) => {
    await expect(page).toHaveTitle(/HAUSAURA/);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(20);
  });

  test("displays hero section", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("displays categories section with heading", async ({ page }) => {
    await expect(page.getByText("Entdecken Sie unsere Kategorien")).toBeVisible();
  });

  test("displays featured products section", async ({ page }) => {
    await expect(page.getByText("Beliebte Produkte")).toBeVisible();
  });

  test("category links navigate to correct pages", async ({ page }) => {
    const categoryLinks = page.locator('a[href^="/kategorie/"]');
    const count = await categoryLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstLink = categoryLinks.first();
    const href = await firstLink.getAttribute("href");
    await firstLink.click();
    await expect(page).toHaveURL(new RegExp(href!));
  });

  test("shop link navigates to shop page", async ({ page }) => {
    await page.click('a[href="/shop"]');
    await expect(page).toHaveURL(/\/shop/);
  });

  test("footer contains legal links", async ({ page }) => {
    await expect(page.locator('a[href="/impressum"]')).toBeVisible();
    await expect(page.locator('a[href="/datenschutz"]')).toBeVisible();
    await expect(page.locator('a[href="/agb"]')).toBeVisible();
    await expect(page.locator('a[href="/widerruf"]')).toBeVisible();
  });

  test("footer contains contact link", async ({ page }) => {
    await expect(page.locator('a[href="/kontakt"]')).toBeVisible();
  });

  test("has openGraph meta tags", async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toBeTruthy();
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");
    expect(ogDesc).toBeTruthy();
  });

  test("has structured data (JSON-LD)", async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("scroll-to-top button is visible after scrolling", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const scrollBtn = page.locator('button[aria-label="Nach oben scrollen"]');
    await expect(scrollBtn).toBeVisible({ timeout: 3000 });
  });
});
