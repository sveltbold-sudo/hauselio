import { test, expect } from "@playwright/test";

test.describe("Admin Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/admin/login");
    await page.waitForSelector("#admin-email", { timeout: 15000 });
    const cookieBanner = page.locator('[role="dialog"][aria-label*="Cookie"]');
    if (await cookieBanner.isVisible({ timeout: 2000 }).catch(() => false)) {
      const acceptBtn = cookieBanner.getByRole("button", { name: /akzeptieren|alle|annehmen/i });
      if (await acceptBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await acceptBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test("displays login form with heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("HAUSAURA");
    await expect(page.locator("h2")).toContainText("Anmeldung");
  });

  test("has email and password fields", async ({ page }) => {
    await expect(page.locator("#admin-email")).toBeVisible();
    await expect(page.locator("#admin-password")).toBeVisible();
  });

  test("has submit button", async ({ page }) => {
    const adminForm = page.locator("form").filter({ has: page.locator("#admin-email") });
    const submitBtn = adminForm.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText("Anmelden");
  });

  test("empty form submission triggers HTML validation", async ({ page }) => {
    const emailField = page.locator("#admin-email");
    const isValid = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test("wrong credentials shows error message", async ({ page }) => {
    const email = `wrong-${Date.now()}@test.de`;
    await page.fill("#admin-email", email);
    await page.fill("#admin-password", "wrongpassword");
    const adminForm = page.locator("form").filter({ has: page.locator("#admin-email") });
    await adminForm.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
  });

  test("password visibility toggle works", async ({ page }) => {
    await expect(page.locator("#admin-password")).toHaveAttribute("type", "password");
    const toggleBtn = page.locator('button[aria-label*="Passwort"]').first();
    await toggleBtn.click();
    await expect(page.locator("#admin-password")).toHaveAttribute("type", "text");
  });

  test("has admin panel branding", async ({ page }) => {
    await expect(page.getByText("Admin-Bereich")).toBeVisible();
    await expect(page.getByText("HAUSAURA Admin Panel")).toBeVisible();
  });

  test("form has proper labels", async ({ page }) => {
    await expect(page.locator("label[for='admin-email']")).toBeVisible();
    await expect(page.locator("label[for='admin-password']")).toBeVisible();
  });

  test("loading state shows during submission", async ({ page }) => {
    await page.fill("#admin-email", "test@test.de");
    await page.fill("#admin-password", "password123");
    const adminForm = page.locator("form").filter({ has: page.locator("#admin-email") });
    await adminForm.locator('button[type="submit"]').click();
    await expect(page.getByText("Wird angemeldet\u2026")).toBeVisible({ timeout: 2000 });
  });
});
