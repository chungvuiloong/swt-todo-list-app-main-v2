const { test, expect } = require('@playwright/test');

test('debug registration form', async ({ page }) => {
  const username = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const password = 'TestPassword123!';

  await page.goto('/register');
  
  await expect(page.locator('[data-testid="register-form"]')).toBeVisible();
  
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  
  console.log('About to click submit...');
  await page.click('button[type="submit"]');
  
  console.log('Clicked submit, waiting...');
  await page.waitForTimeout(3000);
  
  console.log('Current URL:', page.url());
  
  const hasError = await page.locator('[role="alert"]').isVisible().catch(() => false);
  if (hasError) {
    const errorText = await page.locator('[role="alert"]').textContent();
    console.log('Error found:', errorText);
  }
});