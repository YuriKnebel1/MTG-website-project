import { test, expect } from '@playwright/test';

test('home page loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if the main heading is visible
  await expect(page.locator('h1')).toContainText('MTG Manager');
  
  // Check if login button is visible
  await expect(page.getByRole('link', { name: /entrar/i })).toBeVisible();
});

test('login flow works', async ({ page }) => {
  await page.goto('/');
  
  // Click login button
  await page.getByRole('link', { name: /entrar/i }).click();
  
  // Should be on login page
  await expect(page).toHaveURL('/login');
  
  // Fill login form
  await page.fill('input[type="email"]', 'admin@teste.com');
  await page.fill('input[type="password"]', '123456');
  
  // Submit form
  await page.getByRole('button', { name: /entrar/i }).click();
  
  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
});
