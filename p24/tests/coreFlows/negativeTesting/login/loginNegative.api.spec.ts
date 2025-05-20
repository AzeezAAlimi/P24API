import { test, expect } from '@playwright/test';
import { headers } from '../../../../utils/requestHeaders';
import { loginData } from '../../../../data/loginData';

test.describe('Negative Testing - Login', () => {
  test('POST /test/login - invalid credentials - 500', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        ...headers,
      },
      data: loginData.invalidlogin,
    });
    expect(response.status()).toBe(500);
  });

  test('POST /test/login - empty payload - 400', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        ...headers,
      },
      data: loginData.emptyLogin,
    });
    expect(response.status()).toBe(400);
  });
});
