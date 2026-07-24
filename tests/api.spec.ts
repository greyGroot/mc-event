import { test, expect } from '@playwright/test';

test.describe('API Endpoint Direct Testing - /api/register', () => {
  test('Test 1: Send empty body {} to /api/register - returns 400 and error validation details', async ({ request }) => {
    const response = await request.post('/api/register', {
      data: {},
    });

    expect(response.status()).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty('error');
    expect(json).toHaveProperty('details');
  });

  test('Test 2: Send payload with invalid email to /api/register - returns 400 validation error', async ({ request }) => {
    const response = await request.post('/api/register', {
      data: {
        firstName: 'Test',
        lastName: 'User',
        company: 'MC',
        position: 'Dev',
        email: 'invalid-email',
      },
    });

    expect(response.status()).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty('error');
    expect(json).toHaveProperty('details');
  });

  test('Test 3: Send valid registration payload to /api/register - returns 200 and success response with guestId', async ({ request }) => {
    const response = await request.post('/api/register', {
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'Mastercard International',
        position: 'Director of Technology',
        email: 'jane.smith.api@example.com',
      },
    });

    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json).toMatchObject({
      success: true,
      guestId: expect.any(String),
    });
  });
});
