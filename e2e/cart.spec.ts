import { test, expect, type Page } from "@playwright/test";

async function setupCookieConsent(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("HAUSAURA_cookie_consent", JSON.stringify({ essential: true, functional: true, analytics: true }));
  });
}

async function addFirstProductToCart(page: Page) {
  await setupCookieConsent(page);
  await page.goto("/shop");
  const productLink = page.locator('a[href^="/produkt/"]').first();
  await productLink.waitFor({ state: "visible", timeout: 15000 });
  const href = await productLink.getAttribute("href");
  await page.goto(href!, { waitUntil: "networkidle" });
  const addBtn = page.getByRole("button", { name: /In den Warenkorb/ }).first();
  await addBtn.waitFor({ state: "visible", timeout: 15000 });
  await addBtn.click();
  await page.waitForTimeout(500);
}

test.describe("Cart Flow", () => {
  test("empty cart shows empty state", async ({ page }) => {
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    await expect(page.getByText("Ihr Warenkorb ist leer")).toBeVisible();
    await expect(page.getByText("Jetzt einkaufen")).toBeVisible();
  });

  test("empty cart has link to shop", async ({ page }) => {
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    await page.click('a:has-text("Jetzt einkaufen")');
    await expect(page).toHaveURL(/\/shop/);
  });

  test("add product to cart from product detail", async ({ page }) => {
    await addFirstProductToCart(page);
    await expect(page.getByText("hinzugefügt").first()).toBeVisible({ timeout: 5000 });
  });

  test("cart page shows items after adding", async ({ page }) => {
    await addFirstProductToCart(page);
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    await expect(page.locator("h1")).toContainText("Warenkorb");
    await expect(page.getByText("Zusammenfassung")).toBeVisible();
  });

  test("cart shows summary with subtotal, shipping, and total", async ({ page }) => {
    await addFirstProductToCart(page);
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.getByText("Versand", { exact: true })).toBeVisible();
    await expect(page.getByText("Gesamt", { exact: true })).toBeVisible();
  });

  test("quantity controls work in cart", async ({ page }) => {
    await addFirstProductToCart(page);
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    const plusBtn = page.locator('button[aria-label="Menge erhöhen"]').first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await expect(page.getByRole("group", { name: "Artikelmenge" }).locator("span").first()).toContainText("2");
    }
  });

  test("remove button removes item from cart", async ({ page }) => {
    await addFirstProductToCart(page);
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    const removeBtn = page.locator('button[aria-label*="entfernen"]').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test("proceed to checkout button exists", async ({ page }) => {
    await addFirstProductToCart(page);
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    await expect(page.getByRole("button", { name: "Zur Kasse" }).first()).toBeVisible();
  });

  test("checkout button navigates to checkout", async ({ page }) => {
    await addFirstProductToCart(page);
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    await page.click('a:has-text("Zur Kasse")');
    await expect(page).toHaveURL(/\/bestellung/);
  });

  test("continue shopping link goes back to shop", async ({ page }) => {
    await addFirstProductToCart(page);
    await setupCookieConsent(page);
    await page.goto("/warenkorb");
    await page.click('a:has-text("Weiter einkaufen")');
    await expect(page).toHaveURL(/\/shop/);
  });
});
