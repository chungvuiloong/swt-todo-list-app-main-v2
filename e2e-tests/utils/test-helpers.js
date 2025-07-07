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
    await this.page.click('[data-testid="logout-button"]');
  }

  async createTodoList(name, description = '') {
    await this.page.click('[data-testid="create-list-button"]');
    await this.page.waitForSelector('[data-testid="create-list-dialog"]');
    await this.page.fill('input[name="name"]', name);
    if (description) {
      await this.page.fill('textarea[name="description"]', description);
    }
    await this.page.click('[data-testid="create-list-submit"]');
    await this.page.waitForTimeout(1000);
  }

  async createTodoItem(description) {
    await this.page.click('[data-testid="create-item-button"]');
    await this.page.waitForSelector('[data-testid="create-item-dialog"]');
    await this.page.fill('textarea[name="description"]', description);
    await this.page.click('[data-testid="create-item-submit"]');
    await this.page.waitForTimeout(1000);
  }

  async editTodoList(listName, newName, newDescription = '') {
    const listElement = this.page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
    await listElement.locator('button[data-testid="edit-list-button"]').click();
    
    await this.page.fill('input[name="name"]', newName);
    if (newDescription) {
      await this.page.fill('textarea[name="description"]', newDescription);
    }
    await this.page.click('button[data-testid="save-list-button"]');
    await this.page.waitForTimeout(1000);
  }

  async deleteTodoList(listName) {
    const listElement = this.page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
    await listElement.locator('button[data-testid="delete-list-button"]').click();
    await this.page.waitForTimeout(1000);
  }

  async editTodoItem(itemDescription, newDescription) {
    const itemElement = this.page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription });
    await itemElement.locator('[data-testid="edit-item-button"]').click();
    await this.page.waitForSelector('[data-testid="edit-item-dialog"]');
    
    await this.page.fill('textarea[name="description"]', newDescription);
    await this.page.click('button[data-testid="save-item-button"]');
    await this.page.waitForTimeout(1000);
  }

  async toggleTodoItem(itemDescription) {
    const itemElement = this.page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription });
    await itemElement.locator('[data-testid="completion-checkbox"]').click();
    await this.page.waitForTimeout(1000);
  }

  async deleteTodoItem(itemDescription) {
    const itemElement = this.page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription });
    await itemElement.locator('button[data-testid="delete-item-button"]').click();
    await this.page.waitForTimeout(1000);
  }

  async shareTodoList(listName, username, role = 'editor') {
    const listElement = this.page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
    await listElement.locator('[data-testid="share-list-button"]').click();
    await this.page.waitForSelector('[data-testid="share-list-dialog"]');
    
    await this.page.fill('[data-testid="user-search-input"]', username);
    await this.page.selectOption('select[name="role"]', role);
    await this.page.click('[data-testid="share-list-submit"]');
    await this.page.waitForTimeout(1000);
  }

  async navigateToTodoList(listName) {
    const listElement = this.page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
    await listElement.click();
    await this.page.waitForTimeout(1000);
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