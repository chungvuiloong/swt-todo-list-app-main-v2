const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests', () => {
  test('homepage redirects to login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('form')).toBeVisible();
  });

  test('login page loads successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Welcome to Todo Manager');
  });

  test('register page loads successfully', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('[data-testid="register-form"]')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Register an account');
  });
});