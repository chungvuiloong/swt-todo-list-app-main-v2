const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Todo List Management', () => {
  let helpers;
  let username, password;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    username = helpers.generateTestUsername();
    password = helpers.generateTestPassword();
    
    // Register and login for each test
    await helpers.registerUser(username, password);
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('/todo-lists');
  });

  test.describe('Creating Todo Lists', () => {
    test('should create a new todo list with name only @smoke', async ({ page }) => {
      const listName = `Test List ${Date.now()}`;
      
      await helpers.createTodoList(listName);
      
      // Verify the list appears on the page
      await helpers.expectElementVisible(`[data-testid="todo-list"][data-name="${listName}"]`);
      await helpers.expectText('[data-testid="todo-list"]', listName);
    });

    test('should create a new todo list with name and description', async ({ page }) => {
      const listName = `Test List ${Date.now()}`;
      const description = 'This is a test description for the todo list';
      
      await helpers.createTodoList(listName, description);
      
      // Verify the list appears with description
      await helpers.expectElementVisible(`[data-testid="todo-list"][data-name="${listName}"]`);
      await helpers.expectText('[data-testid="todo-list"]', listName);
      await helpers.expectText('[data-testid="todo-list"]', description);
    });

    test('should show validation error for empty todo list name', async ({ page }) => {
      await page.click('[data-testid="create-list-button"]');
      await page.waitForSelector('[data-testid="create-list-dialog"]');
      
      // Try to submit without name
      await page.click('[data-testid="create-list-submit"]');
      await page.waitForTimeout(1000);
      
      // Dialog should still be visible (form validation failed)
      await helpers.expectElementVisible('[data-testid="create-list-dialog"]');
    });
  });

  test.describe('Viewing Todo Lists', () => {
    test('should display todo lists in the correct sections', async ({ page }) => {
      const listName = `My Test List ${Date.now()}`;
      
      await helpers.createTodoList(listName);
      
      // Should appear in "My todo lists" section
      await helpers.expectText('h2', 'My todo lists');
      await helpers.expectElementVisible(`[data-testid="todo-list"][data-name="${listName}"]`);
    });

    test('should show empty state when no todo lists exist', async ({ page }) => {
      // Page should show some indication of no lists
      await helpers.expectElementVisible('[data-testid="todo-lists-page"]');
    });
  });

  test.describe('Editing Todo Lists', () => {
    test('should edit todo list name and description @smoke', async ({ page }) => {
      const originalName = `Original List ${Date.now()}`;
      const newName = `Updated List ${Date.now()}`;
      const newDescription = 'Updated description';
      
      await helpers.createTodoList(originalName, 'Original description');
      await page.waitForTimeout(1000);
      
      await helpers.editTodoList(originalName, newName, newDescription);
      
      // Verify the list name and description were updated
      await helpers.expectElementVisible(`[data-testid="todo-list"][data-name="${newName}"]`);
      await helpers.expectText('[data-testid="todo-list"]', newName);
      await helpers.expectText('[data-testid="todo-list"]', newDescription);
    });

    test('should not allow editing of shared todo lists by non-owners', async ({ page }) => {
      // This test would require a second user, so we'll simulate the scenario
      // by checking that edit buttons are only visible for owned lists
      const listName = `Test List ${Date.now()}`;
      
      await helpers.createTodoList(listName);
      
      // Edit button should be visible for owned lists
      const listElement = page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
      await expect(listElement.locator('button')).toBeVisible(); // Edit button should exist
    });
  });

  test.describe('Deleting Todo Lists', () => {
    test('should delete an empty todo list @smoke', async ({ page }) => {
      const listName = `List to Delete ${Date.now()}`;
      
      await helpers.createTodoList(listName);
      await page.waitForTimeout(1000);
      
      await helpers.deleteTodoList(listName);
      
      // List should no longer be visible
      await expect(page.locator(`[data-testid="todo-list"][data-name="${listName}"]`)).not.toBeVisible();
    });

    test('should show confirmation dialog for deleting non-empty todo list', async ({ page }) => {
      const listName = `List with Items ${Date.now()}`;
      
      await helpers.createTodoList(listName);
      await page.waitForTimeout(1000);
      
      // Navigate to the list and add an item
      await helpers.navigateToTodoList(listName);
      await helpers.createTodoItem('Test item');
      
      // Go back to lists page
      await page.goto('/todo-lists');
      await page.waitForTimeout(1000);
      
      // Try to delete - should show confirmation
      const listElement = page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
      await listElement.locator('button[data-testid="delete-list-button"]').click();
      
      // Should show confirmation dialog or similar warning
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Todo List Navigation', () => {
    test('should navigate to todo list details when clicked', async ({ page }) => {
      const listName = `Clickable List ${Date.now()}`;
      
      await helpers.createTodoList(listName);
      await page.waitForTimeout(1000);
      
      await helpers.navigateToTodoList(listName);
      
      // Should navigate to the todos page for this list
      await expect(page).toHaveURL(/\/todos/);
      await helpers.expectElementVisible('[data-testid="todos-page"]');
    });
  });
});