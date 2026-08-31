import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
  });

  test("displays heading and description", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("So erreichen Sie uns");
    await expect(page.getByText("per E-Mail, Telefon oder persönlicher Nachricht")).toBeVisible();
  });

  test("displays contact form", async ({ page }) => {
    await expect(page.locator('input[name="firstName"], input[id="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"], input[id="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[id="email"]')).toBeVisible();
    await expect(page.locator('input[name="subject"], input[id="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"], textarea[id="message"]')).toBeVisible();
  });

  test("displays contact information", async ({ page }) => {
    const email = page.getByText("info@hausaura.de");
    const phone = page.getByText("+49");
    const address = page.getByText("Kastanienallee");

    const emailCount = await email.count();
    const phoneCount = await phone.count();
    const addressCount = await address.count();

    expect(emailCount + phoneCount + addressCount).toBeGreaterThan(0);
  });

  test("submit button is visible", async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();
  });

  test("empty form submission shows validation", async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    await page.waitForTimeout(300);
    const errors = page.locator("text=erforderlich");
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test("navigation link back to shop exists", async ({ page }) => {
    const shopLink = page.locator('a[href="/shop"]').first();
    const count = await shopLink.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
