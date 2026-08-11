import { test, expect } from "@playwright/test";

test.describe("Admin Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
  });

  test("displays login form with heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("HAUSELIO");
    await expect(page.locator("h2")).toContainText("Anmeldung");
  });

  test("has email and password fields", async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("has submit button", async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText("Anmelden");
  });

  test("empty form submission triggers HTML validation", async ({ page }) => {
    // HTML5 required attribute prevents submission
    const emailField = page.locator('input[type="email"]');
    const isValid = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test("wrong credentials shows error message", async ({ page }) => {
    await page.fill('input[type="email"]', "wrong@test.de");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Ungültige Anmeldedaten")).toBeVisible({ timeout: 5000 });
  });

  test("password visibility toggle works", async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();

    // Click eye icon to show password
    const toggleBtn = page.locator("button").filter({ has: page.locator("svg") }).last();
    await toggleBtn.click();
    const textField = page.locator('input[type="text"]');
    await expect(textField).toBeVisible();
  });

  test("has admin panel branding", async ({ page }) => {
    await expect(page.getByText("Admin-Bereich")).toBeVisible();
    await expect(page.getByText("HAUSELIO Admin Panel")).toBeVisible();
  });

  test("form has proper labels", async ({ page }) => {
    await expect(page.getByText("E-Mail")).toBeVisible();
    await expect(page.getByText("Passwort")).toBeVisible();
  });

  test("loading state shows during submission", async ({ page }) => {
    await page.fill('input[type="email"]', "test@test.de");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    // Loading text appears briefly
    await expect(page.getByText("Wird angemeldet...")).toBeVisible({ timeout: 2000 });
  });
});
