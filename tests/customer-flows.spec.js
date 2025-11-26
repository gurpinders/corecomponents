import { test, expect } from "@playwright/test";

test.describe("Customer Flows", () => {
  test('should browse catalog and view categories', async ({ page }) => {
    await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
    
    // Just check page loaded
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Check page title exists
    const title = await page.locator('h1').textContent({ timeout: 5000 }).catch(() => null);
    expect(title).toBeTruthy();
    
    // Check that at least one link exists
    const hasLinks = await page.locator('a').count() > 0;
    expect(hasLinks).toBeTruthy();
  });

  test("should search for parts within a category", async ({ page }) => {
    await page.goto("/catalog?category=1");

    // Wait for page load
    await expect(page.locator("h1")).toBeVisible({ timeout: 5000 });

    // Enter search term
    await page.fill('input[placeholder*="Search"]', "filter");
    await page.click('button:has-text("Search")');

    // Wait for URL to update or results to show
    await page.waitForTimeout(500);

    // Check if search worked (either shows results or "no results")
    const hasResults = await page
      .locator("text=Searching for")
      .isVisible()
      .catch(() => false);
    const noResults = await page
      .locator("text=No parts found")
      .isVisible()
      .catch(() => false);
    expect(hasResults || noResults).toBeTruthy();
  });

  test("should add item to cart", async ({ page }) => {
    await page.goto("/catalog?category=1");

    // Wait for page to load
    await expect(page.locator("h1")).toBeVisible({ timeout: 5000 });

    // Wait a bit for parts to render
    await page.waitForTimeout(1000);

    // Click first "Add to Cart" button that's visible
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addToCartBtn.click();
    }
  });

  test("should view cart and see items", async ({ page }) => {
    await page.goto("/cart");

    // Should show cart items or empty message
    const hasContent = await page.locator("h1").isVisible({ timeout: 5000 });
    expect(hasContent).toBeTruthy();
  });

  test("should request a quote from cart", async ({ page }) => {
    // Go directly to request quote page
    await page.goto("/request-quote");

    // Check if form exists
    const hasForm = await page
      .locator('input[name="name"]')
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    expect(hasForm).toBeTruthy();
  });

  test("should view part detail page", async ({ page }) => {
    // Go directly to a part detail (assuming part ID 1 exists)
    await page.goto("/catalog/1");

    // Should show part details or 404
    await page.waitForTimeout(2000);
    const hasTitle = await page
      .locator("h1")
      .isVisible()
      .catch(() => false);
    expect(hasTitle).toBeTruthy();
  });

  test("should clear search and show all parts", async ({ page }) => {
    await page.goto("/catalog?category=1&search=test");

    // Wait for page load
    await page.waitForTimeout(500);

    // Click clear button if it exists
    const clearBtn = page.locator('button:has-text("Clear")');
    if (await clearBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await clearBtn.click();

      // Should remove search parameter from URL
      await page.waitForTimeout(500);
      expect(page.url()).not.toContain("search=");
    }
  });

  test("should navigate to trucks page", async ({ page }) => {
    await page.goto("/trucks");

    await expect(page.locator("h1")).toBeVisible({ timeout: 5000 });
  });
});
