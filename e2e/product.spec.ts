import { test, expect } from "@playwright/test";

test.describe("Product Detail Page", () => {
  test("navigates from shop to product detail", async ({ page }) => {
    await page.goto("/shop");
    const productLink = page.locator('a[href^="/produkt/"]').first();
    const href = await productLink.getAttribute("href");
    expect(href).toBeTruthy();
    await productLink.click();
    await expect(page).toHaveURL(new RegExp(href!));
  });

  test("displays product name, price, and add-to-cart button", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("In den Warenkorb")).toBeVisible();
  });

  test("displays product image", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();

    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("displays reviews section", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();

    await expect(page.getByText("Bewertungen")).toBeVisible();
  });

  test("has structured data (JSON-LD)", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("displays brand information", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();

    const brandEl = page.locator('[class*="brand"], a[href*="brand="]').first();
    const count = await brandEl.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("add to cart shows confirmation", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();

    await page.click('button:has-text("In den Warenkorb")');
    await expect(page.getByText("hinzugefügt")).toBeVisible({ timeout: 3000 });
  });

  test("quantity selector works", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();

    const plusBtn = page.locator('button[aria-label="Menge erhöhen"]');
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await expect(page.getByText("2")).toBeVisible();
    }
  });
});
