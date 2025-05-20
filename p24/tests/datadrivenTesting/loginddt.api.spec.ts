import { test, expect } from '@playwright/test';
import { loginDataSet } from '../../data/loginData';

for (const { testName, data, expectedStatus } of loginDataSet) {
  test(`${testName}`, async ({ request }) => {
    const loginResponse = await request.post('/api/test/login', {
      headers: {
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      data,
    });

    expect(loginResponse.status()).toBe(expectedStatus);
  });
}
