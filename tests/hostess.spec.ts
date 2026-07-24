import { test, expect } from '@playwright/test';

test.describe('Hostess Portal & Access Control E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage & cookies prior to each test to ensure unauthenticated state
    await page.goto('/hostess');
    await page.evaluate(() => {
      sessionStorage.clear();
      document.cookie = 'hostess_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
    await page.reload();
  });

  test('Auth Protection & Modal - displays login prompt and hides protected content when unauthenticated', async ({ page }) => {
    // Verify Hostess Access Gate modal is visible
    await expect(page.getByRole('heading', { name: /Hostess Access Gate/i })).toBeVisible();
    await expect(page.getByPlaceholder('Enter access password...')).toBeVisible();

    // Verify protected main terminal content is hidden
    await expect(page.getByText('Mastercard VIP Guest Scanning & Management')).not.toBeVisible();
  });

  test('Invalid & Valid Auth - shows error feedback on failure and logs in on valid password', async ({ page }) => {
    // Attempt login with invalid password
    await page.fill('input[type="password"]', 'invalid_password_123');
    await page.getByRole('button', { name: /Authenticate Access/i }).click();

    // Verify failure feedback
    await expect(page.getByText('Invalid Hostess Access Password. Please try again.')).toBeVisible();

    // Attempt login with valid password
    await page.fill('input[type="password"]', 'mastercard2026');
    await page.getByRole('button', { name: /Authenticate Access/i }).click();

    // Verify successful login transition to Hostess Terminal
    await expect(page.getByText('Hostess Terminal')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Live Auth')).toBeVisible();
  });

  test('Dashboard Layout & Visitors Table - renders scanner and visitor registry table upon authentication', async ({ page }) => {
    // Authenticate with valid password
    await page.fill('input[type="password"]', 'mastercard2026');
    await page.getByRole('button', { name: /Authenticate Access/i }).click();
    await expect(page.getByText('Hostess Terminal')).toBeVisible();

    // Switch to Split View tab to verify both QR Camera Scanner and Visitor Table together
    await page.getByRole('button', { name: /Split View/i }).click();

    // Verify Hostess Scanner section
    await expect(page.getByText('Live Camera Scanner')).toBeVisible();

    // Verify Visitors Table section headers and structure
    await expect(page.getByText('Guest Name')).toBeVisible();
    await expect(page.getByText('Company & Position')).toBeVisible();
    await expect(page.getByText('Status')).toBeVisible();
    await expect(page.getByText('Check-in Time')).toBeVisible();
  });
});
