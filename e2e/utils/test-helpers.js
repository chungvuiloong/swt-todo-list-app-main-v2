const { expect } = require('@playwright/test');

class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  async registerUser(username, password) {
    await this.page.goto('/register');
    await this.page.waitForSelector('[data-testid="register-form"]');
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    
    const submitButton = this.page.locator('button[type="submit"]').last();
    await submitButton.click();
    
    await this.page.waitForTimeout(1000);
  }

  async loginUser(username, password) {
    await this.page.goto('/login');
    await this.page.waitForSelector('[data-testid="login-form"]');
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    
    const submitButton = this.page.locator('button[type="submit"]').last();
    await submitButton.click();
    
    await this.page.waitForTimeout(1000);
  }

  async logout() {
    await this.page.click('[data-testid="profile-menu"]');
    await this.page.click('[data-testid="logout-button"]');
  }

  async createTodoList(title, description = '') {
    await this.page.click('[data-testid="create-list-button"]');
    await this.page.fill('input[name="title"]', title);
    if (description) {
      await this.page.fill('textarea[name="description"]', description);
    }
    await this.page.click('button[type="submit"]');
  }

  async createTodoItem(title, description = '') {
    await this.page.click('[data-testid="add-item-button"]');
    await this.page.fill('input[name="title"]', title);
    if (description) {
      await this.page.fill('textarea[name="description"]', description);
    }
    await this.page.click('button[type="submit"]');
  }

  async waitForNavigation(url, options = {}) {
    const timeout = options.timeout || 10000;
    try {
      await this.page.waitForURL(url, { timeout });
    } catch (error) {
      if (error.message.includes('Target page, context or browser has been closed')) {
        await this.page.waitForTimeout(2000);
        await this.page.waitForURL(url, { timeout });
      } else {
        throw error;
      }
    }
  }

  async expectToBeAt(url) {
    await expect(this.page).toHaveURL(url);
  }

  async expectElementVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectElementHidden(selector) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async expectText(selector, text) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  generateTestUsername() {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  generateTestPassword() {
    return 'TestPassword123!';
  }
}

module.exports = { TestHelpers };