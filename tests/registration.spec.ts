import { test, expect } from '@playwright/test';

test.describe('Registration Flow E2E Tests', () => {
  test('Form Validation - displays required error messages when submitted empty', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/');

    // Verify main form header is displayed
    await expect(page.getByText('Request Event Pass')).toBeVisible();

    // Click submit button without filling any fields
    const submitButton = page.getByRole('button', { name: /Register for VIP Access/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Verify validation error messages for First Name, Last Name, Company, Position, and Email
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('Company name is required')).toBeVisible();
    await expect(page.getByText('Position / Title is required')).toBeVisible();
    await expect(page.getByText('Email address is required')).toBeVisible();
  });

  test('Valid Submission & Success Card Transition - registers guest and presents VIP ticket preview', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/');

    // Fill in valid registration form fields
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#company', 'Mastercard Inc');
    await page.fill('#position', 'VP Engineering');
    await page.fill('#email', 'john.doe.e2e@example.com');

    // Submit the form
    const submitButton = page.getByRole('button', { name: /Register for VIP Access/i });
    await submitButton.click();

    // Wait for transition to Success Card
    await expect(page.getByText('VIP Pass Issued')).toBeVisible({ timeout: 15000 });

    // Verify recipient name and company details on the VIP ticket
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Mastercard Inc')).toBeVisible();

    // Verify QR ticket preview section
    await expect(page.getByText('Check-in QR')).toBeVisible();

    // Verify Download PDF Ticket button
    const downloadPdfButton = page.getByRole('button', { name: /Download Ticket \(PDF\)/i });
    await expect(downloadPdfButton).toBeVisible();

    // Verify Add to Google Wallet button
    const googleWalletButton = page.getByRole('button', { name: /Google Wallet/i });
    await expect(googleWalletButton).toBeVisible();
  });
});
