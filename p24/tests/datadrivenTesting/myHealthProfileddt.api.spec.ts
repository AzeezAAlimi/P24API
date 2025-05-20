import { test, expect } from '@playwright/test';
import { healthProfileDataSet } from '../../data/healthProfileData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.PERSONALID;
let authToken: string;
let pid: string;

test.describe('Data-Driven Testing - Health Profile', () => {
  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('/api/test/login', {
      headers: {
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      data: {
        surname: 'Hansson',
        givenName: 'Alex',
        nationalPersonalId: personalId,
        personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
      },
    });
    const body = await loginResponse.json();
    authToken = body.token;

    const userResponse = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
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
            'X-Origin': 'doktor24',
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
          },
          data,
        },
      );
      expect(response.status()).toBe(expectedStatus);
    });
  }
});
