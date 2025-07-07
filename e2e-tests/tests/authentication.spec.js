const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('User Authentication', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('User Registration', () => {
    test('should allow user to register with valid credentials @smoke', async ({ page }) => {
      const username = helpers.generateTestUsername();
      const password = helpers.generateTestPassword();

      await page.goto('/register');
      await page.waitForSelector('[data-testid="register-form"]');
      
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', password);
      
      const submitButton = page.locator('button[type="submit"]').last();
      await submitButton.click();
      
      await page.waitForTimeout(3000);
      
      // Should redirect to todo lists after successful registration
      await expect(page).toHaveURL('/todo-lists');
      await helpers.expectElementVisible('[data-testid="todo-lists-page"]');
    });

    test('should show error for registration with short password', async ({ page }) => {
      const username = helpers.generateTestUsername();
      
      await page.goto('/register');
      await page.waitForSelector('[data-testid="register-form"]');
      
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', 'short');
      
      const submitButton = page.locator('button[type="submit"]').last();
      await submitButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should stay on register page with validation error
      await expect(page).toHaveURL(/register/);
      await helpers.expectElementVisible('[data-testid="register-form"]');
    });

    test('should show error for registration with empty fields', async ({ page }) => {
      await page.goto('/register');
      await page.waitForSelector('[data-testid="register-form"]');
      
      const submitButton = page.locator('button[type="submit"]').last();
      await submitButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should stay on register page with validation errors
      await expect(page).toHaveURL(/register/);
      await helpers.expectElementVisible('[data-testid="register-form"]');
    });
  });

  test.describe('User Login', () => {
    test('should allow user to login with valid credentials @smoke', async ({ page }) => {
      // First register a user
      const username = helpers.generateTestUsername();
      const password = helpers.generateTestPassword();

      await helpers.registerUser(username, password);
      await page.waitForTimeout(2000);
      
      // Logout first
      await helpers.logout();
      await page.waitForTimeout(1000);
      
      // Now login
      await helpers.loginUser(username, password);
      await page.waitForTimeout(3000);
      
      // Should redirect to todo lists after successful login
      await expect(page).toHaveURL('/todo-lists');
      await helpers.expectElementVisible('[data-testid="todo-lists-page"]');
    });

    test('should show error for login with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('[data-testid="login-form"]');
      
      await page.fill('input[name="username"]', 'nonexistentuser');
      await page.fill('input[name="password"]', 'wrongpassword');
      
      const submitButton = page.locator('button[type="submit"]').last();
      await submitButton.click();
      
      await page.waitForTimeout(2000);
      
      // Should stay on login page
      await expect(page).toHaveURL(/login/);
      await helpers.expectElementVisible('[data-testid="login-form"]');
    });

    test('should show error for login with empty fields', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('[data-testid="login-form"]');
      
      const submitButton = page.locator('button[type="submit"]').last();
      await submitButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should stay on login page with validation errors
      await expect(page).toHaveURL(/login/);
      await helpers.expectElementVisible('[data-testid="login-form"]');
    });
  });

  test.describe('User Logout', () => {
    test('should allow user to logout successfully @smoke', async ({ page }) => {
      // Register and login first
      const username = helpers.generateTestUsername();
      const password = helpers.generateTestPassword();

      await helpers.registerUser(username, password);
      await page.waitForTimeout(2000);
      
      // Verify we're logged in
      await expect(page).toHaveURL('/todo-lists');
      
      // Logout
      await helpers.logout();
      await page.waitForTimeout(1000);
      
      // Should redirect to login page
      await expect(page).toHaveURL('/login');
      await helpers.expectElementVisible('[data-testid="login-form"]');
    });

    test('should redirect to login when accessing protected pages after logout', async ({ page }) => {
      // Register and login first
      const username = helpers.generateTestUsername();
      const password = helpers.generateTestPassword();

      await helpers.registerUser(username, password);
      await page.waitForTimeout(2000);
      
      // Logout
      await helpers.logout();
      await page.waitForTimeout(1000);
      
      // Try to access protected pages
      await page.goto('/todo-lists');
      await page.waitForTimeout(1000);
      
      // Should redirect to login
      await expect(page).toHaveURL('/login');
      await helpers.expectElementVisible('[data-testid="login-form"]');
    });
  });
});