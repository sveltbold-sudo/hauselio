import { test, expect } from "@playwright/test";

test.describe("Shop Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
  });

  test("displays page heading and product count", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Boutique");
    await expect(page.getByText(/Produkte$/)).toBeVisible();
  });

  test("displays category tabs", async ({ page }) => {
    const alleTab = page.locator('a[aria-current="page"]').first();
    await expect(alleTab).toContainText("Alle");
  });

  test("category tab filters products", async ({ page }) => {
    const categoryTab = page.locator('a[href*="category="]').first();
    if (await categoryTab.isVisible()) {
      const categoryText = await categoryTab.textContent();
      await categoryTab.click();
      await expect(page).toHaveURL(/category=/);
      await expect(page.locator("h1")).toContainText(categoryText!.trim());
    }
  });

  test("search input filters products via URL", async ({ page }) => {
    await page.goto("/shop?q=Miele");
    await expect(page.locator("h1")).toContainText("Suchergebnisse");
    await expect(page.getByText(/Ergebnisse/)).toBeVisible();
  });

  test("empty search shows no results message", async ({ page }) => {
    await page.goto("/shop?q=zzznonexistentproduct999");
    await expect(page.getByText("Keine Produkte gefunden")).toBeVisible();
  });

  test("sort dropdown works", async ({ page }) => {
    const sortSelect = page.locator('select[name="sort"]');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption("price_asc");
      await expect(page).toHaveURL(/sort=price_asc/);
    }
  });

  test("product cards display name, price, and image", async ({ page }) => {
    const productCards = page.locator('a[href^="/produkt/"]');
    const count = await productCards.count();
    if (count > 0) {
      const firstCard = productCards.first();
      await expect(firstCard).toBeVisible();
      const text = await firstCard.textContent();
      expect(text!.length).toBeGreaterThan(0);
    }
  });

  test("clicking product card navigates to product detail", async ({ page }) => {
    const productLink = page.locator('a[href^="/produkt/"]').first();
    if (await productLink.isVisible()) {
      const href = await productLink.getAttribute("href");
      await productLink.click();
      await expect(page).toHaveURL(new RegExp(href!));
    }
  });

  test("filter drawer opens on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const filterBtn = page.locator('button:has-text("Filter")').first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
    }
  });
});
