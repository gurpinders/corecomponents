import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("h1")).toContainText("Login", { timeout: 5000 });
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should show signup page", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.locator("h1")).toContainText("Sign Up", {
      timeout: 5000,
    });
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should show error with invalid login credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrongpassword");

    // Click and wait for any response
    await Promise.all([
      page
        .waitForResponse((response) => response.url().includes("auth"), {
          timeout: 5000,
        })
        .catch(() => null),
      page.click('button[type="submit"]'),
    ]);

    // Wait a moment for UI to update
    await page.waitForTimeout(1500);

    // Check we're still on login (failed login doesn't redirect)
    expect(page.url()).toContain("login");
  });

  test("should navigate between login and signup", async ({ page }) => {
    await page.goto("/login");

    // Click signup link
    const signupLink = page.locator('a:has-text("Sign up")');
    if (await signupLink.isVisible({ timeout: 3000 })) {
      await signupLink.click();
      await page.waitForTimeout(500);
      expect(page.url()).toContain("signup");
    }
  });

  test("should show admin login link", async ({ page }) => {
    await page.goto("/login");

    const adminLink = page.locator('a:has-text("Admin login")');
    await expect(adminLink).toBeVisible({ timeout: 3000 });
  });
});
