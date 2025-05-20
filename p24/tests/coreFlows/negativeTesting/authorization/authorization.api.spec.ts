import { test, expect } from '@playwright/test';
import { expiredToken, malformedToken } from '../../../../utils/authTokens';

test.describe('Authorization scenarios', () => {
  test('Token missing - 401', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me');
    expect(response.status()).toBe(401);
  });

  test('Token expired - 401', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('Malformed token - 401', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${malformedToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(401);
  });
});
