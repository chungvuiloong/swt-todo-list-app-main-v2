const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Todo Item Management', () => {
  let helpers;
  let username, password, listName;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    username = helpers.generateTestUsername();
    password = helpers.generateTestPassword();
    listName = `Test List ${Date.now()}`;
    
    // Register, login, and create a todo list for each test
    await helpers.registerUser(username, password);
    await page.waitForTimeout(2000);
    await helpers.createTodoList(listName);
    await helpers.navigateToTodoList(listName);
    await page.waitForTimeout(1000);
  });

  test.describe('Creating Todo Items', () => {
    test('should create a new todo item @smoke', async ({ page }) => {
      const itemDescription = `Test task ${Date.now()}`;
      
      await helpers.createTodoItem(itemDescription);
      
      // Verify the item appears on the page
      await helpers.expectElementVisible('[data-testid="todo-item"]');
      await helpers.expectText('[data-testid="todo-item"]', itemDescription);
    });

    test('should show validation error for empty todo item description', async ({ page }) => {
      await page.click('[data-testid="create-item-button"]');
      await page.waitForSelector('[data-testid="create-item-dialog"]');
      
      // Try to submit without description
      await page.click('[data-testid="create-item-submit"]');
      await page.waitForTimeout(1000);
      
      // Dialog should still be visible (form validation failed)
      await helpers.expectElementVisible('[data-testid="create-item-dialog"]');
    });

    test('should create multiple todo items', async ({ page }) => {
      const item1 = `First task ${Date.now()}`;
      const item2 = `Second task ${Date.now()}`;
      
      await helpers.createTodoItem(item1);
      await helpers.createTodoItem(item2);
      
      // Both items should be visible
      await helpers.expectText('[data-testid="todo-item"]', item1);
      await helpers.expectText('[data-testid="todo-item"]', item2);
      
      // Should have 2 todo items
      await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(2);
    });
  });

  test.describe('Viewing Todo Items', () => {
    test('should display todo items with correct initial state', async ({ page }) => {
      const itemDescription = `New task ${Date.now()}`;
      
      await helpers.createTodoItem(itemDescription);
      
      // Item should be visible and not completed
      const itemElement = page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription });
      await expect(itemElement).toBeVisible();
      await expect(itemElement).toHaveAttribute('data-completed', 'false');
    });

    test('should show empty state when no todo items exist', async ({ page }) => {
      // Page should show create item button even with no items
      await helpers.expectElementVisible('[data-testid="create-item-button"]');
    });
  });

  test.describe('Editing Todo Items', () => {
    test('should edit todo item description @smoke', async ({ page }) => {
      const originalDescription = `Original task ${Date.now()}`;
      const newDescription = `Updated task ${Date.now()}`;
      
      await helpers.createTodoItem(originalDescription);
      await page.waitForTimeout(1000);
      
      await helpers.editTodoItem(originalDescription, newDescription);
      
      // Verify the item description was updated
      await helpers.expectText('[data-testid="todo-item"]', newDescription);
      await expect(page.locator('[data-testid="todo-item"]').filter({ hasText: originalDescription })).not.toBeVisible();
    });

    test('should cancel editing when cancel button is clicked', async ({ page }) => {
      const originalDescription = `Task to edit ${Date.now()}`;
      
      await helpers.createTodoItem(originalDescription);
      await page.waitForTimeout(1000);
      
      // Start editing but cancel
      const itemElement = page.locator('[data-testid="todo-item"]').filter({ hasText: originalDescription });
      await itemElement.locator('[data-testid="edit-item-button"]').click();
      await page.waitForSelector('[data-testid="edit-item-dialog"]');
      
      // Change text but cancel
      await page.fill('textarea[name="description"]', 'Should not save this');
      await page.click('button[data-testid="cancel-item-button"]');
      await page.waitForTimeout(1000);
      
      // Original description should still be there
      await helpers.expectText('[data-testid="todo-item"]', originalDescription);
    });
  });

  test.describe('Toggle Todo Item Completion', () => {
    test('should toggle todo item completion status @smoke', async ({ page }) => {
      const itemDescription = `Task to complete ${Date.now()}`;
      
      await helpers.createTodoItem(itemDescription);
      await page.waitForTimeout(1000);
      
      // Toggle to completed
      await helpers.toggleTodoItem(itemDescription);
      
      // Item should be marked as completed
      const itemElement = page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription });
      await expect(itemElement).toHaveAttribute('data-completed', 'true');
      
      // Toggle back to incomplete
      await helpers.toggleTodoItem(itemDescription);
      
      // Item should be marked as not completed
      await expect(itemElement).toHaveAttribute('data-completed', 'false');
    });

    test('should show visual indicators for completed items', async ({ page }) => {
      const itemDescription = `Visual test task ${Date.now()}`;
      
      await helpers.createTodoItem(itemDescription);
      await helpers.toggleTodoItem(itemDescription);
      
      // Completed items should have visual indicators (strikethrough, different styling)
      const itemElement = page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription });
      await expect(itemElement).toHaveAttribute('data-completed', 'true');
    });

    test('should maintain completion status after page refresh', async ({ page }) => {
      const itemDescription = `Persistent task ${Date.now()}`;
      
      await helpers.createTodoItem(itemDescription);
      await helpers.toggleTodoItem(itemDescription);
      
      // Refresh the page
      await page.reload();
      await page.waitForTimeout(2000);
      
      // Item should still be completed
      const itemElement = page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription });
      await expect(itemElement).toHaveAttribute('data-completed', 'true');
    });
  });

  test.describe('Deleting Todo Items', () => {
    test('should delete a todo item @smoke', async ({ page }) => {
      const itemDescription = `Task to delete ${Date.now()}`;
      
      await helpers.createTodoItem(itemDescription);
      await page.waitForTimeout(1000);
      
      await helpers.deleteTodoItem(itemDescription);
      
      // Item should no longer be visible
      await expect(page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription })).not.toBeVisible();
    });

    test('should delete completed todo items', async ({ page }) => {
      const itemDescription = `Completed task to delete ${Date.now()}`;
      
      await helpers.createTodoItem(itemDescription);
      await helpers.toggleTodoItem(itemDescription);
      await page.waitForTimeout(1000);
      
      await helpers.deleteTodoItem(itemDescription);
      
      // Item should no longer be visible
      await expect(page.locator('[data-testid="todo-item"]').filter({ hasText: itemDescription })).not.toBeVisible();
    });

    test('should handle deleting multiple items', async ({ page }) => {
      const item1 = `First task to delete ${Date.now()}`;
      const item2 = `Second task to delete ${Date.now()}`;
      
      await helpers.createTodoItem(item1);
      await helpers.createTodoItem(item2);
      await page.waitForTimeout(1000);
      
      // Delete first item
      await helpers.deleteTodoItem(item1);
      
      // First item should be gone, second should remain
      await expect(page.locator('[data-testid="todo-item"]').filter({ hasText: item1 })).not.toBeVisible();
      await helpers.expectText('[data-testid="todo-item"]', item2);
      
      // Delete second item
      await helpers.deleteTodoItem(item2);
      
      // Both items should be gone
      await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(0);
    });
  });

  test.describe('Todo Item Interaction Edge Cases', () => {
    test('should handle rapid item creation', async ({ page }) => {
      const items = [
        `Rapid task 1 ${Date.now()}`,
        `Rapid task 2 ${Date.now() + 1}`,
        `Rapid task 3 ${Date.now() + 2}`
      ];
      
      // Create items quickly
      for (const item of items) {
        await helpers.createTodoItem(item);
      }
      
      // All items should be visible
      await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(3);
      for (const item of items) {
        await helpers.expectText('[data-testid="todo-item"]', item);
      }
    });

    test('should handle long item descriptions', async ({ page }) => {
      const longDescription = 'This is a very long todo item description that should test how the application handles lengthy text content and whether it displays properly without breaking the layout or functionality of the todo item component';
      
      await helpers.createTodoItem(longDescription);
      
      // Item should be created and visible
      await helpers.expectElementVisible('[data-testid="todo-item"]');
      await helpers.expectText('[data-testid="todo-item"]', longDescription);
    });
  });
});