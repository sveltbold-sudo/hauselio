import { test, expect, type Page } from "@playwright/test";

async function setupCookieConsent(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("HAUSAURA_cookie_consent", JSON.stringify({ essential: true, functional: true, analytics: true }));
  });
}

test.describe("Admin Dashboard", () => {
  test("unauthenticated access redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page is accessible from admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("h2")).toContainText("Anmeldung");
  });
});

test.describe("Admin Login Flow", () => {
  test("login form renders correctly", async ({ page }) => {
    await setupCookieConsent(page);
    await page.goto("/admin/login");
    await page.waitForSelector("#admin-email", { timeout: 15000 });
    await expect(page.locator("#admin-email")).toBeVisible();
    await expect(page.locator("#admin-password")).toBeVisible();
    const adminForm = page.locator("form").filter({ has: page.locator("#admin-email") });
    await expect(adminForm.locator('button[type="submit"]')).toBeVisible();
  });

  test("wrong credentials show error", async ({ page }) => {
    await setupCookieConsent(page);
    await page.goto("/admin/login");
    await page.waitForSelector("#admin-email", { timeout: 15000 });
    const email = `wrong-${Date.now()}@test.de`;
    await page.fill("#admin-email", email);
    await page.fill("#admin-password", "wrongpassword");
    const adminForm = page.locator("form").filter({ has: page.locator("#admin-email") });
    await adminForm.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
  });
});
