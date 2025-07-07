const { test, expect } = require('@playwright/test');

test.describe('Basic Todo Functionality', () => {
  test('can navigate to todo lists page when not logged in', async ({ page }) => {
    await page.goto('/todo-lists');
    
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('registration form has proper validation', async ({ page }) => {
    await page.goto('/register');
    
    const submitButton = page.locator('button[type="submit"]').last();
    
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', 'short');
    
    await submitButton.click();
    
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveURL(/register/);
  });

  test('login form validation works', async ({ page }) => {
    await page.goto('/login');
    
    const submitButton = page.locator('button[type="submit"]').last();
    
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', '');
    
    await submitButton.click();
    
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveURL(/login/);
  });
});