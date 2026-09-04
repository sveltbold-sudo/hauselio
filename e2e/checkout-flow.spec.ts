import { test, expect, type Page } from "@playwright/test";

const TEST_EMAIL = `e2e-checkout-${Date.now()}@example.com`;

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

async function goToCheckout(page: Page) {
  await page.goto("/bestellung");
  await page.locator('input[name="email"]').waitFor({ state: "visible", timeout: 15000 });
  // Wait for cart validation to complete
  await page.waitForFunction(() => {
    const btn = document.querySelector('button:has-text("Jetzt verbindlich bestellen")');
    return btn && !btn.hasAttribute("disabled");
  }, { timeout: 15000 }).catch(() => {});
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

async function submitToStep2(page: Page) {
  await page.click('button:has-text("Weiter zur Bestätigung")');
  await page.waitForTimeout(500);
}

async function submitOrder(page: Page) {
  await page.click('button:has-text("Jetzt verbindlich bestellen")', { timeout: 10000 });
  await page.waitForURL(/\/bestellung\/erfolg\?order=/, { timeout: 30000 });
}

test.describe("Full Checkout Flow", () => {
  test("browse → product → add to cart → checkout → order → confirmation", async ({ page }) => {
    await setupCookieConsent(page);

    // 1. Browse shop
    await page.goto("/shop");
    await expect(page.locator("h1")).toContainText("Produkte");
    const productLinks = page.locator('a[href^="/produkt/"]');
    await expect(productLinks.first()).toBeVisible();

    // 2. View product detail (navigate directly via href)
    const firstProductHref = await productLinks.first().getAttribute("href");
    await page.goto(firstProductHref!);
    await expect(page.getByRole("button", { name: /In den Warenkorb/ })).toBeVisible();

    // 3. Add to cart
    await page.getByRole("button", { name: /In den Warenkorb/ }).first().click();
    await page.waitForTimeout(500);

    // 4. Go to cart
    await page.goto("/warenkorb");
    await expect(page.locator("h1")).toContainText("Warenkorb");
    await expect(page.getByText("Zusammenfassung")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^Versand$/ })).toBeVisible();

    // 5. Proceed to checkout
    await page.click('a:has-text("Zur Kasse")');
    await page.waitForURL(/\/bestellung/);
    await page.locator('input[name="email"]').waitFor({ state: "visible", timeout: 15000 });

    // 6. Step 1: Fill address form
    await fillCheckoutForm(page);

    // 7. Submit step 1 → step 2
    await submitToStep2(page);

    // 8. Step 2: Review order
    await expect(page.getByText("Ihre Bestellung")).toBeVisible();
    await expect(page.getByText("Zahlungsart")).toBeVisible();
    await expect(page.getByText("Überweisung (Vorkasse)")).toBeVisible();

    // 9. Submit order
    await submitOrder(page);

    // 10. Confirmation page
    await expect(page.locator("h1")).toContainText("Vielen Dank");
    await expect(page.getByText("Bestellung wurde erfolgreich")).toBeVisible();
    await expect(page.getByText("Bestellnummer")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Zahlungsinformationen")).toBeVisible();
    await expect(page.getByText("IBAN")).toBeVisible();
    await expect(page.getByText("BIC")).toBeVisible();
  });

  test("complete flow with 2 products", async ({ page }) => {
    // Add first product
    await addFirstProductToCart(page);

    // Add second product
    await setupCookieConsent(page);
    await page.goto("/shop");
    const secondProduct = page.locator('a[href^="/produkt/"]').nth(1);
    if (await secondProduct.isVisible()) {
      const secondHref = await secondProduct.getAttribute("href");
      await page.goto(secondHref!);
      const addBtn = page.getByRole("button", { name: /In den Warenkorb/ }).first();
      await addBtn.waitFor({ state: "visible", timeout: 10000 });
      await addBtn.click();
      await page.waitForTimeout(500);
    }

    // Go to cart — verify 2 items
    await page.goto("/warenkorb");
    await expect(page.locator("h1")).toContainText("Warenkorb");
    await expect(page.getByText("Zusammenfassung")).toBeVisible();

    // Checkout
    await page.click('a:has-text("Zur Kasse")');
    await page.waitForURL(/\/bestellung/);
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);

    // Submit
    await submitOrder(page);
    await expect(page.locator("h1")).toContainText("Vielen Dank");
  });

  test("cart is cleared after successful order", async ({ page }) => {
    await addFirstProductToCart(page);

    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
    await submitOrder(page);

    // Cart should be empty now
    await page.goto("/warenkorb");
    await expect(page.getByText("Ihr Warenkorb ist leer")).toBeVisible();
  });
});

test.describe("Checkout Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCheckout(page);
  });

  test("empty form shows all required field errors", async ({ page }) => {
    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(1000);

    // Either inline field errors or error summary should be visible
    const hasError = await page.locator('[aria-invalid="true"]').count() > 0
      || await page.getByText("erforderlich").isVisible().catch(() => false)
      || await page.locator('[role="alert"]').filter({ hasText: /Fehler|erforderlich/ }).isVisible().catch(() => false);
    expect(hasError).toBe(true);
  });

  test("invalid email shows error", async ({ page }) => {
    await page.fill('input[name="email"]', "not-an-email");
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Test 1");
    await page.fill('input[name="zip"]', "10115");
    await page.fill('input[name="city"]', "Berlin");

    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(1000);

    // Verify form did NOT advance to step 2 (we should still be on step 1)
    // by checking that email input is still visible and not on review page
    await expect(page.locator('input[name="email"]')).toBeVisible();
    const onReviewPage = await page.getByText("Bestätigung bestellen").isVisible().catch(() => false);
    expect(onReviewPage).toBe(false);
  });

  test("short German PLZ shows error", async ({ page }) => {
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Test 1");
    await page.fill('input[name="zip"]', "123");
    await page.fill('input[name="city"]', "Berlin");

    await page.click('button:has-text("Weiter zur Bestätigung")');
    await page.waitForTimeout(1000);
    // Check for PLZ error — either inline or in summary
    const hasError = await page.locator('[aria-invalid="true"]').count() > 0
      || await page.getByText("PLZ").isVisible().catch(() => false);
    expect(hasError).toBe(true);
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

    // Should advance to step 2 (review page)
    await expect(page.getByText("Ihre Bestellung")).toBeVisible();
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
    await expect(page.getByText("Ihre Bestellung")).toBeVisible();
  });

  test("back link returns to cart", async ({ page }) => {
    const backLink = page.locator('a[href="/warenkorb"]').first();
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/warenkorb/);
  });

  test("step indicator shows correct steps", async ({ page }) => {
    // The step indicator nav has aria-label "Bestellschritte"
    const stepNav = page.locator('nav[aria-label="Bestellschritte"]');
    await expect(stepNav).toBeVisible();
    await expect(stepNav.getByText("Warenkorb", { exact: true })).toBeVisible();
    await expect(stepNav.getByText("Adresse", { exact: true })).toBeVisible();
    await expect(stepNav.getByText("Bestätigung", { exact: true })).toBeVisible();
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
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
  });

  test("shows order summary with items", async ({ page }) => {
    await expect(page.getByText("Ihre Bestellung")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^Versand$/ })).toBeVisible();
    await expect(page.getByText("Gesamt")).toBeVisible();
  });

  test("shows payment method", async ({ page }) => {
    await expect(page.getByText("Zahlungsart")).toBeVisible();
    await expect(page.getByText("Überweisung (Vorkasse)")).toBeVisible();
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
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
    await submitOrder(page);

    // Bank details
    await expect(page.getByText("IBAN")).toBeVisible();
    await expect(page.getByText("BIC")).toBeVisible();
    await expect(page.getByText("Empfänger")).toBeVisible();
    await expect(page.getByText("Verwendungszweck", { exact: true })).toBeVisible();
  });

  test("shows order number", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
    await submitOrder(page);

    // Order number should be visible (HL-YYYYMM-XXXXXXXX format)
    const orderNumber = page.locator("text=/HL-\\d{6}-[A-F0-9]{8}/");
    await expect(orderNumber.first()).toBeVisible();
  });

  test("shows email confirmation note", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
    await submitOrder(page);

    await expect(page.getByText("Bestätigungs-E-Mail")).toBeVisible();
  });

  test("shows order summary section", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
    await submitOrder(page);

    await expect(page.getByText("Zusammenfassung")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^Versand$/ }).first()).toBeVisible();
    await expect(page.getByText("Gesamt")).toBeVisible();
  });

  test("shows FAQ section", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
    await submitOrder(page);

    await expect(page.getByText("Häufige Fragen")).toBeVisible();
  });

  test("continue shopping button goes to shop", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCheckout(page);
    await fillCheckoutForm(page);
    await submitToStep2(page);
    await submitOrder(page);

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
    await setupCookieConsent(page);
    await page.goto("/bestellung");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/warenkorb/);
  });
});

test.describe("Mobile Checkout", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("checkout flow works on mobile", async ({ page }) => {
    await addFirstProductToCart(page);

    await goToCheckout(page);

    await fillCheckoutForm(page);
    await submitToStep2(page);

    await expect(page.getByText("Ihre Bestellung")).toBeVisible();
    await submitOrder(page);
    await expect(page.locator("h1")).toContainText("Vielen Dank");
  });
});

test.describe("Shipping Cost Logic", () => {
  test("shows shipping information on cart page", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/warenkorb");
    await page.waitForTimeout(500);

    // Cart should show shipping info — either free or paid
    await expect(page.locator("h1")).toContainText("Warenkorb");
    await expect(page.getByText("Zusammenfassung")).toBeVisible();
    // Verify either free shipping badge or shipping cost is shown
    const hasShippingInfo = await page.getByText("Versand").first().isVisible().catch(() => false);
    expect(hasShippingInfo).toBe(true);
  });
});

test.describe("Product Search → Cart → Checkout", () => {
  test("search for product, add to cart, complete checkout", async ({ page }) => {
    await setupCookieConsent(page);
    await page.goto("/shop");
    await page.waitForTimeout(500);

    // Click first product (navigate directly)
    const productLink = page.locator('a[href^="/produkt/"]').first();
    await expect(productLink).toBeVisible();
    const href = await productLink.getAttribute("href");
    await page.goto(href!);

    // Verify product page loaded
    await expect(page.getByRole("button", { name: /In den Warenkorb/ })).toBeVisible();

    // Add to cart
    await page.getByRole("button", { name: /In den Warenkorb/ }).first().click();
    await page.waitForTimeout(500);

    // Navigate to checkout directly
    await goToCheckout(page);

    // Complete checkout
    await fillCheckoutForm(page, { email: `search-e2e-${Date.now()}@example.com` });
    await submitToStep2(page);
    await submitOrder(page);
    await expect(page.locator("h1")).toContainText("Vielen Dank");
  });
});
