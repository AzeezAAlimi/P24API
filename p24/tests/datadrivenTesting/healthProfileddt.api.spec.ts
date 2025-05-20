import { test, expect } from '@playwright/test';
import { headers } from '../../utils/requestHeaders';
import { healthProfileDataSet } from '../../data/healthProfileData';
import { loginData } from '../../data/loginData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.PERSONALID;
let authToken: string;
let pid: string;

test.describe('Data-Driven Testing - Health Profile', () => {
  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('/api/test/login', {
      headers: {
        ...headers,
      },
      data: loginData.validlogin,
    });
    const body = await loginResponse.json();
    authToken = body.token;

    const userResponse = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
    });
    const userBody = await userResponse.json();
    pid = userBody.patient.id;
  });

  for (const { testName, data, expectedStatus } of healthProfileDataSet) {
    test(`${testName}`, async ({ request }) => {
      const response = await request.put(
        `/api/healthmanager/v1/healthprofiles/${pid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            ...headers,
          },
          data,
        },
      );
      expect(response.status()).toBe(expectedStatus);
    });
  }
});
