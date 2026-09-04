import { test, expect } from "@playwright/test";

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
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("login form renders correctly", async ({ page }) => {
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
    await expect(page.locator("#admin-email")).toBeVisible();
    await expect(page.locator("#admin-password")).toBeVisible();
    const adminForm = page.locator("form").filter({ has: page.locator("#admin-email") });
    await expect(adminForm.locator('button[type="submit"]')).toBeVisible();
  });

  test("wrong credentials show error", async ({ page }) => {
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
    await page.fill("#admin-email", "wrong@test.de");
    await page.fill("#admin-password", "wrongpassword");
    const adminForm = page.locator("form").filter({ has: page.locator("#admin-email") });
    await adminForm.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 8000 });
  });
});
