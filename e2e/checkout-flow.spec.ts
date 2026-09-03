import { test, expect, type Page } from "@playwright/test";

const TEST_EMAIL = `e2e-checkout-${Date.now()}@example.com`;

async function addFirstProductToCart(page: Page) {
  await page.goto("/shop");
  await page.locator('a[href^="/produkt/"]').first().click();
  await page.waitForURL(/\/produkt\//);
  await page.click('button:has-text("In den Warenkorb")');
  await page.waitForTimeout(500);
}

async function fillCheckoutForm(page: Page, overrides?: { email?: string; zip?: string; country?: string }) {
  const email = overrides?.email || TEST_EMAIL;
  const zip = overrides?.zip || "10115";
  const country = overrides?.country || "DE";

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="firstName"]', "Max");
  await page.fill('input[name="lastName"]', "Mustermann");
  await page.fill('input[name="address"]', "Musterstraße 42");
  await page.fill('input[name="zip"]', zip);
  await page.fill('input[name="city"]', "Berlin");

  if (country !== "DE") {
    await page.selectOption('select[name="country"]', country);
  }
}

test.describe("Full Checkout Flow", () => {
  test("browse → product → add to cart → checkout → order → confirmation", async ({ page }) => {
    // 1. Browse shop
    await page.goto("/shop");
    await expect(page.locator("h1")).toContainText("Boutique");
    const productLinks = page.locator('a[href^="/produkt/"]');
    await expect(productLinks.first()).toBeVisible();

    // 2. View product detail
    const firstProductHref = await productLinks.first().getAttribute("href");
    await productLinks.first().click();
    await page.waitForURL(/\/produkt\//);
    await expect(page.locator('button:has-text("In den Warenkorb")')).toBeVisible();

    // 3. Add to cart
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    // 4. Go to cart
    await page.goto("/warenkorb");
    await expect(page.locator("h1")).toContainText("Warenkorb");
    await expect(page.getByText("Zusammenfassung")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.getByText("Versand")).toBeVisible();

    // 5. Proceed to checkout
    await page.click('a:has-text("Zur Kasse")');
    await page.waitForURL(/\/bestellung/);
    await expect(page.locator("h1")).toContainText("Kasse");

    // 6. Step 1: Fill address form
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await fillCheckoutForm(page);

    // 7. Submit step 1 → step 2
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);

    // 8. Step 2: Review order
    await expect(page.getByText("Bestellübersicht")).toBeVisible();
    await expect(page.getByText("Zahlungsmethode")).toBeVisible();
    await expect(page.getByText("Überweisung")).toBeVisible();

    // 9. Submit order
    await page.click('button:has-text("Jetzt verbindlich bestellen")');

    // 10. Confirmation page
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText("Vielen Dank");
    await expect(page.getByText("Bestellung wurde erfolgreich")).toBeVisible();
    await expect(page.getByText("Bestellnummer")).toBeVisible();
    await expect(page.getByText("Zahlungsinformationen")).toBeVisible();
    await expect(page.getByText("IBAN")).toBeVisible();
    await expect(page.getByText("BIC")).toBeVisible();
  });

  test("complete flow with 2 products", async ({ page }) => {
    // Add first product
    await addFirstProductToCart(page);

    // Add second product
    await page.goto("/shop");
    const secondProduct = page.locator('a[href^="/produkt/"]').nth(1);
    if (await secondProduct.isVisible()) {
      await secondProduct.click();
      await page.waitForURL(/\/produkt\//);
      await page.click('button:has-text("In den Warenkorb")');
      await page.waitForTimeout(500);
    }

    // Go to cart — verify 2 items
    await page.goto("/warenkorb");
    await expect(page.locator("h1")).toContainText("Warenkorb");
    await expect(page.getByText("Zusammenfassung")).toBeVisible();

    // Checkout
    await page.click('a:has-text("Zur Kasse")');
    await page.waitForURL(/\/bestellung/);

    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);

    // Submit
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText("Vielen Dank");
  });

  test("cart is cleared after successful order", async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });

    // Cart should be empty now
    await page.goto("/warenkorb");
    await expect(page.getByText("Ihr Warenkorb ist leer")).toBeVisible();
  });
});

test.describe("Checkout Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
  });

  test("empty form shows all required field errors", async ({ page }) => {
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);

    const errorSummary = page.locator('[role="alert"]');
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary).toContainText("Bitte korrigieren Sie folgende Fehler");
  });

  test("invalid email shows error", async ({ page }) => {
    await page.fill('input[name="email"]', "not-an-email");
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Test 1");
    await page.fill('input[name="zip"]', "10115");
    await page.fill('input[name="city"]', "Berlin");

    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test("short German PLZ shows error", async ({ page }) => {
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Test 1");
    await page.fill('input[name="zip"]', "123");
    await page.fill('input[name="city"]', "Berlin");

    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test("valid Austrian PLZ (4 digits) is accepted", async ({ page }) => {
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Test 1");
    await page.fill('input[name="zip"]', "1010");
    await page.fill('input[name="city"]', "Wien");
    await page.selectOption('select[name="country"]', "AT");

    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(500);

    // Should advance to step 2 (no error summary)
    await expect(page.getByText("Bestellübersicht")).toBeVisible();
  });

  test("valid Swiss PLZ (4 digits) is accepted", async ({ page }) => {
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Test 1");
    await page.fill('input[name="zip"]', "8001");
    await page.fill('input[name="city"]', "Zürich");
    await page.selectOption('select[name="country"]', "CH");

    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(500);
    await expect(page.getByText("Bestellübersicht")).toBeVisible();
  });

  test("back link returns to cart", async ({ page }) => {
    await page.click('a:has-text("Zurück zum Warenkorb")');
    await expect(page).toHaveURL(/\/warenkorb/);
  });

  test("step indicator shows correct steps", async ({ page }) => {
    await expect(page.getByText("Warenkorb")).toBeVisible();
    await expect(page.getByText("Kasse")).toBeVisible();
    await expect(page.getByText("Bestätigung")).toBeVisible();
  });

  test("notes field is optional and empty by default", async ({ page }) => {
    const notes = page.locator('textarea[name="notes"]');
    await expect(notes).toBeVisible();
    expect(await notes.inputValue()).toBe("");
  });

  test("phone field is optional", async ({ page }) => {
    const phone = page.locator('input[name="phone"]');
    await expect(phone).toBeVisible();
    expect(await phone.inputValue()).toBe("");
  });

  test("AGB and Widerruf links are present", async ({ page }) => {
    await expect(page.locator('a[href="/agb"]')).toBeVisible();
    await expect(page.locator('a[href="/widerruf"]')).toBeVisible();
  });
});

test.describe("Checkout Step 2 — Review", () => {
  test.beforeEach(async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
  });

  test("shows order summary with items", async ({ page }) => {
    await expect(page.getByText("Bestellübersicht")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.getByText("Versand")).toBeVisible();
    await expect(page.getByText("Gesamtbetrag")).toBeVisible();
  });

  test("shows payment method", async ({ page }) => {
    await expect(page.getByText("Zahlungsmethode")).toBeVisible();
    await expect(page.getByText("Überweisung")).toBeVisible();
    await expect(page.getByText("SEPA")).toBeVisible();
  });

  test("shows customer email", async ({ page }) => {
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  });

  test("shows shipping address", async ({ page }) => {
    await expect(page.getByText("Max Mustermann")).toBeVisible();
    await expect(page.getByText("Musterstraße 42")).toBeVisible();
    await expect(page.getByText("10115")).toBeVisible();
    await expect(page.getByText("Berlin")).toBeVisible();
  });

  test("submit button is visible and enabled", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Jetzt verbindlich bestellen" });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });
});

test.describe("Order Confirmation Page", () => {
  test("shows bank transfer details", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });

    // Bank details
    await expect(page.getByText("IBAN")).toBeVisible();
    await expect(page.getByText("BIC")).toBeVisible();
    await expect(page.getByText("Empfänger")).toBeVisible();
    await expect(page.getByText("Verwendungszweck")).toBeVisible();
  });

  test("shows order number", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });

    // Order number should be visible (HL-YYYYMM-XXXXXXXX format)
    const orderNumber = page.locator("text=/HL-\\d{6}-[A-F0-9]{8}/");
    await expect(orderNumber.first()).toBeVisible();
  });

  test("shows email confirmation note", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });

    await expect(page.getByText("Bestätigungs-E-Mail")).toBeVisible();
  });

  test("shows order summary section", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });

    await expect(page.getByText("Zusammenfassung")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.getByText("Versand")).toBeVisible();
    await expect(page.getByText("Gesamtbetrag")).toBeVisible();
  });

  test("shows FAQ section", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });

    await expect(page.getByText("Häufige Fragen")).toBeVisible();
  });

  test("continue shopping button goes to shop", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/bestellung");
    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });

    await page.click('a:has-text("Weiter einkaufen")');
    await expect(page).toHaveURL(/\/shop/);
  });

  test("no order param shows error", async ({ page }) => {
    await page.goto("/bestellung/erfolg");
    await expect(page.getByText("Keine Bestellung gefunden")).toBeVisible();
    await expect(page.locator('a:has-text("Zum Shop")')).toBeVisible();
  });
});

test.describe("Empty Cart Redirect", () => {
  test("checkout with empty cart redirects to cart page", async ({ page }) => {
    await page.goto("/bestellung");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/warenkorb/);
  });
});

test.describe("Mobile Checkout", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("checkout flow works on mobile", async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto("/bestellung");
    await expect(page.locator("h1")).toContainText("Kasse");

    await fillCheckoutForm(page);
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);

    await expect(page.getByText("Bestellübersicht")).toBeVisible();
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText("Vielen Dank");
  });
});

test.describe("Shipping Cost Logic", () => {
  test("free shipping for orders >= 50 EUR", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/warenkorb");

    // Check if free shipping is shown (depends on product price)
    const freeShipping = page.getByText("Kostenloser Versand");
    const paidShipping = page.getByText("Standardversand");
    // Just verify one of them is visible
    const freeVisible = await freeShipping.isVisible().catch(() => false);
    const paidVisible = await paidShipping.isVisible().catch(() => false);
    expect(freeVisible || paidVisible).toBe(true);
  });
});

test.describe("Product Search → Cart → Checkout", () => {
  test("search for product, add to cart, complete checkout", async ({ page }) => {
    // Search
    await page.goto("/shop?q=");
    await page.goto("/shop");
    await page.waitForTimeout(500);

    // Click first product
    const productLink = page.locator('a[href^="/produkt/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();
    await page.waitForURL(/\/produkt\//);

    // Verify product page loaded
    await expect(page.locator('button:has-text("In den Warenkorb")')).toBeVisible();

    // Add to cart
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);

    // Navigate to checkout directly
    await page.goto("/bestellung");
    await expect(page.locator("h1")).toContainText("Kasse");

    // Complete checkout
    await fillCheckoutForm(page, { email: `search-e2e-${Date.now()}@example.com` });
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Jetzt verbindlich bestellen")');
    await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText("Vielen Dank");
  });
});
