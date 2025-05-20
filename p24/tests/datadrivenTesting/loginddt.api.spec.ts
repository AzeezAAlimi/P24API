import { test, expect } from '@playwright/test';
import { headers } from '../../utils/requestHeaders';
import { loginDataSet } from '../../data/loginData';

for (const { testName, data, expectedStatus } of loginDataSet) {
  test(`${testName}`, async ({ request }) => {
    const loginResponse = await request.post('/api/test/login', {
      headers: {
        ...headers,
      },
      data,
    });
    expect(loginResponse.status()).toBe(expectedStatus);
  });
}
