import { test, expect } from "@playwright/test";

test.describe("Checkout Page", () => {
  test.beforeEach(async ({ page }) => {
    // Add item to cart first so checkout page renders
    await page.goto("/shop");
    await page.locator('a[href^="/produkt/"]').first().click();
    await page.click('button:has-text("In den Warenkorb")');
    await page.waitForTimeout(500);
    await page.goto("/bestellung");
  });

  test("displays page heading and back link", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Kasse");
    await expect(page.getByText("Zurück zum Warenkorb")).toBeVisible();
  });

  test("displays step indicator", async ({ page }) => {
    await expect(page.getByText("Warenkorb")).toBeVisible();
    await expect(page.getByText("Kasse")).toBeVisible();
    await expect(page.getByText("Bestätigung")).toBeVisible();
  });

  test("displays contact form fields", async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
  });

  test("displays shipping form fields", async ({ page }) => {
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="address"]')).toBeVisible();
    await expect(page.locator('input[name="zip"]')).toBeVisible();
    await expect(page.locator('input[name="city"]')).toBeVisible();
    await expect(page.locator('select[name="country"]')).toBeVisible();
  });

  test("country select has DE/AT/CH options", async ({ page }) => {
    const select = page.locator('select[name="country"]');
    const options = await select.locator("option").allTextContents();
    expect(options).toContain("Deutschland");
    expect(options).toContain("Österreich");
    expect(options).toContain("Schweiz");
  });

  test("displays SEPA payment info", async ({ page }) => {
    await expect(page.getByText("Überweisung (SEPA)")).toBeVisible();
    await expect(page.getByText("Bankverbindung per E-Mail")).toBeVisible();
  });

  test("displays order summary", async ({ page }) => {
    await expect(page.getByText("Ihre Bestellung")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.getByText("Versand")).toBeVisible();
  });

  test("submit button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Bestellung aufgeben" })).toBeVisible();
  });

  test("empty form submission shows validation errors", async ({ page }) => {
    await page.click('button:has-text("Bestellung aufgeben")');
    await page.waitForTimeout(300);
    const errors = page.locator("text=erforderlich");
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test("invalid email shows validation error", async ({ page }) => {
    await page.fill('input[name="email"]', "not-an-email");
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Musterstr. 1");
    await page.fill('input[name="zip"]', "10115");
    await page.fill('input[name="city"]', "Berlin");
    await page.click('button:has-text("Bestellung aufgeben")');
    await expect(page.getByText("Ungültige E-Mail")).toBeVisible();
  });

  test("invalid PLZ shows validation error", async ({ page }) => {
    await page.fill('input[name="email"]', "test@test.de");
    await page.fill('input[name="firstName"]', "Max");
    await page.fill('input[name="lastName"]', "Mustermann");
    await page.fill('input[name="address"]', "Musterstr. 1");
    await page.fill('input[name="zip"]', "123");
    await page.fill('input[name="city"]', "Berlin");
    await page.click('button:has-text("Bestellung aufgeben")');
    await expect(page.getByText("PLZ muss genau 5 Ziffern")).toBeVisible();
  });

  test("notes field is optional", async ({ page }) => {
    const notesField = page.locator('textarea[name="notes"]');
    await expect(notesField).toBeVisible();
    expect(await notesField.inputValue()).toBe("");
  });

  test("displays AGB and Widerruf links", async ({ page }) => {
    await expect(page.locator('a[href="/agb"]')).toBeVisible();
    await expect(page.locator('a[href="/widerruf"]')).toBeVisible();
  });
});
