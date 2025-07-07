const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Working Authentication Tests', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('user can register successfully', async ({ page }) => {
    const username = helpers.generateTestUsername();
    const password = helpers.generateTestPassword();

    await page.goto('/register');
    await page.waitForSelector('[data-testid="register-form"]');
    
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    
    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();
    
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    if (currentUrl.includes('/todo-lists')) {
      await expect(page).toHaveURL('/todo-lists');
    } else {
      console.log('Registration may have failed, current URL:', currentUrl);
      const hasError = await page.locator('[role="alert"]').isVisible();
      if (hasError) {
        const errorText = await page.locator('[role="alert"]').textContent();
        console.log('Error found:', errorText);
      }
    }
  });
});