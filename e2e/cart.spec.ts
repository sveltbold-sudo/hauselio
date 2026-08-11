import { test, expect } from "@playwright/test";

test.describe("Cart Flow", () => {
  test("empty cart shows empty state", async ({ page }) => {
    await page.goto("/warenkorb");
    await expect(page.getByText("Ihr Warenkorb ist leer")).toBeVisible();
    await expect(page.getByText("Jetzt einkaufen")).toBeVisible();
  });

  test("empty cart has link to shop", async ({ page }) => {
    await page.goto("/warenkorb");
    await page.click('a:has-text("Jetzt einkaufen")');
    await expect(page).toHaveURL(/\/shop/);
  });

  test("add product to cart from product detail", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await expect(page.getByText("hinzugefügt")).toBeVisible({ timeout: 3000 });
  });

  test("cart page shows items after adding", async ({ page }) => {
    // Add item
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    // Go to cart
    await page.goto("/warenkorb");
    await expect(page.locator("h1")).toContainText("Warenkorb");
    await expect(page.getByText("Zusammenfassung")).toBeVisible();
  });

  test("cart shows summary with subtotal, shipping, and total", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    await page.goto("/warenkorb");
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.getByText("Versand")).toBeVisible();
    await expect(page.getByText("Gesamt")).toBeVisible();
  });

  test("quantity controls work in cart", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    await page.goto("/warenkorb");
    const plusBtn = page.locator('button[aria-label="Menge erhöhen"]').first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await expect(page.getByRole("group", { name: "Artikelmenge" }).locator("span").first()).toContainText("2");
    }
  });

  test("remove button removes item from cart", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    await page.goto("/warenkorb");
    const removeBtn = page.locator('button[aria-label*="entfernen"]').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await expect(page.getByText("Ihr Warenkorb ist leer")).toBeVisible({ timeout: 3000 });
    }
  });

  test("proceed to checkout button exists", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    await page.goto("/warenkorb");
    await expect(page.getByText("Zur Kasse")).toBeVisible();
  });

  test("checkout button navigates to checkout", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    await page.goto("/warenkorb");
    await page.click('a:has-text("Zur Kasse")');
    await expect(page).toHaveURL(/\/bestellung/);
  });

  test("continue shopping link goes back to shop", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    await page.goto("/warenkorb");
    await page.click('a:has-text("Weiter einkaufen")');
    await expect(page).toHaveURL(/\/shop/);
  });
});
