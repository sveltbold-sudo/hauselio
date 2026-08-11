import { test, expect } from "@playwright/test";

const categorySlugs = ["kueche", "kaffee", "reinigung", "klima", "smart-home", "haushaltsgeraete"];

for (const slug of categorySlugs) {
  test.describe(`Category: ${slug}`, () => {
    test("loads and displays heading", async ({ page }) => {
      await page.goto(`/kategorie/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("displays product grid or empty state", async ({ page }) => {
      await page.goto(`/kategorie/${slug}`);
      const products = page.locator('a[href^="/produkt/"]');
      const emptyState = page.getByText("Keine Produkte");
      const count = await products.count();
      const emptyCount = await emptyState.count();
      expect(count + emptyCount).toBeGreaterThan(0);
    });

    test("has openGraph meta tags", async ({ page }) => {
      await page.goto(`/kategorie/${slug}`);
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      expect(ogTitle).toBeTruthy();
    });

    test("navigation to shop works", async ({ page }) => {
      await page.goto(`/kategorie/${slug}`);
      const shopLink = page.locator('a[href="/shop"]').first();
      if (await shopLink.isVisible()) {
        await shopLink.click();
        await expect(page).toHaveURL(/\/shop/);
      }
    });
  });
}
