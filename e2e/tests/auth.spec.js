const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Authentication Tests', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('user can register successfully', async ({ page }) => {
    const username = helpers.generateTestUsername();
    const password = helpers.generateTestPassword();

    await helpers.registerUser(username, password);
    
    await helpers.waitForNavigation('/todo-lists');
    await helpers.expectToBeAt('/todo-lists');
  });

  test('user can login successfully', async ({ page }) => {
    const username = helpers.generateTestUsername();
    const password = helpers.generateTestPassword();

    await helpers.registerUser(username, password);
    await helpers.waitForNavigation('/todo-lists');
    
    await helpers.logout();
    await helpers.waitForNavigation('/login');
    
    await helpers.loginUser(username, password);
    await helpers.waitForNavigation('/todo-lists');
    await helpers.expectToBeAt('/todo-lists');
  });

  test('user cannot login with invalid credentials', async ({ page }) => {
    await helpers.loginUser('invaliduser', 'invalidpass');
    
    await helpers.expectToBeAt('/login');
    await helpers.expectElementVisible('[data-testid="login-form"]');
  });

  test('user cannot register with short password', async ({ page }) => {
    const username = helpers.generateTestUsername();
    
    await helpers.registerUser(username, 'short');
    
    await helpers.expectToBeAt('/register');
    await helpers.expectElementVisible('[data-testid="register-form"]');
  });
});