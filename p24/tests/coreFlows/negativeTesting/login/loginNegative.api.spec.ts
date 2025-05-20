import { test, expect } from '@playwright/test';
import { loginData } from '../../../../data/loginData';

test.describe('Positive Testing - login', () => {
  test('Negative - POST Login - Invalid login', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: loginData.invalidlogin,
    });
    expect(response.status()).toBe(500);
  });

  test('Negative - POST Login - Empty login', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: loginData.emptyLogin,
    });
    expect(response.status()).toBe(400);
  });
});
