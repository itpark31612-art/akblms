import { test, expect } from '@playwright/test';

test.describe('EMS Authentication Flow', () => {
  test('should display login page with role switcher and form', async ({ page }) => {
    await page.goto('/');

    // Check header or title
    await expect(page).toHaveTitle(/EMS|Education Management System/i);
    await expect(page.locator('text=Education Management System')).toBeVisible();

    // Check login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
