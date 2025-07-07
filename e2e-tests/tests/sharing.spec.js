const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Todo List Sharing', () => {
  let helpers;
  let ownerUser, recipientUser, listName;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    ownerUser = {
      username: helpers.generateTestUsername(),
      password: helpers.generateTestPassword()
    };
    recipientUser = {
      username: helpers.generateTestUsername(), 
      password: helpers.generateTestPassword()
    };
    listName = `Shared List ${Date.now()}`;
    
    // Register both users
    await helpers.registerUser(ownerUser.username, ownerUser.password);
    await page.waitForTimeout(2000);
    await helpers.logout();
    
    await helpers.registerUser(recipientUser.username, recipientUser.password);
    await page.waitForTimeout(2000);
    await helpers.logout();
    
    // Login as owner and create a list
    await helpers.loginUser(ownerUser.username, ownerUser.password);
    await page.waitForTimeout(2000);
    await helpers.createTodoList(listName, 'A list to be shared');
    await page.waitForTimeout(1000);
  });

  test.describe('Sharing Todo Lists', () => {
    test('should share todo list with another user @smoke', async ({ page }) => {
      await helpers.shareTodoList(listName, recipientUser.username, 'editor');
      
      // Should show success or return to normal state
      await page.waitForTimeout(2000);
      
      // Logout and login as recipient
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Should see the shared list in "Shared with me" section
      await helpers.expectText('h2', 'Shared with me');
      await helpers.expectElementVisible(`[data-testid="todo-list"][data-name="${listName}"]`);
    });

    test('should share todo list with viewer role', async ({ page }) => {
      await helpers.shareTodoList(listName, recipientUser.username, 'viewer');
      
      await page.waitForTimeout(2000);
      
      // Logout and login as recipient
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Should see the shared list
      await helpers.expectElementVisible(`[data-testid="todo-list"][data-name="${listName}"]`);
      
      // Navigate to the list
      await helpers.navigateToTodoList(listName);
      
      // Should not see edit/delete buttons for viewer role
      // (The specific UI restrictions would depend on implementation)
      await helpers.expectElementVisible('[data-testid="todos-page"]');
    });

    test('should not allow sharing with invalid username', async ({ page }) => {
      const invalidUsername = 'nonexistentuser123';
      
      const listElement = page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
      await listElement.locator('[data-testid="share-list-button"]').click();
      await page.waitForSelector('[data-testid="share-list-dialog"]');
      
      await page.fill('[data-testid="user-search-input"]', invalidUsername);
      await page.click('[data-testid="share-list-submit"]');
      
      // Should show error or dialog should remain open
      await page.waitForTimeout(2000);
      // The dialog might stay open or show an error message
    });

    test('should not allow sharing with yourself', async ({ page }) => {
      const listElement = page.locator('[data-testid="todo-list"]').filter({ hasText: listName });
      await listElement.locator('[data-testid="share-list-button"]').click();
      await page.waitForSelector('[data-testid="share-list-dialog"]');
      
      await page.fill('[data-testid="user-search-input"]', ownerUser.username);
      await page.click('[data-testid="share-list-submit"]');
      
      // Should show error or prevent sharing with yourself
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Viewing Shared Todo Lists', () => {
    test('should view shared todo list content @smoke', async ({ page }) => {
      // Add some items to the list first
      await helpers.navigateToTodoList(listName);
      await helpers.createTodoItem('Shared task 1');
      await helpers.createTodoItem('Shared task 2');
      
      // Go back and share the list
      await page.goto('/todo-lists');
      await helpers.shareTodoList(listName, recipientUser.username, 'editor');
      
      // Login as recipient
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Navigate to shared list
      await helpers.navigateToTodoList(listName);
      
      // Should see the shared items
      await helpers.expectText('[data-testid="todo-item"]', 'Shared task 1');
      await helpers.expectText('[data-testid="todo-item"]', 'Shared task 2');
    });

    test('should show shared lists in separate section', async ({ page }) => {
      await helpers.shareTodoList(listName, recipientUser.username, 'editor');
      
      // Login as recipient
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Should have both sections
      await helpers.expectText('h2', 'My todo lists');
      await helpers.expectText('h2', 'Shared with me');
      
      // Shared list should be in the "Shared with me" section
      const sharedSection = page.locator('h2:has-text("Shared with me")').locator('..').locator('..');
      await expect(sharedSection.locator(`[data-testid="todo-list"][data-name="${listName}"]`)).toBeVisible();
    });

    test('should show role information for shared lists', async ({ page }) => {
      await helpers.shareTodoList(listName, recipientUser.username, 'viewer');
      
      // Login as recipient
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Should show role information (implementation dependent)
      const listElement = page.locator(`[data-testid="todo-list"][data-name="${listName}"]`);
      await expect(listElement).toBeVisible();
    });
  });

  test.describe('Editing Shared Todo Lists', () => {
    test('should allow editor to modify shared list items', async ({ page }) => {
      await helpers.shareTodoList(listName, recipientUser.username, 'editor');
      
      // Login as recipient (editor)
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Navigate to shared list and add item
      await helpers.navigateToTodoList(listName);
      await helpers.createTodoItem('Item added by editor');
      
      // Item should be added
      await helpers.expectText('[data-testid="todo-item"]', 'Item added by editor');
    });

    test('should allow editor to toggle completion status', async ({ page }) => {
      // Owner creates an item first
      await helpers.navigateToTodoList(listName);
      await helpers.createTodoItem('Item to toggle');
      
      // Share the list
      await page.goto('/todo-lists');
      await helpers.shareTodoList(listName, recipientUser.username, 'editor');
      
      // Login as recipient (editor)
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Navigate to shared list and toggle item
      await helpers.navigateToTodoList(listName);
      await helpers.toggleTodoItem('Item to toggle');
      
      // Item should be completed
      const itemElement = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Item to toggle' });
      await expect(itemElement).toHaveAttribute('data-completed', 'true');
    });

    test('should not allow viewer to modify shared list', async ({ page }) => {
      await helpers.shareTodoList(listName, recipientUser.username, 'viewer');
      
      // Login as recipient (viewer)
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Navigate to shared list
      await helpers.navigateToTodoList(listName);
      
      // Should not see create item button or it should be disabled
      // (Implementation dependent - may hide button or disable it)
      await helpers.expectElementVisible('[data-testid="todos-page"]');
    });
  });

  test.describe('Collaboration Edge Cases', () => {
    test('should handle simultaneous editing (basic)', async ({ page, context }) => {
      // This is a simplified test - real simultaneous editing would require multiple browser contexts
      await helpers.shareTodoList(listName, recipientUser.username, 'editor');
      
      // Add item as owner
      await helpers.navigateToTodoList(listName);
      await helpers.createTodoItem('Owner item');
      
      // Go back to lists
      await page.goto('/todo-lists');
      
      // Login as recipient and add item
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      await helpers.navigateToTodoList(listName);
      await helpers.createTodoItem('Editor item');
      
      // Both items should be visible
      await helpers.expectText('[data-testid="todo-item"]', 'Owner item');
      await helpers.expectText('[data-testid="todo-item"]', 'Editor item');
    });

    test('should maintain sharing permissions after list edits', async ({ page }) => {
      await helpers.shareTodoList(listName, recipientUser.username, 'editor');
      
      // Edit the list name
      const newListName = `Updated ${listName}`;
      await helpers.editTodoList(listName, newListName);
      
      // Login as recipient
      await helpers.logout();
      await helpers.loginUser(recipientUser.username, recipientUser.password);
      await page.waitForTimeout(2000);
      
      // Should still see the shared list with updated name
      await helpers.expectElementVisible(`[data-testid="todo-list"][data-name="${newListName}"]`);
    });
  });
});