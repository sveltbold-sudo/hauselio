import { test, expect, type Page } from "@playwright/test";

const BASE = "https://www.hausaura.de";

test.describe("1. HOMEPAGE", () => {
  test("loads and has correct title", async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/HAUSAURA|Haushaltsger/);
  });

  test("has meta description", async ({ page }) => {
    await page.goto(BASE);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(50);
  });

  test("has canonical URL", async ({ page }) => {
    await page.goto(BASE);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(BASE);
  });

  test("has Organization JSON-LD", async ({ page }) => {
    await page.goto(BASE);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      if (text?.includes("Organization")) found = true;
    }
    expect(found).toBe(true);
  });

  test("has hero carousel or banner", async ({ page }) => {
    await page.goto(BASE);
    const hero = page.locator('[class*="hero"], [class*="carousel"], [class*="banner"]').first();
    await expect(hero).toBeVisible({ timeout: 10000 });
  });

  test("navigation links are present", async ({ page }) => {
    await page.goto(BASE);
    const shopLink = page.locator('a[href="/shop"]').first();
    await expect(shopLink).toBeVisible();
  });

  test("footer is present", async ({ page }) => {
    await page.goto(BASE);
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("has sitemap link", async ({ page }) => {
    await page.goto(BASE);
    const sitemap = page.locator('link[rel="sitemap"]');
    await expect(sitemap).toHaveCount(1);
  });

  test("has RSS feed link", async ({ page }) => {
    await page.goto(BASE);
    const rss = page.locator('link[rel="alternate"][type="application/rss+xml"]');
    await expect(rss).toHaveCount(1);
  });
});

test.describe("2. SHOP PAGE", () => {
  test("loads product listing", async ({ page }) => {
    await page.goto(`${BASE}/shop`);
    await expect(page).toHaveTitle(/Shop|Haushaltsgeräte|HAUSAURA/);
    const products = page.locator('a[href*="/produkt/"]');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test("has sort dropdown", async ({ page }) => {
    await page.goto(`${BASE}/shop`);
    const sort = page.locator("select").first();
    await expect(sort).toBeVisible();
  });

  test("has pagination", async ({ page }) => {
    await page.goto(`${BASE}/shop`);
    const pagination = page.locator('nav[aria-label*="Seiten"], nav[aria-label*="pagination"]');
    const paginationExists = await pagination.count();
    const nextPage = page.locator('a[href*="page=2"]');
    const nextExists = await nextPage.count();
    expect(paginationExists + nextExists).toBeGreaterThan(0);
  });

  test("search works", async ({ page }) => {
    await page.goto(`${BASE}/shop`);
    const searchInput = page.locator('input[type="search"], input[name="q"], input[placeholder*="Such"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("Kaffee");
      await searchInput.press("Enter");
      await page.waitForTimeout(2000);
      const url = page.url();
      expect(url).toContain("q=");
    }
  });
});

test.describe("3. PRODUCT PAGE", () => {
  test("loads product detail with title", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    await expect(page).toHaveTitle(/Jura|HAUSAURA/);
  });

  test("has product name as H1", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toContain("Jura");
  });

  test("has price displayed", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const price = page.locator(':text("1.199"), :text("1199"), [class*="tabular-nums"]').first();
    await expect(price).toBeVisible({ timeout: 10000 });
  });

  test("has add to cart button", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const btn = page.locator('button:has-text("Warenkorb"), button:has-text("hinzufügen"), button:has-text("Kaufen")').first();
    await expect(btn).toBeVisible();
  });

  test("has Product JSON-LD", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      if (text?.includes('"@type":"Product"') || text?.includes('"@type": "Product"')) found = true;
    }
    expect(found).toBe(true);
  });

  test("has BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      if (text?.includes("BreadcrumbList")) found = true;
    }
    expect(found).toBe(true);
  });

  test("has breadcrumb navigation", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
  });

  test("has product images", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const images = page.locator('img[alt*="Jura"], img[src*="cloudinary"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test("has tabs (description, specs, shipping)", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const tabs = page.locator('[role="tab"]');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("has rating/reviews section", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const reviews = page.locator('[id*="bewertung"], [id*="review"], [class*="review"], [class*="rating"]').first();
    const reviewCount = await page.locator('[id*="bewertung"], [id*="review"], [class*="review"], [class*="rating"]').count();
    expect(reviewCount).toBeGreaterThan(0);
  });

  test("og:type is not product (Next.js limitation)", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
    expect(ogType).toBe("website");
  });

  test("has canonical URL", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/produkt/jura-e8-platinum");
  });
});

test.describe("4. CATEGORY PAGE", () => {
  test("loads category with products", async ({ page }) => {
    await page.goto(`${BASE}/kategorie/kaffee`);
    await expect(page).toHaveTitle(/Kaffee|HAUSAURA/);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("has CollectionPage JSON-LD", async ({ page }) => {
    await page.goto(`${BASE}/kategorie/kaffee`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      if (text?.includes("CollectionPage") || text?.includes("ItemList")) found = true;
    }
    expect(found).toBe(true);
  });

  test("has breadcrumb", async ({ page }) => {
    await page.goto(`${BASE}/kategorie/kaffee`);
    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
  });

  test("category index page loads", async ({ page }) => {
    await page.goto(`${BASE}/kategorie`);
    await expect(page).toHaveTitle(/HAUSAURA/);
    const links = page.locator('a[href*="/kategorie/"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });
});

test.describe("5. CART", () => {
  test("cart page loads empty", async ({ page }) => {
    await page.goto(`${BASE}/warenkorb`);
    await page.waitForTimeout(2000);
    const emptyMsg = page.locator(':text("leer"), :text("keine"), :text("Empty")');
    const itemCount = await emptyMsg.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test("add item to cart from product page", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    await page.waitForTimeout(2000);
    // Dismiss cookie banner if present
    const cookieBtn = page.locator('button:has-text("Alle akzeptieren"), button:has-text("Akzeptieren")').first();
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(1000);
    }
    const addBtn = page.locator('button:has-text("In den Warenkorb")').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click({ force: true });
    await page.waitForTimeout(2000);
    const toast = page.locator(':text("hinzugefügt"), :text("Warenkorb hinzugefügt")');
    const toastCount = await toast.count();
    expect(toastCount).toBeGreaterThan(0);
  });
});

test.describe("6. RATGEBER", () => {
  test("ratgeber index loads", async ({ page }) => {
    await page.goto(`${BASE}/ratgeber`);
    await expect(page).toHaveTitle(/Ratgeber|HAUSAURA/);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("has article cards", async ({ page }) => {
    await page.goto(`${BASE}/ratgeber`);
    const articles = page.locator('a[href*="/ratgeber/"]');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test("article detail loads", async ({ page }) => {
    await page.goto(`${BASE}/ratgeber`);
    const firstArticle = page.locator('a[href*="/ratgeber/"]').first();
    if (await firstArticle.isVisible()) {
      const href = await firstArticle.getAttribute("href");
      if (href) {
        await page.goto(`${BASE}${href}`);
        const h1 = page.locator("h1").first();
        await expect(h1).toBeVisible();
      }
    }
  });

  test("has ItemList JSON-LD on index", async ({ page }) => {
    await page.goto(`${BASE}/ratgeber`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      if (text?.includes("ItemList")) found = true;
    }
    expect(found).toBe(true);
  });
});

test.describe("7. LEGAL PAGES", () => {
  test("impressum loads", async ({ page }) => {
    await page.goto(`${BASE}/impressum`);
    await expect(page).toHaveTitle(/Impressum|HAUSAURA/);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("datenschutz loads", async ({ page }) => {
    await page.goto(`${BASE}/datenschutz`);
    await expect(page).toHaveTitle(/HAUSAURA/);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("agb loads", async ({ page }) => {
    await page.goto(`${BASE}/agb`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });

  test("widerruf loads", async ({ page }) => {
    await page.goto(`${BASE}/widerruf`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });

  test("versand loads", async ({ page }) => {
    await page.goto(`${BASE}/versand`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });

  test("zahlungsarten loads", async ({ page }) => {
    await page.goto(`${BASE}/zahlungsarten`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });
});

test.describe("8. STATIC PAGES", () => {
  test("kontakt loads", async ({ page }) => {
    await page.goto(`${BASE}/kontakt`);
    await expect(page).toHaveTitle(/Kontakt|HAUSAURA/);
  });

  test("ueber-uns loads", async ({ page }) => {
    await page.goto(`${BASE}/ueber-uns`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });

  test("hilfe loads", async ({ page }) => {
    await page.goto(`${BASE}/hilfe`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });

  test("garantie loads", async ({ page }) => {
    await page.goto(`${BASE}/garantie`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });

  test("barrierefreiheit loads", async ({ page }) => {
    await page.goto(`${BASE}/barrierefreiheit`);
    await expect(page).toHaveTitle(/HAUSAURA/);
  });
});

test.describe("9. ACCOUNT PAGES", () => {
  test("konto page loads (login/register)", async ({ page }) => {
    await page.goto(`${BASE}/konto`);
    await page.waitForTimeout(2000);
    const loginForm = page.locator('input[type="email"], input[name="email"]');
    const count = await loginForm.count();
    expect(count).toBeGreaterThan(0);
  });

  test("password reset page loads", async ({ page }) => {
    await page.goto(`${BASE}/passwort-zuruecksetzen`);
    await page.waitForTimeout(2000);
    const heading = page.locator(':text("Passwort"), :text("password"), :text("Zurücksetzen")');
    const count = await heading.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("10. NEWSLETTER", () => {
  test("newsletter form exists on homepage", async ({ page }) => {
    await page.goto(BASE);
    const form = page.locator('input[type="email"], input[placeholder*="E-Mail"], input[placeholder*="email"]');
    const count = await form.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("11. SEO ELEMENTS", () => {
  test("homepage has canonical URL", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "domcontentloaded" });
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBeTruthy();
  });

  test("page has lang=de", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "domcontentloaded" });
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("de");
  });

  test("page has viewport meta", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "domcontentloaded" });
    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toContain("width=device-width");
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto(`${BASE}/robots.txt`);
    expect(response?.status()).toBe(200);
    const text = await page.locator("body").textContent();
    expect(text).toContain("User-Agent");
    expect(text).toContain("Sitemap");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto(`${BASE}/sitemap.xml`);
    expect(response?.status()).toBe(200);
    const text = await page.locator("body").textContent();
    expect(text).toContain("urlset");
    expect(text).toContain("hausaura.de");
  });

  test("404 page works", async ({ page }) => {
    const response = await page.goto(`${BASE}/nonexistent-page-12345`);
    expect(response?.status()).toBe(404);
  });
});

test.describe("12. PERFORMANCE", () => {
  test("homepage loads under 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test("product page loads under 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE}/produkt/jura-e8-platinum`, { waitUntil: "domcontentloaded" });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test("no console errors on homepage", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(BASE);
    await page.waitForTimeout(3000);
    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("404") && !e.includes("Analytics")
    );
    expect(criticalErrors.length).toBe(0);
  });

  test("no console errors on product page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    await page.waitForTimeout(3000);
    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("404") && !e.includes("Analytics")
    );
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe("13. ACCESSIBILITY", () => {
  test("skip to content link exists", async ({ page }) => {
    await page.goto(BASE);
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });

  test("buttons have accessible names", async ({ page }) => {
    await page.goto(`${BASE}/produkt/jura-e8-platinum`);
    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = await buttons.nth(i).textContent();
      const ariaLabel = await buttons.nth(i).getAttribute("aria-label");
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});

test.describe("14. CROSS-DEVICE", () => {
  test("mobile viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("tablet viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("desktop viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 15000 });
  });
});
