import { test, expect } from '@playwright/test';
import { headers } from '../../../../utils/requestHeaders';
import { expiredToken, malformedToken } from '../../../../utils/authTokens';

test.describe('Negative Testing - Authorization scenarios', () => {
  test('GET /users/me - missing token - 401', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me');
    expect(response.status()).toBe(401);
  });

  test('GET /users/me - expired token - 401', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
        ...headers,
      },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /users/me - malformed token - 401', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${malformedToken}`,
        ...headers,
      },
    });
    expect(response.status()).toBe(401);
  });
});
