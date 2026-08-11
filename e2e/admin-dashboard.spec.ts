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
  test("login form renders correctly", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("wrong credentials show error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "wrong@test.de");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Ungültige Anmeldedaten")).toBeVisible({ timeout: 5000 });
  });
});
