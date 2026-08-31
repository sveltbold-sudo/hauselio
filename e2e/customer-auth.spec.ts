import { test, expect } from "@playwright/test";

test.describe("Customer Auth", () => {
  test.describe("Registration", () => {
    test("shows register form", async ({ page }) => {
      await page.goto("/konto");
      await page.click('button:has-text("Registrieren")');
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test("empty form shows validation errors", async ({ page }) => {
      await page.goto("/konto");
      await page.click('button:has-text("Registrieren")');
      await page.click('button:has-text("Konto erstellen")');
      await page.waitForTimeout(300);
      const errors = page.locator('[role="alert"]');
      await expect(errors.first()).toBeVisible();
    });

    test("short password shows validation error", async ({ page }) => {
      await page.goto("/konto");
      await page.click('button:has-text("Registrieren")');
      await page.fill('input[type="text"]', "Test User");
      await page.fill('input[type="email"]', "test-e2e@example.com");
      await page.fill('input[type="password"]', "123");
      await page.click('button:has-text("Konto erstellen")');
      await page.waitForTimeout(300);
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test("successful registration shows dashboard", async ({ page }) => {
      const email = `test-${Date.now()}@example.com`;
      await page.goto("/konto");
      await page.click('button:has-text("Registrieren")');
      await page.fill('input[type="text"]', "E2E Test");
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', "TestPasswort123!");
      await page.click('button:has-text("Konto erstellen")');
      await page.waitForTimeout(2000);
      await expect(page.locator('text=E2E Test')).toBeVisible();
      await expect(page.locator('text=Mein Konto')).toBeVisible();
    });
  });

  test.describe("Login", () => {
    test("shows login form", async ({ page }) => {
      await page.goto("/konto");
      await expect(page.locator('h1:has-text("Mein Konto")')).toBeVisible();
      await expect(page.locator('button:has-text("Anmelden")')).toBeVisible();
    });

    test("wrong credentials show error", async ({ page }) => {
      await page.goto("/konto");
      await page.fill('input[type="email"]', "nonexistent@example.com");
      await page.fill('input[type="password"]', "WrongPassword123!");
      await page.click('button:has-text("Anmelden")');
      await page.waitForTimeout(1000);
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe("Profile", () => {
    test("shows profile settings after login", async ({ page }) => {
      const email = `profile-test-${Date.now()}@example.com`;
      // Register first
      await page.goto("/konto");
      await page.click('button:has-text("Registrieren")');
      await page.fill('input[type="text"]', "Profile Test");
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', "TestPasswort123!");
      await page.click('button:has-text("Konto erstellen")');
      await page.waitForTimeout(2000);

      // Check profile form
      await expect(page.locator('text=Kontoeinstellungen')).toBeVisible();
      await expect(page.locator('#profile-name')).toBeVisible();
    });

    test("can update profile", async ({ page }) => {
      const email = `update-test-${Date.now()}@example.com`;
      // Register
      await page.goto("/konto");
      await page.click('button:has-text("Registrieren")');
      await page.fill('input[type="text"]', "Update Test");
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', "TestPasswort123!");
      await page.click('button:has-text("Konto erstellen")');
      await page.waitForTimeout(2000);

      // Update profile
      await page.fill('#profile-name', "Updated Name");
      await page.fill('#profile-phone', "+49 123 456789");
      await page.fill('#profile-city', "Berlin");
      await page.click('button:has-text("Profil speichern")');
      await page.waitForTimeout(1000);
      await expect(page.locator('text=Profil erfolgreich aktualisiert')).toBeVisible();
    });
  });

  test.describe("Logout", () => {
    test("logout returns to login form", async ({ page }) => {
      const email = `logout-test-${Date.now()}@example.com`;
      // Register
      await page.goto("/konto");
      await page.click('button:has-text("Registrieren")');
      await page.fill('input[type="text"]', "Logout Test");
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', "TestPasswort123!");
      await page.click('button:has-text("Konto erstellen")');
      await page.waitForTimeout(2000);

      // Logout
      await page.click('button:has-text("Abmelden")');
      await page.waitForTimeout(1000);
      await expect(page.locator('h1:has-text("Mein Konto")')).toBeVisible();
      await expect(page.locator('button:has-text("Anmelden")')).toBeVisible();
    });
  });
});
